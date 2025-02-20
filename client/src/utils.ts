export function isMobileBrowser(): boolean {
  const width = window.innerWidth;

  return width <= 768 || (width > 768 && width <= 1024);
}
