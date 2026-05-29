import { readFileSync } from "node:fs";
import { expect, test } from "vite-plus/test";

interface PackageJson {
  exports: Record<string, unknown>;
}

const packageJson = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as PackageJson;

test("runtime entrypoints import without a browser custom element registry", async () => {
  await expect(import("../src/index.ts")).resolves.toBeDefined();
  await expect(import("../src/define.ts")).resolves.toBeDefined();
  await expect(import("../src/toggle/index.ts")).resolves.toBeDefined();
  await expect(import("../src/toggle/define.ts")).resolves.toBeDefined();
  await expect(import("../src/dialog/index.ts")).resolves.toBeDefined();
  await expect(import("../src/dialog/define.ts")).resolves.toBeDefined();
  await expect(import("../src/types.ts")).resolves.toBeDefined();
});

test("package exports expose granular entrypoints with declarations", () => {
  expect(packageJson.exports).toMatchObject({
    ".": {
      default: "./dist/index.mjs",
      types: "./dist/index.d.mts",
    },
    "./define": {
      default: "./dist/define.mjs",
      types: "./dist/define.d.mts",
    },
    "./dialog": {
      default: "./dist/dialog/index.mjs",
      types: "./dist/dialog/index.d.mts",
    },
    "./dialog/define": {
      default: "./dist/dialog/define.mjs",
      types: "./dist/dialog/define.d.mts",
    },
    "./toggle": {
      default: "./dist/toggle/index.mjs",
      types: "./dist/toggle/index.d.mts",
    },
    "./toggle/define": {
      default: "./dist/toggle/define.mjs",
      types: "./dist/toggle/define.d.mts",
    },
    "./types": {
      default: "./dist/types.mjs",
      types: "./dist/types.d.mts",
    },
  });
});
