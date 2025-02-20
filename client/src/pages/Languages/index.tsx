import { NavLink } from 'react-router';

import { isMobileBrowser } from 'utils';

import { SUPPORTED_LANGUAGES } from 'constants/default';

import './index.css';

function Languages() {
  const isMobile = isMobileBrowser();

  if (isMobile) {
    return (
      <div className='languages-container'>
        <header>
          <span>This app is made to be used in a desktop device.</span>
        </header>
      </div>
    );
  }

  return (
    <div className='languages-container'>
      <header>
        <h1>Choose Your Preferred Language</h1>
      </header>
      <div className='languages-wrapper'>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <NavLink to={`/typing/${lang}`} key={lang}>
            <div className='language'>
              <h2>{lang}</h2>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Languages;
