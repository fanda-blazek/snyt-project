import { expect, test } from "vite-plus/test";
import {
  queryOptionalScopedPart,
  queryRequiredScopedPart,
  queryScopedParts,
  setAuthorButtonType,
} from "../src/internal/parts.ts";

const rootSelector = "snyt-test-root";
const partSelector = "[data-snyt-test-part]";

class TestPart {
  constructor(private readonly owner: TestRoot | null) {}

  closest(selector: string) {
    return selector === rootSelector ? this.owner : null;
  }
}

class TestRoot extends TestPart {
  parts: TestPart[] = [];

  constructor() {
    super(null);
  }

  override closest(selector: string) {
    return selector === rootSelector ? this : null;
  }

  querySelectorAll(selector: string) {
    return selector === partSelector ? this.parts : [];
  }
}

class TestButton {
  type = "submit";

  constructor(private readonly hasTypeAttribute: boolean) {}

  hasAttribute(name: string) {
    return name === "type" && this.hasTypeAttribute;
  }
}

test("scoped part helpers ignore parts owned by nested roots", () => {
  const root = new TestRoot();
  const nestedRoot = new TestRoot();
  const ownedPart = new TestPart(root);
  const nestedPart = new TestPart(nestedRoot);

  root.parts = [ownedPart, nestedPart];

  expect(queryScopedParts(root as unknown as Element, partSelector, rootSelector)).toEqual([
    ownedPart,
  ]);
  expect(queryOptionalScopedPart(root as unknown as Element, partSelector, rootSelector)).toBe(
    ownedPart,
  );
  expect(
    queryRequiredScopedPart(root as unknown as Element, partSelector, rootSelector, "Missing"),
  ).toBe(ownedPart);
});

test("required scoped part helper throws when no owned part is found", () => {
  const root = new TestRoot();

  expect(() =>
    queryRequiredScopedPart(root as unknown as Element, partSelector, rootSelector, "Missing part"),
  ).toThrow("Missing part");
});

test("author button helper only sets type when the author omitted it", () => {
  const implicitButton = new TestButton(false);
  const explicitButton = new TestButton(true);
  explicitButton.type = "submit";

  setAuthorButtonType(implicitButton as unknown as HTMLButtonElement);
  setAuthorButtonType(explicitButton as unknown as HTMLButtonElement);

  expect(implicitButton.type).toBe("button");
  expect(explicitButton.type).toBe("submit");
});
