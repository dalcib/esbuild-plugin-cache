import * as DenoCache from "deno-cache";
import {readFile} from "fs/promises";
import {resolve} from "deno-importmap";
import {join} from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
export function cache({importmap = {imports: {}}, directory} = {}) {
  DenoCache.configure({directory});
  return {
    name: "deno-cache",
    setup(build) {
      build.onResolve({filter: /.*/}, async (args) => {
        const resolvedPath = resolve(args.path, importmap);
        if (resolvedPath.startsWith("http")) {
          return {
            path: resolvedPath,
            namespace: "deno-cache"
          };
        }
        if (args.namespace === "deno-cache") {
          return {
            path: new URL(resolvedPath, args.importer).toString(),
            namespace: "deno-cache"
          };
        }
        return resolvedPath.match(/^[.\/]/)
          // modules in our codebase
          ? {path: join(args.resolveDir, resolvedPath)}
          // node module dependencies (built-in or node_modules installed)
          : {path: require.resolve(args.path)};
      });
      build.onLoad({filter: /.*/, namespace: "deno-cache"}, async (args) => {
        const file = await DenoCache.cache(args.path, void 0, "deps");
        const contents = await readFile(file.path, "utf8");
        const ext = file.meta.url.split(".").pop();
        const loader = ext.match(/"j|tsx?$/) ? ext : "js";
        return {contents, loader};
      });
    }
  };
}
