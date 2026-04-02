import { config } from "./src";

export default await config({
  plugins: { boundaries: false, playwright: false, "rxjs-x": false },
  rules: { "import-x/no-nodejs-modules": "off" },
});
