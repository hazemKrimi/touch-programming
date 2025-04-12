import { NavLink } from 'react-router';

import { isMobileBrowser } from 'utils';

import './index.css';

function Home() {
  const isMobile = isMobileBrowser();

  return (
    <div className='home-container'>
      <header>
        <h1>Touch Programming</h1>
        <p>Master touch typing with real code snippets from your favorite programming languages, <a href='https://github.com/hazemKrimi/touch-programming' target='_blank' rel="noreferrer">Open Source</a> and powered by AI.</p>
        <NavLink to='/languages'>
          {isMobile ?
            <span>This app is made to be used in a desktop device.</span> :
            <button className='cta'>
              Start Typing
            </button>
          }
        </NavLink>
      </header>

      <section className='features'>
        <div className='feature'>
          <h3>Real Code Snippets</h3>
          <p>
            Practice with actual code examples from popular repositories, making your learning relevant to real-world
            programming.
          </p>
        </div>
        <div className='feature'>
          <h3>Multiple Languages</h3>
          <p>
            Choose from Python, JavaScript, TypeScript, Rust, and more. Practice with the languages you use daily.
          </p>
        </div>
        <div className='feature'>
          <h3>AI Powered</h3>
          <p>
            Code is generated with the help of the Open Source LLM Models.
          </p>
        </div>
      </section>

      <section className='benefits'>
        <h2>Why Practice Touch Programming?</h2>
        <div className='benefits-wrapper'>
          <div className='benefit'>
            <h3>Boost Productivity</h3>
            <p>Increase your coding speed and reduce errors with proper typing technique</p>
          </div>
          <div className='benefit'>
            <h3>Learn Syntax</h3>
            <p>
              Familiarize yourself with language syntax while improving your typing speed
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
