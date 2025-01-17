import { useEffect, useState } from 'react';
import './App.css';

const KEYS_TO_DISABLE = ['Backspace', 'Shift', 'Alt', 'Control', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'Escape', 'Delete', 'PageDown', 'PageUp', 'Home', 'End', 'Insert', 'WakeUp', 'Pause', 'ScrollLock', 'ContextMenu', 'BrowserForward', 'BrowserBack', 'CapsLock', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

function App() {
	// TODO: Cleanup the file and create utils for spacing and trimming the code properly.
	const [code, setCode] = useState('');
	const [loaded, setLoaded] = useState(false);
	const [characters, setCharacters] = useState([]);

	useEffect(() => {
		(async function() {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/generate?lang=typescript&lines=20`);
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
			
			const char = code[characters.length];

			if (/^\n$/.test(char))
				return setCharacters(
					characters.concat(event.key === 'Enter')
				);
			if (/^(\s|\t)$/.test(char))
				return setCharacters(
					characters.concat(['Space', 'Tab'].includes(event.key))
				);

			setCharacters(
				characters.concat(event.key === char)
			);
		}

		window.addEventListener('keydown', handleKeyPress);

		return () => window.removeEventListener('keydown', handleKeyPress);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loaded, characters]);

	function renderCharacterClassName(index) {
		const typed = characters[index];

		if (loaded && index === characters.length) return 'highlight';
		if (typeof typed === 'undefined') return 'pending';
		if (!typed) return 'incorrect';

		return 'correct';
	}

	function renderSpacingCharacter(char) {
		if (/^\n$/.test(char)) return '\n';
		if (/^(\s|\t)$/.test(char)) return '\u00A0'

		return char;
	}

	function renderClassName(index) {
		return `${renderCharacterClassName(index)}`.trim();
	}

	function renderCharacter(char, index) {
		const rendered = renderSpacingCharacter(char);

		if (/^\n$/.test(rendered)) {
			return <span className={renderClassName(index)} key={char + index}><br /></span>
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

export default App;
