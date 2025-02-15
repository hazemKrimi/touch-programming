function renderCharacterClassName(
  code: string,
  characters: Array<boolean | 'space'>,
  loaded: boolean,
  index: number,
) {
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

function renderClassName(
  code: string,
  characters: Array<boolean | 'space'>,
  loaded: boolean,
  index: number,
) {
  return `${renderCharacterClassName(code, characters, loaded, index)}`.trim();
}

export function renderCharacter(
  code: string,
  characters: Array<boolean | 'space'>,
  loaded: boolean,
  char: string,
  index: number,
) {
  const rendered = renderSpacingCharacter(char);

  if (/^\n$/.test(rendered)) {
    return (
      <span className={renderClassName(code, characters, loaded, index)} key={char + index}>
        <br />
      </span>
    );
  }

  return (
    <span className={renderClassName(code, characters, loaded, index)} key={char + index}>
      {rendered}
    </span>
  );
}
