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
function parse(str) {
  var _i = 0;
  var _mStatus = {
    TAG: 0,
    _0: ""
  };
  var _mResult = {
    TAG: 0,
    _0: []
  };
  while (true) {
    var mResult = _mResult;
    var mStatus = _mStatus;
    var i = _i;
    if (mResult.TAG !== 0) {
      return printError(str, i - 1 | 0, mResult._0);
    }
    var result = mResult._0;
    if (mStatus === void 0) {
      return {
        TAG: 0,
        _0: result
      };
    }
    var ch = str.charAt(i);
    var i$p = i + 1 | 0;
    var exit = 0;
    var exit$1 = 0;
    var exit$2 = 0;
    var exit$3 = 0;
    var exit$4 = 0;
    switch (ch) {
      case "":
        switch (mStatus.TAG | 0) {
          case 0:
            _mResult = commit(result, mStatus);
            _mStatus = void 0;
            _i = i$p;
            continue;
          case 1:
            return printError(str, i, "Unexpected end of string. Expected a character after the escape symbol %");
          default:
            return printError(str, i, "Unexpected end of string. Did you forget to close a range?");
        }
      case "%":
        switch (mStatus.TAG | 0) {
          case 0:
            _mStatus = {
              TAG: 1,
              _0: mStatus._0
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
        switch (mStatus.TAG | 0) {
          case 0:
            exit = 1;
            break;
          case 1:
            exit$4 = 6;
            break;
          case 2:
            var n = mStatus._0;
            if (n === "") {
              return printError(str, i, "Unexpected . symbol");
            }
            _mStatus = {
              TAG: 3,
              _0: n
            };
            _i = i$p;
            continue;
          case 3:
            _mStatus = {
              TAG: 4,
              _0: mStatus._0,
              _1: ""
            };
            _i = i$p;
            continue;
          case 4:
            return printError(str, i, "Unexpected . symbol");
        }
        break;
      case "/":
        switch (mStatus.TAG | 0) {
          case 0:
            var r = commit(result, mStatus);
            var tmp;
            tmp = r.TAG === 0 ? {
              TAG: 0,
              _0: r._0.concat(0)
            } : {
              TAG: 1,
              _0: r._0
            };
            _mResult = tmp;
            _mStatus = {
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
        switch (mStatus.TAG | 0) {
          case 0:
            _mResult = commit(result, mStatus);
            _mStatus = {
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
        switch (mStatus.TAG | 0) {
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
      if (mStatus.TAG === 1) {
        _mStatus = {
          TAG: 0,
          _0: mStatus._0 + ch
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
      if (mStatus.TAG === 3) {
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
        switch (mStatus.TAG | 0) {
          case 0:
            _mStatus = {
              TAG: 0,
              _0: mStatus._0 + ch
            };
            _i = i$p;
            continue;
          case 2:
            _mStatus = {
              TAG: 2,
              _0: mStatus._0 + ch
            };
            _i = i$p;
            continue;
          case 4:
            _mStatus = {
              TAG: 4,
              _0: mStatus._0,
              _1: mStatus._1 + ch
            };
            _i = i$p;
            continue;
        }
      case 2:
        _mResult = commit(result, mStatus);
        _mStatus = {
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
  if (Path.isAbsolute(path)) {
    return {
      TAG: 1,
      _0: "An absolute path cannot be used as a source path:\n" + path
    };
  }
  var ext = Path.extname(path);
  var withoutExt = path.substring(0, path.length - ext.length | 0);
  var parts = withoutExt.split(sep2).concat(ext);
  var len = parts.length;
  var helper = function(_result, _i, _skipSeparator) {
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
      if (s.TAG === 0) {
        var max = s._1;
        var min = s._0;
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
      }
      _skipSeparator = false;
      _i = i + 1 | 0;
      _result = result + s._0;
      continue;
    }
    ;
  };
  return {
    TAG: 0,
    _0: helper("", 0, false)
  };
}
function transformExn(pattern) {
  var nodes = parse(pattern);
  if (nodes.TAG !== 0) {
    return raiseError(nodes._0);
  }
  var nodes$1 = nodes._0;
  return function(sep2, path) {
    var result = print(sep2, nodes$1, path);
    if (result.TAG === 0) {
      return result._0;
    } else {
      return raiseError(result._0);
    }
  };
}

// source.js
var createTransform = (pattern) => {
  const fn = transformExn(pattern);
  return (path, sep2) => fn(sep2, path);
};
module.exports = __toCommonJS(source_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createTransform
});
