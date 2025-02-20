import { useTypingContext } from "contexts/typing";

import './index.css';
import { renderTimer } from "./utils";

type StatsProps = {
  loaded: boolean;
}

function Stats({ loaded }: StatsProps) {
  const {
    timer,
    score,
    accuracy,
  } = useTypingContext();

  if (!loaded) return;

  return (
    <div className='stats-container'>
      {renderTimer(timer)}
      <p>WPM: {Math.round(score)}</p>
      <p>Accuracy: {Math.round(accuracy)}%</p>
    </div>
  )
}

export default Stats;
