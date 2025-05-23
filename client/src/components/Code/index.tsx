import { useEffect } from 'react';

import { useTypingContext } from 'contexts/typing';

import { KEYS_TO_DISABLE } from 'constants/default';

import { renderCharacter } from './utils';

import './index.css';
import Spinner from 'components/Spinner';

type CodeProps = {
  code: string;
  loaded: boolean;
  error: boolean;
}

function Code({ code, error, loaded }: CodeProps) {
  const {
    startedTyping,
    characters,
    timer,

    setStartedTyping,
    setCharacters,
    setScore,
    setAccuracy,
  } = useTypingContext();

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      event.preventDefault();

      if (!loaded) return;
      if (KEYS_TO_DISABLE.includes(event.key)) return;
      if (characters.length === code.length) return;
      if (!startedTyping) setStartedTyping(true);

      const char = code[characters.length];

      if (/^\n$/.test(char)) {
        const traversedCharacters: Array<boolean | 'space'> = [event.key === 'Enter'];
        let numberOfTraversedCharacters = characters.length + 1;
        let space = code[numberOfTraversedCharacters];

        while (/^\s$/.test(space)) {
          traversedCharacters.push('space');
          numberOfTraversedCharacters++;
          space = code[numberOfTraversedCharacters];
        }

        return setCharacters(characters.concat(...traversedCharacters));
      }

      setCharacters(characters.concat(event.key === char));
    }

    window.addEventListener('keydown', handleKeyPress);

    return () => window.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, characters]);

  useEffect(() => {
    if (characters.length === code.length) setStartedTyping(false);

    const typed = characters.filter(char => char !== 'space').length;
    const correctlyTyped = characters.filter(char => char && char !== 'space').length;
    const incorrectlyTyped = characters.filter(char => !char).length;

    if (timer > 0) {
      setScore(Math.abs(typed / 5 - incorrectlyTyped) / (timer / 60));
      setAccuracy(correctlyTyped / typed * 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, characters]);
  
  if (error) return (
    <div className='code-container'>
      <p>There was an error fetching the code. Please try again later!</p>
    </div>
  );

  if (!code) return (
    <div className='code-container'>
      <Spinner />
    </div>
  );

  return (
    <div className='code-container'>
      {code.split('').map((char, index) => renderCharacter(code, characters, loaded, char, index))}
    </div>
  );
}

export default Code;
