import { config } from "./src";

export default await config({
  disabledPlugins: ["boundaries", "jasmine", "jest", "playwright", "rxjs-x"],
  rules: {
    "import-x/no-nodejs-modules": "off",
    "sort-keys": "off",
  },
});
