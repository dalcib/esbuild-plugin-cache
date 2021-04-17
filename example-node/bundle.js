 (() => new EventSource("/esbuild").onmessage = () => location.reload())();
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? {get: () => module.default, enumerable: true} : {value: module, enumerable: true})), module);
  };

  // index.tsx
  var import_react = __toModule(require("react"));
  var import_react_dom = __toModule(require("react-dom"));
  var App = () => {
    return /* @__PURE__ */ import_react.default.createElement("div", {
      className: "App"
    }, /* @__PURE__ */ import_react.default.createElement("header", {
      className: "App-header"
    }, /* @__PURE__ */ import_react.default.createElement("h1", null, "Esbuild cache plugin."), /* @__PURE__ */ import_react.default.createElement("p", null, "Edit ", /* @__PURE__ */ import_react.default.createElement("code", null, "index.tsx"), " and save to reload."), /* @__PURE__ */ import_react.default.createElement("a", {
      className: "App-link",
      href: "https://reactjs.org",
      target: "_blank",
      rel: "noopener noreferrer"
    }, "Learn React")));
  };
  import_react_dom.default.render(/* @__PURE__ */ import_react.default.createElement(App, null), document.getElementById("root"));
})();
