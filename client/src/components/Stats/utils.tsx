export function renderTimer(timer: number) {
  const leftValue = Math.round(timer / 60);
  const rightValue = timer < 60 ? timer : timer % 60;

  return (
    <p>Time: {leftValue < 10 && 0}{leftValue}:{rightValue < 10 && 0}{rightValue}</p>
  );
}

export function shareOnTwitter(lang: string, score: number, accuracy: number) {
  const tweetText = `I just practiced the ${lang} language on Touch Programming! I did ${Math.round(score)} WPM with ${Math.round(accuracy)}% accuracy. Try it out!`;
  const url = window.location.href;
  const encodedTweetText = encodeURIComponent(tweetText);
  const encodedUrl = encodeURIComponent(url);

  window.open(`https://x.com/intent/tweet?text=${encodedTweetText}&url=${encodedUrl}`);
}

