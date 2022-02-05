// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var Pervasives = require("rescript/lib/js/pervasives.js");

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
                        TAG: /* Literal */2,
                        _0: s
                      })
                };
        }
    case /* S */1 :
        return Pervasives.invalid_arg("Cannot commit a Skip");
    case /* I */2 :
        var n = status._0;
        var n$p = $$int(n);
        if (n$p !== undefined) {
          return {
                  TAG: /* Ok */0,
                  _0: result.concat({
                        TAG: /* Index */1,
                        _0: n$p
                      })
                };
        } else {
          return {
                  TAG: /* Error */1,
                  _0: "Bad range limit: " + n
                };
        }
    case /* R */3 :
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
          if (n$p$1 >= 0 ? m$p > 0 && m$p < n$p$1 : m$p >= 0 || n$p$1 < m$p) {
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

function parse(str) {
  var _i = 0;
  var _maybeStatus = {
    TAG: /* L */0,
    _0: ""
  };
  var _maybeResult = {
    TAG: /* Ok */0,
    _0: []
  };
  while(true) {
    var maybeResult = _maybeResult;
    var maybeStatus = _maybeStatus;
    var i = _i;
    if (maybeResult.TAG !== /* Ok */0) {
      return {
              TAG: /* Error */1,
              _0: i - 1 | 0,
              _1: maybeResult._0
            };
    }
    var result = maybeResult._0;
    if (maybeStatus === undefined) {
      return {
              TAG: /* Ok */0,
              _0: result
            };
    }
    var ch = str.charAt(i);
    var exit = 0;
    var exit$1 = 0;
    var exit$2 = 0;
    switch (ch) {
      case "" :
          switch (maybeStatus.TAG | 0) {
            case /* L */0 :
                _maybeResult = commit(result, maybeStatus);
                _maybeStatus = undefined;
                _i = i + 1 | 0;
                continue ;
            case /* S */1 :
                return {
                        TAG: /* Error */1,
                        _0: i,
                        _1: "Unexpected end of string. Expected a character after \"\\\""
                      };
            case /* I */2 :
            case /* R */3 :
                return {
                        TAG: /* Error */1,
                        _0: i,
                        _1: "Unexpected end of string. Did you forget to close a range?"
                      };
            
          }
      case "." :
          switch (maybeStatus.TAG | 0) {
            case /* L */0 :
                exit = 1;
                break;
            case /* S */1 :
                exit$2 = 4;
                break;
            case /* I */2 :
                _maybeResult = {
                  TAG: /* Ok */0,
                  _0: result
                };
                _maybeStatus = {
                  TAG: /* R */3,
                  _0: maybeStatus._0,
                  _1: ""
                };
                _i = i + 1 | 0;
                continue ;
            case /* R */3 :
                if (maybeStatus._1 !== "") {
                  return {
                          TAG: /* Error */1,
                          _0: i,
                          _1: "Unexpected range delimeter character"
                        };
                }
                _maybeResult = {
                  TAG: /* Ok */0,
                  _0: result
                };
                _maybeStatus = maybeStatus;
                _i = i + 1 | 0;
                continue ;
            
          }
          break;
      case "/" :
          switch (maybeStatus.TAG | 0) {
            case /* L */0 :
                _maybeResult = {
                  TAG: /* Ok */0,
                  _0: result.concat(/* Sep */0)
                };
                _maybeStatus = maybeStatus;
                _i = i + 1 | 0;
                continue ;
            case /* S */1 :
                exit$2 = 4;
                break;
            case /* I */2 :
            case /* R */3 :
                exit$1 = 3;
                break;
            
          }
          break;
      case "\\" :
          if (maybeStatus.TAG !== /* L */0) {
            return {
                    TAG: /* Error */1,
                    _0: i,
                    _1: "Unexpected escape character"
                  };
          }
          _maybeResult = {
            TAG: /* Ok */0,
            _0: result
          };
          _maybeStatus = {
            TAG: /* S */1,
            _0: maybeStatus._0
          };
          _i = i + 1 | 0;
          continue ;
      case "{" :
          switch (maybeStatus.TAG | 0) {
            case /* L */0 :
                _maybeResult = commit(result, maybeStatus);
                _maybeStatus = {
                  TAG: /* I */2,
                  _0: ""
                };
                _i = i + 1 | 0;
                continue ;
            case /* S */1 :
                exit$2 = 4;
                break;
            case /* I */2 :
            case /* R */3 :
                exit$1 = 3;
                break;
            
          }
          break;
      case "}" :
          switch (maybeStatus.TAG | 0) {
            case /* L */0 :
                exit$1 = 3;
                break;
            case /* S */1 :
                exit$2 = 4;
                break;
            case /* I */2 :
            case /* R */3 :
                exit = 2;
                break;
            
          }
          break;
      default:
        exit$2 = 4;
    }
    if (exit$2 === 4) {
      if (maybeStatus.TAG === /* S */1) {
        _maybeResult = {
          TAG: /* Ok */0,
          _0: result
        };
        _maybeStatus = {
          TAG: /* L */0,
          _0: maybeStatus._0 + ch
        };
        _i = i + 1 | 0;
        continue ;
      }
      exit$1 = 3;
    }
    if (exit$1 === 3) {
      switch (ch) {
        case "/" :
            return {
                    TAG: /* Error */1,
                    _0: i,
                    _1: "Unexpected path separator character"
                  };
        case "{" :
            return {
                    TAG: /* Error */1,
                    _0: i,
                    _1: "Unexpected open range character"
                  };
        case "}" :
            return {
                    TAG: /* Error */1,
                    _0: i,
                    _1: "Unexpected close range character"
                  };
        default:
          exit = 1;
      }
    }
    switch (exit) {
      case 1 :
          switch (maybeStatus.TAG | 0) {
            case /* L */0 :
                _maybeResult = {
                  TAG: /* Ok */0,
                  _0: result
                };
                _maybeStatus = {
                  TAG: /* L */0,
                  _0: maybeStatus._0 + ch
                };
                _i = i + 1 | 0;
                continue ;
            case /* I */2 :
                _maybeResult = {
                  TAG: /* Ok */0,
                  _0: result
                };
                _maybeStatus = {
                  TAG: /* I */2,
                  _0: maybeStatus._0 + ch
                };
                _i = i + 1 | 0;
                continue ;
            case /* R */3 :
                _maybeResult = {
                  TAG: /* Ok */0,
                  _0: result
                };
                _maybeStatus = {
                  TAG: /* R */3,
                  _0: maybeStatus._0,
                  _1: maybeStatus._1 + ch
                };
                _i = i + 1 | 0;
                continue ;
            
          }
      case 2 :
          _maybeResult = commit(result, maybeStatus);
          _maybeStatus = {
            TAG: /* L */0,
            _0: ""
          };
          _i = i + 1 | 0;
          continue ;
      
    }
  };
}

exports.parse = parse;
/* No side effect */