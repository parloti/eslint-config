import type { User } from "../domain";
import type { Logger } from "../shared";

/** Service that resolves the current user. */
interface UserService {
  /** Resolves the user with the given identifier. */
  getUser: (id: string, logger: Logger) => undefined | User;
}

export type { UserService };
