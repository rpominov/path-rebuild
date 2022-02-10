'use strict';Object.defineProperty(exports,'__esModule',{value:true});var require$$0=require('path');function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var require$$0__default=/*#__PURE__*/_interopDefaultLegacy(require$$0);var js_exn = {};var caml_js_exceptions = {};var caml_option = {};function isNested(x) {
  return x.BS_PRIVATE_NESTED_SOME_NONE !== undefined;
}

function some(x) {
  if (x === undefined) {
    return {
            BS_PRIVATE_NESTED_SOME_NONE: 0
          };
  } else if (x !== null && x.BS_PRIVATE_NESTED_SOME_NONE !== undefined) {
    return {
            BS_PRIVATE_NESTED_SOME_NONE: x.BS_PRIVATE_NESTED_SOME_NONE + 1 | 0
          };
  } else {
    return x;
  }
}

function nullable_to_opt(x) {
  if (x == null) {
    return ;
  } else {
    return some(x);
  }
}

function undefined_to_opt(x) {
  if (x === undefined) {
    return ;
  } else {
    return some(x);
  }
}

function null_to_opt(x) {
  if (x === null) {
    return ;
  } else {
    return some(x);
  }
}

function valFromOption(x) {
  if (!(x !== null && x.BS_PRIVATE_NESTED_SOME_NONE !== undefined)) {
    return x;
  }
  var depth = x.BS_PRIVATE_NESTED_SOME_NONE;
  if (depth === 0) {
    return ;
  } else {
    return {
            BS_PRIVATE_NESTED_SOME_NONE: depth - 1 | 0
          };
  }
}

function option_get(x) {
  if (x === undefined) {
    return ;
  } else {
    return valFromOption(x);
  }
}

function option_unwrap(x) {
  if (x !== undefined) {
    return x.VAL;
  } else {
    return x;
  }
}

caml_option.nullable_to_opt = nullable_to_opt;
caml_option.undefined_to_opt = undefined_to_opt;
caml_option.null_to_opt = null_to_opt;
caml_option.valFromOption = valFromOption;
caml_option.some = some;
caml_option.isNested = isNested;
caml_option.option_get = option_get;
caml_option.option_unwrap = option_unwrap;var caml_exceptions = {};var id = {
  contents: 0
};

function create(str) {
  id.contents = id.contents + 1 | 0;
  return str + ("/" + id.contents);
}

function caml_is_extension(e) {
  if (e == null) {
    return false;
  } else {
    return typeof e.RE_EXN_ID === "string";
  }
}

function caml_exn_slot_name(x) {
  return x.RE_EXN_ID;
}

caml_exceptions.id = id;
caml_exceptions.create = create;
caml_exceptions.caml_is_extension = caml_is_extension;
caml_exceptions.caml_exn_slot_name = caml_exn_slot_name;var Caml_option = caml_option;
var Caml_exceptions = caml_exceptions;

var $$Error = /* @__PURE__ */Caml_exceptions.create("Caml_js_exceptions.Error");

function internalToOCamlException(e) {
  if (Caml_exceptions.caml_is_extension(e)) {
    return e;
  } else {
    return {
            RE_EXN_ID: $$Error,
            _1: e
          };
  }
}

function caml_as_js_exn(exn) {
  if (exn.RE_EXN_ID === $$Error) {
    return Caml_option.some(exn._1);
  }
  
}

caml_js_exceptions.$$Error = $$Error;
caml_js_exceptions.internalToOCamlException = internalToOCamlException;
caml_js_exceptions.caml_as_js_exn = caml_as_js_exn;var Caml_js_exceptions = caml_js_exceptions;

var anyToExnInternal = Caml_js_exceptions.internalToOCamlException;

function raiseError(str) {
  throw new Error(str);
}

function raiseEvalError(str) {
  throw new EvalError(str);
}

function raiseRangeError(str) {
  throw new RangeError(str);
}

function raiseReferenceError(str) {
  throw new ReferenceError(str);
}

function raiseSyntaxError(str) {
  throw new SyntaxError(str);
}

function raiseTypeError(str) {
  throw new TypeError(str);
}

function raiseUriError(str) {
  throw new URIError(str);
}

var $$Error$1 = Caml_js_exceptions.$$Error;

js_exn.$$Error = $$Error$1;
js_exn.anyToExnInternal = anyToExnInternal;
js_exn.raiseError = raiseError;
js_exn.raiseEvalError = raiseEvalError;
js_exn.raiseRangeError = raiseRangeError;
js_exn.raiseReferenceError = raiseReferenceError;
js_exn.raiseSyntaxError = raiseSyntaxError;
js_exn.raiseTypeError = raiseTypeError;
js_exn.raiseUriError = raiseUriError;var Path = require$$0__default["default"];
var Js_exn = js_exn;

