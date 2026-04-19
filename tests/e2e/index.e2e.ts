import { expect, test } from "vitest";

test("E2E placeholder", (): void => {
  // Arrange
  const sut = { compute: (): string => "active" };

  // Act
  const result = sut.compute();

  // Assert
  expect(result).toBe("active");
});
