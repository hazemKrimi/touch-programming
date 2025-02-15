import { useEffect } from 'react';

import { useTypingContext } from 'contexts/typing';

import { KEYS_TO_DISABLE } from 'constants/default';

import { renderCharacter } from './utils';

import './index.css';

type CodeProps = {
  code: string;
  loaded: boolean;
}

function Code({code, loaded}: CodeProps) {
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
      if (characters.length === code.length) {
        setStartedTyping(false);

        return;
      }
      if (KEYS_TO_DISABLE.includes(event.key)) return;

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
    const typed = characters.filter(char => char !== 'space').length;
    const correctlyTyped = characters.filter(char => char && char !== 'space').length;
    const incorrectlyTyped = characters.filter(char => !char).length;

    if (timer > 0) {
      setScore((typed / 5 - incorrectlyTyped) / (timer / 60));
      setAccuracy(correctlyTyped / typed * 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, characters]);

  return (
    <div className='code'>
      {code.split('').map((char, index) => renderCharacter(code, characters, loaded, char, index))}
    </div>
  );
}

export default Code;
