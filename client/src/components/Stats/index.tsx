import { useState } from "react";

function Score() {
  const [timer] = useState<number>(0);
  const [score] = useState<number>(0);
  const [accuracy] = useState<number>(0);

  return (
    <div className='score'>
      <p>Time: {timer}</p>
      <p>WPM: {Math.round(score)}</p>
      <p>Accuracy: {Math.round(accuracy)}%</p>
    </div>
  )
}

export default Score;
