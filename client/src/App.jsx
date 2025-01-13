import { useEffect, useState } from 'react';
import './App.css';

const KEYS_TO_DISABLE = ['Backspace', 'Shift', 'Alt', 'Control', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'Escape', 'Delete', 'PageDown', 'PageUp', 'Home', 'End', 'Insert', 'WakeUp', 'Pause', 'ScrollLock', 'ContextMenu', 'BrowserForward', 'BrowserBack', 'CapsLock', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

function App() {
	const [code, setCode] = useState('');
	const [loaded, setLoaded] = useState(false);
	const [characters, setCharacters] = useState([]);

	useEffect(() => {
		(async function() {
			const response = await fetch('http://localhost:5000/generate?lang=golang&lines=10');
			const reader = response.body.getReader();
			const decoder = new TextDecoder();

			while(true) {
				const {value, done} = await reader.read();

				setCode(prev => prev + decoder.decode(value));

				if (done) {
					setLoaded(true);
					break;
				}
			}
		})();
	}, []);

	useEffect(() => {
		function handleKeyPress(event) {
			event.preventDefault();

			if (!loaded) return;
			if (characters.length === code.length) return;
			if (KEYS_TO_DISABLE.includes(event.key)) return;
			if (code[characters.length] === '\n')
				return setCharacters(
					characters.concat(event.key === 'Enter')
				);
			if (code[characters.length] === '\t')
				return setCharacters(
					characters.concat(event.key === 'Tab')
				);

			setCharacters(
				characters.concat(event.key === code[characters.length])
			);
		}

		window.addEventListener('keydown', handleKeyPress);

		return () => window.removeEventListener('keydown', handleKeyPress);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loaded, characters]);

	function renderCharacterClassName(index) {
		if (index === characters.length) return 'highlight'
		if (typeof characters[index] === 'undefined') return 'pending'
		if (!characters[index]) return 'incorrect'

		return 'correct'
	}

	// TODO: Remove rendering of spacing characters and render a cursor with the highlight instead.
	// TODO: Or look into pretty printing libraries.
	function renderSpacingCharacter(char) {
		if (/^\n$/.test(char)) return 'enter'
		if (/^\t$/.test(char)) return 'tab'
		if (/^\s$/.test(char)) return 'space'

		return ''
	}

	function renderClassName(index, char) {
		return `${renderCharacterClassName(index)} ${renderSpacingCharacter(char)}`.trim();
	}

	return <div className='container'>{code.split('').map((char, index) => (
		<span className={renderClassName(index, char)} key={char + index}>{char}</span>
	))}</div>;
}

export default App;
