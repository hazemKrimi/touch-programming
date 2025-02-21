import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import TypingContextProvider from 'contexts/typing';

import { isMobileBrowser } from 'utils';

import Code from 'components/Code';
import Stats from 'components/Stats';

import './index.css';

function Typing() {
  const isMobile = isMobileBrowser();
  const [code, setCode] = useState<string>('');
  const [loaded, setLoaded] = useState<boolean>(false);
  const { lang } = useParams();

  useEffect(() => {
    if (isMobile) return;

    (async function () {
      setCode('');

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/generate?lang=${lang}`,
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
  }, [isMobile, lang]);

  if (isMobile) {
    return (
      <div className='typing-container'>
        <header>
          <span>This app is made to be used in a desktop device.</span>
        </header>
      </div>
    );
  }

  return (
    <TypingContextProvider>
      <div className='typing-container'>
        <header>
          <h1>
            Practice Typing in {lang}
          </h1>
        </header>
        <Code code={code} loaded={loaded} />
        <Stats loaded={loaded} />
      </div>
    </TypingContextProvider>
  );
}

export default Typing;
