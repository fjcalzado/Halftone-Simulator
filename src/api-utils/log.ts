export function logDebug(message: string) {
  if (process.env.DEBUG_TRACES) {
    console.log(`[DEBUG] ${message}`);
  }
}