import { useParams } from "react-router";

import { useTypingContext } from "contexts/typing";

import { renderTimer, shareOnTwitter } from "./utils";

import TwitterIcon from 'assets/icons/x.svg?react';

import './index.css';

type StatsProps = {
  loaded: boolean;
}

function Stats({ loaded }: StatsProps) {
  const {
    startedTyping,
    timer,
    score,
    accuracy,
  } = useTypingContext();
  const { lang } = useParams();

  if (!loaded || !lang) return;

  return (
    <div className='stats-container'>
      {renderTimer(timer)}
      <p>WPM: {Math.round(score)}</p>
      <p>Accuracy: {Math.round(accuracy)}%</p>
      {!startedTyping && score > 0 && (
        <button onClick={() => shareOnTwitter(lang, score, accuracy)}>
          <TwitterIcon />
        </button>
      )}
    </div>
  )
}

export default Stats;
