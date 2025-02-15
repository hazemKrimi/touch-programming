import { useTypingContext } from "contexts/typing";

import './index.css';

type StatsProps = {
  loaded: boolean;
}

function Score({loaded}: StatsProps) {
  const {
    timer,
    score,
    accuracy,
  } = useTypingContext();

  if (!loaded) return;

  return (
    <div className='score'>
      <p>Time: {timer}</p>
      <p>WPM: {Math.round(score)}</p>
      <p>Accuracy: {Math.round(accuracy)}%</p>
    </div>
  )
}

export default Score;
