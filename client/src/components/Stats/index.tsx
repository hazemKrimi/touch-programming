import { useTypingContext } from "contexts/typing";

import './index.css';

function Score() {
  const {
    timer,
    score,
    accuracy,
  } = useTypingContext();

  return (
    <div className='score'>
      <p>Time: {timer}</p>
      <p>WPM: {Math.round(score)}</p>
      <p>Accuracy: {Math.round(accuracy)}%</p>
    </div>
  )
}

export default Score;
