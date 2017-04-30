import { logDebug } from "./log";

export interface Timer {
  start: number;
  reset: () => number;
  elapsed: () => number;
  logElapsed: (message: string) => number;
}

export function CreateTimer(): Timer {
  const timer: Timer = {
    start: window.performance.now(),
    reset: () => {
      timer.start = window.performance.now();
      return timer.start;
    },
    elapsed: () => {
      return window.performance.now() - timer.start;
    },
    logElapsed: (message: string): number => {
      const elapsed = timer.elapsed();
      logDebug(`${message}: ${elapsed.toLocaleString()} ms.`);
      return elapsed;
    },
  };
  return timer;
}


