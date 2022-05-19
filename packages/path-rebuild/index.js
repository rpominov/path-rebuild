var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// source.js
var source_exports = {};
__export(source_exports, {
  createTransform: () => createTransform
});

// ../rescript-path-rebuild/lib/es6/PathRebuild.bs.js
var Path = __toESM(require("path"));

// ../../node_modules/rescript/lib/es6/js_exn.js
function raiseError(str) {
  throw new Error(str);
}

// ../rescript-path-rebuild/lib/es6/PathRebuild.bs.js
function $$int(str) {
  var result = Number(str);
  var result$p = result | 0;
  if (result === result$p) {
    return result$p;
  }
}
function commit(result, status) {
  switch (status.TAG | 0) {
    case 0:
      var s = status._0;
      if (s === "") {
        return {
          TAG: 0,
          _0: result
        };
      } else {
        return {
          TAG: 0,
          _0: result.concat({
            TAG: 1,
            _0: s
          })
        };
      }
    case 1:
      return raiseError("Cannot commit a Skip");
    case 2:
      var n = status._0;
      switch (n) {
        case "base":
          return {
            TAG: 0,
            _0: result.concat({
              TAG: 2,
              _0: "base"
            })
          };
        case "dir":
          return {
            TAG: 0,
            _0: result.concat({
              TAG: 2,
              _0: "dir"
            })
          };
        case "ext":
          return {
            TAG: 0,
            _0: result.concat({
              TAG: 2,
              _0: "ext"
            })
          };
        case "name":
          return {
            TAG: 0,
            _0: result.concat({
              TAG: 2,
              _0: "name"
            })
          };
        case "root":
          return {
            TAG: 0,
            _0: result.concat({
              TAG: 2,
              _0: "root"
            })
          };
        default:
          var n$p = $$int(n);
          if (n$p !== void 0) {
            return {
              TAG: 0,
              _0: result.concat({
                TAG: 0,
                _0: n$p,
                _1: n$p
              })
            };
          } else {
            return {
              TAG: 1,
              _0: "Bad range limit: " + n
            };
          }
      }
    case 3:
      return raiseError("Cannot commit a Dot");
    case 4:
      var m = status._1;
      var n$1 = status._0;
      var n$p$1 = $$int(n$1);
      if (n$p$1 === void 0) {
        return {
          TAG: 1,
          _0: "Bad range limit: " + n$1
        };
      }
      var m$p = $$int(m);
      if (m$p !== void 0) {
        if (n$p$1 >= 0 ? m$p >= 0 && m$p < n$p$1 : m$p >= 0 || n$p$1 > m$p) {
          return {
            TAG: 1,
            _0: "Bad range limits: " + n$1 + ".." + m
          };
        } else {
          return {
            TAG: 0,
            _0: result.concat({
              TAG: 0,
              _0: n$p$1,
              _1: m$p
            })
          };
        }
      } else {
        return {
          TAG: 1,
          _0: "Bad range limit: " + m
        };
      }
  }
}
function printError(str, i, msg) {
  return {
    TAG: 1,
    _0: msg + "\n" + str + "\n" + " ".repeat(i) + "^"
  };
}
function parse2(str) {
  var _i = 0;
  var _status = {
    TAG: 0,
    _0: ""
  };
  var _mResult = {
    TAG: 0,
    _0: []
  };
  while (true) {
    var mResult = _mResult;
    var status = _status;
    var i = _i;
    if (mResult.TAG !== 0) {
      return printError(str, i - 1 | 0, mResult._0);
    }
    var result = mResult._0;
    var ch = str.charAt(i);
    var i$p = i + 1 | 0;
    var exit = 0;
    var exit$1 = 0;
    var exit$2 = 0;
    var exit$3 = 0;
    var exit$4 = 0;
    switch (ch) {
      case "":
        switch (status.TAG | 0) {
          case 0:
            return commit(result, status);
          case 1:
            return printError(str, i, "Unexpected end of string. Expected a character after the escape symbol %");
          default:
            return printError(str, i, "Unexpected end of string. Did you forget to close a range?");
        }
      case "%":
        switch (status.TAG | 0) {
          case 0:
            _status = {
              TAG: 1,
              _0: status._0
            };
            _i = i$p;
            continue;
          case 1:
            exit$4 = 6;
            break;
          default:
            exit$3 = 5;
        }
        break;
      case ".":
        switch (status.TAG | 0) {
          case 0:
            exit = 1;
            break;
          case 1:
            exit$4 = 6;
            break;
          case 2:
            var n = status._0;
            if (n === "") {
              return printError(str, i, "Unexpected . symbol");
            }
            _status = {
              TAG: 3,
              _0: n
            };
            _i = i$p;
            continue;
          case 3:
            _status = {
              TAG: 4,
              _0: status._0,
              _1: ""
            };
            _i = i$p;
            continue;
          case 4:
            return printError(str, i, "Unexpected . symbol");
        }
        break;
      case "/":
        switch (status.TAG | 0) {
          case 0:
            var r = commit(result, status);
            var tmp;
            tmp = r.TAG === 0 ? {
              TAG: 0,
              _0: r._0.concat(0)
            } : r;
            _mResult = tmp;
            _status = {
              TAG: 0,
              _0: ""
            };
            _i = i$p;
            continue;
          case 1:
            exit$4 = 6;
            break;
          case 3:
            exit$2 = 4;
            break;
          case 2:
          case 4:
            exit$1 = 3;
            break;
        }
        break;
      case "{":
        switch (status.TAG | 0) {
          case 0:
            _mResult = commit(result, status);
            _status = {
              TAG: 2,
              _0: ""
            };
            _i = i$p;
            continue;
          case 1:
            exit$4 = 6;
            break;
          default:
            exit$3 = 5;
        }
        break;
      case "}":
        switch (status.TAG | 0) {
          case 1:
            exit$4 = 6;
            break;
          case 0:
          case 3:
            exit$3 = 5;
            break;
          case 2:
          case 4:
            exit = 2;
            break;
        }
        break;
      default:
        exit$4 = 6;
    }
    if (exit$4 === 6) {
      if (status.TAG === 1) {
        _status = {
          TAG: 0,
          _0: status._0 + ch
        };
        _i = i$p;
        continue;
      }
      exit$3 = 5;
    }
    if (exit$3 === 5) {
      switch (ch) {
        case "%":
          return printError(str, i, "Unexpected escape symbol % inside a range");
        case "{":
          return printError(str, i, "Unexpected { symbol inside a range");
        case "}":
          return printError(str, i, "Unexpected } symbol");
        default:
          exit$2 = 4;
      }
    }
    if (exit$2 === 4) {
      if (status.TAG === 3) {
        return printError(str, i, "Unexpected character: " + ch + ". Was expecting a . symbol");
      }
      exit$1 = 3;
    }
    if (exit$1 === 3) {
      if (ch === "/") {
        return printError(str, i, "Unexpected / symbol inside a range");
      }
      exit = 1;
    }
    switch (exit) {
      case 1:
        switch (status.TAG | 0) {
          case 0:
            _status = {
              TAG: 0,
              _0: status._0 + ch
            };
            _i = i$p;
            continue;
          case 2:
            _status = {
              TAG: 2,
              _0: status._0 + ch
            };
            _i = i$p;
            continue;
          case 4:
            _status = {
              TAG: 4,
              _0: status._0,
              _1: status._1 + ch
            };
            _i = i$p;
            continue;
        }
      case 2:
        _mResult = commit(result, status);
        _status = {
          TAG: 0,
          _0: ""
        };
        _i = i$p;
        continue;
    }
  }
  ;
}
function printRange(parts, min, max, sep2) {
  if (min === max) {
    return parts[min];
  } else if (max === (parts.length - 1 | 0)) {
    return printRange(parts, min, max - 1 | 0, sep2) + parts[max];
  } else {
    return parts.slice(min, max + 1 | 0).join(sep2);
  }
}
function print(sepOpt, nodes, path) {
  var sep2 = sepOpt !== void 0 ? sepOpt : Path.sep;
  var parsed = Path.parse(path);
  var withoutRoot = path.slice(parsed.root.length);
  var withoutExt = withoutRoot.slice(0, withoutRoot.length - parsed.ext.length | 0);
  var parts = withoutExt.split(sep2).concat(parsed.ext);
  var _result = "";
  var _i = 0;
  var _skipSeparator = false;
  while (true) {
    var skipSeparator = _skipSeparator;
    var i = _i;
    var result = _result;
    if (i === nodes.length) {
      return result;
    }
    var s = nodes[i];
    if (typeof s === "number") {
      _skipSeparator = false;
      _i = i + 1 | 0;
      _result = result + (skipSeparator ? "" : sep2);
      continue;
    }
    switch (s.TAG | 0) {
      case 0:
        var max = s._1;
        var min = s._0;
        var len = parts.length;
        var min$1 = Math.max(0, min < 0 ? len + min | 0 : min);
        var max$1 = Math.min(len - 1 | 0, max < 0 ? len + max | 0 : max);
        if (max$1 < min$1) {
          _skipSeparator = true;
          _i = i + 1 | 0;
          continue;
        }
        _skipSeparator = false;
        _i = i + 1 | 0;
        _result = result + printRange(parts, min$1, max$1, sep2);
        continue;
      case 1:
        _skipSeparator = false;
        _i = i + 1 | 0;
        _result = result + s._0;
        continue;
      case 2:
        var match = s._0;
        if (match === "name") {
          _skipSeparator = false;
          _i = i + 1 | 0;
          _result = result + parsed.name;
          continue;
        }
        if (match === "root") {
          _skipSeparator = false;
          _i = i + 1 | 0;
          _result = result + parsed.root;
          continue;
        }
        if (match === "dir") {
          _skipSeparator = parsed.dir === parsed.root;
          _i = i + 1 | 0;
          _result = result + parsed.dir;
          continue;
        }
        if (match === "ext") {
          _skipSeparator = false;
          _i = i + 1 | 0;
          _result = result + parsed.ext;
          continue;
        }
        _skipSeparator = false;
        _i = i + 1 | 0;
        _result = result + parsed.base;
        continue;
    }
  }
  ;
}
function __jsEndpoint(pattern) {
  var nodes = parse2(pattern);
  if (nodes.TAG !== 0) {
    return raiseError(nodes._0);
  }
  var nodes$1 = nodes._0;
  return function(path, sep2) {
    return print(sep2, nodes$1, path);
  };
}

// source.js
var createTransform = __jsEndpoint;
module.exports = __toCommonJS(source_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createTransform
});
