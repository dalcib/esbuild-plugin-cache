import * as DenoCache from "deno-cache";
import {readFile} from "fs/promises";
import {resolve} from "deno-importmap";
import {join} from "path";
export function denoCachePlugin({importmap = {imports: {}}, directory}) {
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
        return {path: join(args.resolveDir, resolvedPath)};
      });
      build.onLoad({filter: /.*/, namespace: "deno-cache"}, async (args) => {
        const file = await DenoCache.cache(args.path, void 0, "deps");
        const contents = await readFile(file.path, "utf8");
        return {contents};
      });
    }
  };
}
