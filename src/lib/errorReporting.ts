/**
 * Lightweight error reporting utility.
 *
 * In production, you can replace the `reportError` implementation
 * with a real service like Sentry, LogRocket, or Datadog RUM.
 *
 * Usage:
 *   import { reportError } from "@/lib/errorReporting";
 *   reportError(error, { context: "portfolio-fetch" });
 */

interface ErrorContext {
  /** Where the error occurred */
  context?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Report an error to the configured error tracking service.
 * Falls back to console.error in development.
 */
export function reportError(error: unknown, ctx?: ErrorContext): void {
  const errorObj = error instanceof Error ? error : new Error(String(error));

  if (process.env.NODE_ENV === "development") {
    console.error(`[Error Reporter] ${ctx?.context || "unknown"}:`, errorObj);
    if (ctx?.metadata) {
      console.error("[Error Reporter] metadata:", ctx.metadata);
    }
    return;
  }

  // Production: send to your error tracking service
  // Replace with Sentry, LogRocket, etc. when ready:
  //
  // Sentry.captureException(errorObj, {
  //   tags: { context: ctx?.context },
  //   extra: ctx?.metadata,
  // });

  // Fallback: log to console (still captured by Vercel logs)
  console.error(
    JSON.stringify({
      name: errorObj.name,
      message: errorObj.message,
      stack: errorObj.stack,
      context: ctx?.context,
      metadata: ctx?.metadata,
      timestamp: new Date().toISOString(),
    })
  );

  // Optional: send to a custom endpoint
  if (process.env.NEXT_PUBLIC_ERROR_ENDPOINT) {
    fetch(process.env.NEXT_PUBLIC_ERROR_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: errorObj.name,
        message: errorObj.message,
        stack: errorObj.stack,
        context: ctx?.context,
        metadata: ctx?.metadata,
        url: typeof window !== "undefined" ? window.location.href : "",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {
      // Silently fail - don't create error loops
    });
  }
}

/**
 * Wrap an async function with error reporting.
 */
export function withErrorReporting<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context: string
): T {
  return (async (...args: unknown[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      reportError(error, { context });
      throw error;
    }
  }) as T;
}
