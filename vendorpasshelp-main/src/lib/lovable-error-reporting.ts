/**
 * Simple error reporting — logs to console.
 * Replace with your own error tracking (e.g. Sentry) if needed.
 */
export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  console.error("[Error]", error, context);
}
