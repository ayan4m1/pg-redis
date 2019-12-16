"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _cache = _interopRequireDefault(require("./cache"));

var _db = _interopRequireDefault(require("./db"));

var PgRedis =
/*#__PURE__*/
function () {
  function PgRedis(config) {
    (0, _classCallCheck2["default"])(this, PgRedis);
    this.cache = new _cache["default"]();
    this.db = new _db["default"](config);
  }

  (0, _createClass2["default"])(PgRedis, [{
    key: "prepare",
    value: function prepare(text, options) {
      return _regenerator["default"].async(function prepare$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", this.db.prepare(text, options));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "query",
    value: function query(text) {
      var options,
          cacheHit,
          statement,
          results,
          _args2 = arguments;
      return _regenerator["default"].async(function query$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {
                duration: 0
              };
              cacheHit = this.cache.get(text);

              if (!cacheHit) {
                _context2.next = 6;
                break;
              }

              return _context2.abrupt("return", cacheHit);

            case 6:
              _context2.next = 8;
              return _regenerator["default"].awrap(this.db.prepare(text, options));

            case 8:
              statement = _context2.sent;
              _context2.next = 11;
              return _regenerator["default"].awrap(statement.execute());

            case 11:
              results = _context2.sent;

              if (options.duration > 0) {
                this.cache.store(text, results.rows, options.duration);
              }

              return _context2.abrupt("return", results.rows);

            case 14:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }]);
  return PgRedis;
}();

exports["default"] = PgRedis;