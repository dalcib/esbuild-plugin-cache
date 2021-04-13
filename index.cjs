var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};
__markAsModule(exports);
__export(exports, {
  cache: () => cache
});
var DenoCache = __toModule(require("deno-cache"));
var import_promises = __toModule(require("fs/promises"));
var import_deno_importmap = __toModule(require("deno-importmap"));
var import_path = __toModule(require("path"));
function cache({importmap = {imports: {}}, directory}) {
  DenoCache.configure({directory});
  return {
    name: "deno-cache",
    setup(build) {
      build.onResolve({filter: /.*/}, async (args) => {
        const resolvedPath = (0, import_deno_importmap.resolve)(args.path, importmap);
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
        return {path: (0, import_path.join)(args.resolveDir, resolvedPath)};
      });
      build.onLoad({filter: /.*/, namespace: "deno-cache"}, async (args) => {
        const file = await DenoCache.cache(args.path, void 0, "deps");
        const contents = await (0, import_promises.readFile)(file.path, "utf8");
        return {contents};
      });
    }
  };
}
