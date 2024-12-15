import { useEffect, useState } from 'react';
import './App.css';

const KEYS_TO_DISABLE = ['Backspace', 'Shift', 'Alt', 'Control', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'Escape', 'Delete', 'PageDown', 'PageUp', 'Home', 'End', 'Insert', 'WakeUp', 'Pause', 'ScrollLock', 'ContextMenu', 'BrowserForward', 'BrowserBack', 'CapsLock', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const SNIPPET = 'ctx := context.Background();\nconsole.log("hello");\nfunction() {\n\talert(123);\n}';

function App() {
	const [characters, setCharacters] = useState([]);

	useEffect(() => {
		function handleKeyPress(event) {
			event.preventDefault();

			if (characters.length === SNIPPET.length) return;
			if (KEYS_TO_DISABLE.includes(event.key)) return;
			if (SNIPPET[characters.length] === '\n')
				return setCharacters(
					characters.concat(event.key === 'Enter')
				);
			if (SNIPPET[characters.length] === '\t')
				return setCharacters(
					characters.concat(event.key === 'Tab')
				);

			setCharacters(
				characters.concat(event.key === SNIPPET[characters.length])
			);
		}

		window.addEventListener('keydown', handleKeyPress);

		return () => window.removeEventListener('keydown', handleKeyPress);
	}, [characters]);

	function renderCharacterClassName(index) {
		if (index === characters.length) return 'highlight'
		if (typeof characters[index] === 'undefined') return 'pending'
		if (!characters[index]) return 'incorrect'

		return 'correct'
	}

	function renderSpacingCharacter(char) {
		if (/^\t$/.test(char)) return 'tab'
		if (/^\n$/.test(char)) return 'enter'
		if (/^\s$/.test(char)) return 'space'

		return ''
	}

	return <div className='container'>{SNIPPET.split('').map((char, index) => (
		<span className={`${renderCharacterClassName(index)} ${renderSpacingCharacter(char)}`} key={char + index}>{char}</span>
	))}</div>;
}

export default App;
