import { useParams } from "react-router";

import { useTypingContext } from "contexts/typing";

import { renderTimer } from "./utils";

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

  async function share() {
    if (navigator.share) {
      await navigator.share({
        title: 'Touch Programming',
        text: `I just Practiced The ${lang} Language on Touch Programming! I did ${score} WPM with ${accuracy}% accuracy. Try it out!`,
        url: window.location.href,
      });
    }
  }

  if (!loaded) return;

  return (
    <div className='stats-container'>
      {renderTimer(timer)}
      <p>WPM: {Math.round(score)}</p>
      <p>Accuracy: {Math.round(accuracy)}%</p>
      {Boolean(navigator.share) && !startedTyping && score > 0 && (
        <button className='share' onClick={share}>
          Share
        </button>
      )}
    </div>
  )
}

export default Stats;
