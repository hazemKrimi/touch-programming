import { useEffect, useState } from 'react';
import { KEYS_TO_DISABLE } from 'constants/default';

import './index.css';

function Code() {
  // TODO: Cleanup the file and create utils for trimming the code properly.
  // TODO: Create a function that combines a sequence of spaces into tabs.
  const [code, setCode] = useState<string>('');
  const [loaded, setLoaded] = useState<boolean>(false);
  const [startedTyping, setStartedTyping] = useState<boolean>(false);
  const [characters, setCharacters] = useState<Array<boolean | 'space'>>([]);
  const [timer, setTimer] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);

  useEffect(() => {
    (async function () {
      setCode('');

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/generate?lang=lisp`,
      );

      if (!response.ok || !response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();

        setCode((prev) => prev + decoder.decode(value));

        if (done) {
          break;
        }
      }

      setCode((prev) => prev.trim());
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    let interval = null;

    if (!startedTyping) {
      if (interval) clearInterval(interval);

      return;
    }

    interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startedTyping]);

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
  }, [timer, characters]);

  function renderCharacterClassName(index: number) {
    const typed = characters[index];

    if (loaded && index === characters.length) return 'highlight';
    if (typeof typed === 'undefined') return 'pending';
    if (typed === 'space') return 'space';
    if (!typed && /^\n$/.test(code[index])) return 'incorrect-enter';
    if (!typed && /^\s$/.test(code[index])) return 'incorrect-space';
    if (!typed) return 'incorrect';

    return 'correct';
  }

  function renderSpacingCharacter(char: string) {
    if (/^\n$/.test(char)) return '\n';
    if (/^(\s|\t)$/.test(char)) return '\u00A0';

    return char;
  }

  function renderClassName(index: number) {
    return `${renderCharacterClassName(index)}`.trim();
  }

  function renderCharacter(char: string, index: number) {
    const rendered = renderSpacingCharacter(char);

    if (/^\n$/.test(rendered)) {
      return (
        <span className={renderClassName(index)} key={char + index}>
          <br />
        </span>
      );
    }

    return (
      <span className={renderClassName(index)} key={char + index}>
        {rendered}
      </span>
    );
  }

  return (
    <div className='container'>
      <div className='code'>
        {code.split('').map((char, index) => renderCharacter(char, index))}
      </div>
      <div className='score'>
        <p>Time: {timer}</p>
        <p>WPM: {Math.round(score)}</p>
        <p>Accuracy: {Math.round(accuracy)}%</p>
      </div>
    </div>
  );
}

export default Code;
