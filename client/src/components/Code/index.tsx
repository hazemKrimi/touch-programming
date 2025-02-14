import { useEffect, useState } from 'react';
import { KEYS_TO_DISABLE } from 'constants/default';

import './index.css';

function Code() {
  // TODO: Cleanup the file and create utils for trimming the code properly.
  // TODO: Create a function that combines a sequence of spaces into tabs.
  const [code, setCode] = useState<string>('');
  const [loaded, setLoaded] = useState<boolean>(false);
  const [characters, setCharacters] = useState<Array<boolean | 'space'>>([]);

  useEffect(() => {
    (async function () {
      setCode('');

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/generate?lang=typescript`,
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
    function handleKeyPress(event: KeyboardEvent) {
      event.preventDefault();

      if (!loaded) return;
      if (characters.length === code.length) return;
      if (KEYS_TO_DISABLE.includes(event.key)) return;

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
      {code.split('').map((char, index) => renderCharacter(char, index))}
    </div>
  );
}

export default Code;