function $$int(str) {
  var result = Number(str);
  var result$p = result | 0;
  if (result === result$p) {
    return result$p;
  }
  
}

function commit(result, status) {
  switch (status.TAG | 0) {
    case /* L */0 :
        var s = status._0;
        if (s === "") {
          return {
                  TAG: /* Ok */0,
                  _0: result
                };
        } else {
          return {
                  TAG: /* Ok */0,
                  _0: result.concat({
                        TAG: /* Literal */1,
                        _0: s
                      })
                };
        }
    case /* S */1 :
        return Js_exn.raiseError("Cannot commit a Skip");
    case /* I */2 :
        var n = status._0;
        var n$p = $$int(n);
        if (n$p !== undefined) {
          return {
                  TAG: /* Ok */0,
                  _0: result.concat({
                        TAG: /* Range */0,
                        _0: n$p,
                        _1: n$p
                      })
                };
        } else {
          return {
                  TAG: /* Error */1,
                  _0: "Bad range limit: " + n
                };
        }
    case /* D */3 :
        return Js_exn.raiseError("Cannot commit a Dot");
    case /* R */4 :
        var m = status._1;
        var n$1 = status._0;
        var n$p$1 = $$int(n$1);
        if (n$p$1 === undefined) {
          return {
                  TAG: /* Error */1,
                  _0: "Bad range limit: " + n$1
                };
        }
        var m$p = $$int(m);
        if (m$p !== undefined) {
          if (n$p$1 >= 0 ? m$p >= 0 && m$p < n$p$1 : m$p >= 0 || n$p$1 > m$p) {
            return {
                    TAG: /* Error */1,
                    _0: "Bad range limits: " + n$1 + ".." + m
                  };
          } else {
            return {
                    TAG: /* Ok */0,
                    _0: result.concat({
                          TAG: /* Range */0,
                          _0: n$p$1,
                          _1: m$p
                        })
                  };
          }
        } else {
          return {
                  TAG: /* Error */1,
                  _0: "Bad range limit: " + m
                };
        }
    
  }
}

function printError(str, i, msg) {
  return {
          TAG: /* Error */1,
          _0: msg + "\n" + str + "\n" + " ".repeat(i) + "^"
        };
}

