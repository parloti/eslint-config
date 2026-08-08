/** Minimal structured logger shared across architectural layers. */
interface Logger {
  /** Logs a message at info level. */
  info: (message: string) => void;
}

export type { Logger };
