import { describe, expect, it } from "vitest";

import {
  boundaries,
  comments,
  eslint,
  importX,
  jasmine,
  jest,
  jsdoc,
  perfectionist,
  playwright,
  prettier,
  resolver,
  rxjsX,
  stylistic,
  typescript,
  unicorn,
  vitest,
} from ".";
import * as architecture from "../architecture";
import * as core from "../core";
import * as documentation from "../docs";
import * as domain from "../domain";
import * as style from "../style";
import * as testing from "../testing";

describe("configs barrel", () => {
  it("re-exports architecture config builders", () => {
    expect(boundaries).toBe(architecture.boundaries);
    expect(importX).toBe(architecture.importX);
  });

  it("re-exports core config builders", () => {
    expect(eslint).toBe(core.eslint);
    expect(resolver).toBe(core.resolver);
    expect(typescript).toBe(core.typescript);
  });

  it("re-exports documentation and domain config builders", () => {
    expect(comments).toBe(documentation.comments);
    expect(jsdoc).toBe(documentation.jsdoc);
    expect(rxjsX).toBe(domain.rxjsX);
  });

  it("re-exports style config builders", () => {
    expect(perfectionist).toBe(style.perfectionist);
    expect(prettier).toBe(style.prettier);
    expect(stylistic).toBe(style.stylistic);
    expect(unicorn).toBe(style.unicorn);
  });

  it("re-exports testing config builders", () => {
    expect(jasmine).toBe(testing.jasmine);
    expect(jest).toBe(testing.jest);
    expect(playwright).toBe(testing.playwright);
    expect(vitest).toBe(testing.vitest);
  });
});