function parse(str) {
  var _i = 0;
  var _mStatus = {
    TAG: /* L */0,
    _0: ""
  };
  var _mResult = {
    TAG: /* Ok */0,
    _0: []
  };
  while(true) {
    var mResult = _mResult;
    var mStatus = _mStatus;
    var i = _i;
    if (mResult.TAG !== /* Ok */0) {
      return printError(str, i - 1 | 0, mResult._0);
    }
    var result = mResult._0;
    if (mStatus === undefined) {
      return {
              TAG: /* Ok */0,
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
      case "" :
          switch (mStatus.TAG | 0) {
            case /* L */0 :
                _mResult = commit(result, mStatus);
                _mStatus = undefined;
                _i = i$p;
                continue ;
            case /* S */1 :
                return printError(str, i, "Unexpected end of string. Expected a character after the escape symbol %");
            default:
              return printError(str, i, "Unexpected end of string. Did you forget to close a range?");
          }
      case "%" :
          switch (mStatus.TAG | 0) {
            case /* L */0 :
                _mStatus = {
                  TAG: /* S */1,
                  _0: mStatus._0
                };
                _i = i$p;
                continue ;
            case /* S */1 :
                exit$4 = 6;
                break;
            default:
              exit$3 = 5;
          }
          break;
      case "." :
          switch (mStatus.TAG | 0) {
            case /* L */0 :
                exit = 1;
                break;
            case /* S */1 :
                exit$4 = 6;
                break;
            case /* I */2 :
                var n = mStatus._0;
                if (n === "") {
                  return printError(str, i, "Unexpected . symbol");
                }
                _mStatus = {
                  TAG: /* D */3,
                  _0: n
                };
                _i = i$p;
                continue ;
            case /* D */3 :
                _mStatus = {
                  TAG: /* R */4,
                  _0: mStatus._0,
                  _1: ""
                };
                _i = i$p;
                continue ;
            case /* R */4 :
                return printError(str, i, "Unexpected . symbol");
            
          }
          break;
      case "/" :
          switch (mStatus.TAG | 0) {
            case /* L */0 :
                var r = commit(result, mStatus);
                var tmp;
                tmp = r.TAG === /* Ok */0 ? ({
                      TAG: /* Ok */0,
                      _0: r._0.concat(/* Sep */0)
                    }) : ({
                      TAG: /* Error */1,
                      _0: r._0
                    });
                _mResult = tmp;
                _mStatus = {
                  TAG: /* L */0,
                  _0: ""
                };
                _i = i$p;
                continue ;
            case /* S */1 :
                exit$4 = 6;
                break;
            case /* D */3 :
                exit$2 = 4;
                break;
            case /* I */2 :
            case /* R */4 :
                exit$1 = 3;
                break;
            
          }
          break;
      case "{" :
          switch (mStatus.TAG | 0) {
            case /* L */0 :
                _mResult = commit(result, mStatus);
                _mStatus = {
                  TAG: /* I */2,
                  _0: ""
                };
                _i = i$p;
                continue ;
            case /* S */1 :
                exit$4 = 6;
                break;
            default:
              exit$3 = 5;
          }
          break;
      case "}" :
          switch (mStatus.TAG | 0) {
            case /* S */1 :
                exit$4 = 6;
                break;
            case /* L */0 :
            case /* D */3 :
                exit$3 = 5;
                break;
            case /* I */2 :
            case /* R */4 :
                exit = 2;
                break;
            
          }
          break;
      default:
        exit$4 = 6;
    }
    if (exit$4 === 6) {
      if (mStatus.TAG === /* S */1) {
        _mStatus = {
          TAG: /* L */0,
          _0: mStatus._0 + ch
        };
        _i = i$p;
        continue ;
      }
      exit$3 = 5;
    }
    if (exit$3 === 5) {
      switch (ch) {
        case "%" :
            return printError(str, i, "Unexpected escape symbol % inside a range");
        case "{" :
            return printError(str, i, "Unexpected { symbol inside a range");
        case "}" :
            return printError(str, i, "Unexpected } symbol");
        default:
          exit$2 = 4;
      }
    }
    if (exit$2 === 4) {
      if (mStatus.TAG === /* D */3) {
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
      case 1 :
          switch (mStatus.TAG | 0) {
            case /* L */0 :
                _mStatus = {
                  TAG: /* L */0,
                  _0: mStatus._0 + ch
                };
                _i = i$p;
                continue ;
            case /* I */2 :
                _mStatus = {
                  TAG: /* I */2,
                  _0: mStatus._0 + ch
                };
                _i = i$p;
                continue ;
            case /* R */4 :
                _mStatus = {
                  TAG: /* R */4,
                  _0: mStatus._0,
                  _1: mStatus._1 + ch
                };
                _i = i$p;
                continue ;
            
          }
      case 2 :
          _mResult = commit(result, mStatus);
          _mStatus = {
            TAG: /* L */0,
            _0: ""
          };
          _i = i$p;
          continue ;
      
    }
  }}

function printRange(parts, min, max, sep) {
  if (min === max) {
    return parts[min];
  } else if (max === (parts.length - 1 | 0)) {
    return printRange(parts, min, max - 1 | 0, sep) + parts[max];
  } else {
    return parts.slice(min, max + 1 | 0).join(sep);
  }
}

function print(sepOpt, nodes, path) {
  var sep = sepOpt !== undefined ? sepOpt : Path.sep;
  if (Path.isAbsolute(path)) {
    return {
            TAG: /* Error */1,
            _0: "An absolute path cannot be used as a source path:\n" + path
          };
  }
  var ext = Path.extname(path);
  var withoutExt = path.substring(0, path.length - ext.length | 0);
  var parts = withoutExt.split(sep).concat(ext);
  var len = parts.length;
  var norm = nodes.map(function (node) {
        if (typeof node === "number") {
          return node;
        }
        if (node.TAG !== /* Range */0) {
          return node;
        }
        var max = node._1;
        var min = node._0;
        var min$1 = Math.max(0, min < 0 ? len + min | 0 : min);
        var max$1 = Math.min(len - 1 | 0, max < 0 ? len + max | 0 : max);
        if (max$1 < min$1) {
          return ;
        } else {
          return {
                  TAG: /* Range */0,
                  _0: min$1,
                  _1: max$1
                };
        }
      });
  return {
          TAG: /* Ok */0,
          _0: norm.map(function (node, i) {
                    if (node !== undefined) {
                      if (typeof node === "number") {
                        if (i > 0 && norm[i - 1 | 0] === undefined) {
                          return [];
                        } else {
                          return [sep];
                        }
                      } else if (node.TAG === /* Range */0) {
                        return [printRange(parts, node._0, node._1, sep)];
                      } else {
                        return [node._0];
                      }
                    } else {
                      return [];
                    }
                  }).flat().join("")
        };
}

function transformExn(pattern) {
  var nodes = parse(pattern);
  if (nodes.TAG !== /* Ok */0) {
    return Js_exn.raiseError(nodes._0);
  }
  var nodes$1 = nodes._0;
  return function (sep, path) {
    var result = print(sep, nodes$1, path);
    if (result.TAG === /* Ok */0) {
      return result._0;
    } else {
      return Js_exn.raiseError(result._0);
    }
  };
}
var transformExn_1 = transformExn;const createTransform = (pattern) => {
  const fn = transformExn_1(pattern);
  return (path, sep) => fn(sep, path);
};exports.createTransform=createTransform;