let start = window.performance.now();

export function reset(): number {
  start = window.performance.now();
  return start;
}

export function elapsed(): number {
  return window.performance.now() - start;
}

export function logElapsed(message: string = ""): void {
  if (process.env.DEBUG_TRACES) {
    console.log(`${message}: ${elapsed().toLocaleString()} ms.`);
  }
}

