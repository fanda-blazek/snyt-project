import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: [
      "src/index.ts",
      "src/define.ts",
      "src/toggle/index.ts",
      "src/toggle/define.ts",
      "src/dialog/index.ts",
      "src/dialog/define.ts",
      "src/types.ts",
    ],
    dts: {
      tsgo: true,
    },
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
});
