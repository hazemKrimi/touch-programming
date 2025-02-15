import { useEffect, useState } from 'react';

import TypingContextProvider from 'contexts/typing';

import Code from 'components/Code';
import Stats from 'components/Stats';

import './index.css';

function Typing() {
  const [code, setCode] = useState<string>('');
  const [loaded, setLoaded] = useState<boolean>(false);

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

  return (
    <TypingContextProvider>
      <div className='container'>
        <Code code={code} loaded={loaded} />
        <Stats />
      </div>
    </TypingContextProvider>
  );
}

export default Typing;
