/** Domain model representing a registered user. */
interface User {
  /** Unique user identifier. */
  id: string;

  /** Display name of the user. */
  name: string;
}

export type { User };
