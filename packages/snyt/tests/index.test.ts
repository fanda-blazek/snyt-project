import { expect, test } from "vite-plus/test";
import { snytElementPrefix } from "../src/index.ts";

test("exports the custom element prefix", () => {
  expect(snytElementPrefix).toBe("snyt");
});
