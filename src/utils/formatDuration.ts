const LEADING_ZERO_FORMATTER = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
});

export function formatDuation(duration: number) {
  // 밀리세컨드를 초로 변환
  const totalSeconds = Math.floor(duration / 1000);
  const hours = Math.floor(totalSeconds / 60 / 60);
  const minutes = Math.floor((totalSeconds - hours * 60 * 60) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${LEADING_ZERO_FORMATTER.format(
      minutes
    )}:${LEADING_ZERO_FORMATTER.format(seconds)}`;
  }

  return `${minutes}:${LEADING_ZERO_FORMATTER.format(seconds)}`;
}
