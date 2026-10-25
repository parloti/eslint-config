/** Domain model representing a registered user. */
interface User {
  /** Unique user identifier. */
  id: string;

  /** Display name of the user. */
  name: string;
}

/**
 * Creates a readable label for a user.
 * @param user The user to label.
 * @returns The user identifier and display name.
 * @example
 * ```typescript
 * getUserLabel({ id: "user-1", name: "Ada" });
 * ```
 */
function getUserLabel(user: User): string {
  return `${user.id}: ${user.name}`;
}

const userLabel = getUserLabel({ id: "user-1", name: "Ada" });

if (userLabel.length === 0) {
  throw new Error("User label cannot be empty.");
}

export type { User };
