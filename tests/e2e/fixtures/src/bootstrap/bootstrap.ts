import type { UserService } from "../application";
import type { Logger } from "../shared";

/** Composition root that wires the fixture services together. */
interface Bootstrap {
  /** Shared logger available to every service. */
  logger: Logger;

  /** Service that resolves the current user. */
  userService: UserService;
}

export type { Bootstrap };
