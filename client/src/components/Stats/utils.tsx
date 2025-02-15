export function renderTimer(timer: number) {
  const leftValue = Math.round(timer / 60);
  const rightValue = timer < 60 ? timer : timer % 60;

  return (
    <p>Time: {leftValue < 10 && 0}{leftValue}:{rightValue < 10 && 0}{rightValue}</p>
  );
}
