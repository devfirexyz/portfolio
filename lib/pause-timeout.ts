export type TimeoutRef = {
  current: ReturnType<typeof setTimeout> | null;
};

export function clearPauseTimeout(ref: TimeoutRef): void {
  if (ref.current) {
    clearTimeout(ref.current);
    ref.current = null;
  }
}

export function schedulePauseTimeout(
  ref: TimeoutRef,
  callback: () => void,
  delayMs: number
): void {
  clearPauseTimeout(ref);
  ref.current = setTimeout(() => {
    ref.current = null;
    callback();
  }, delayMs);
}
