import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);

// Compile application modules only within the isolated Node test process.
// transpileModule skips type checking; npm run build performs that check.
const compile = (module, filename) => {
  const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

require.extensions[".ts"] = compile;
require.extensions[".tsx"] = compile;
// These tests cover markup and interactions; Next.js handles CSS in the build.
require.extensions[".css"] = () => {};
