"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

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
    value: function () {
      var _prepare = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(text, options) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", this.db.prepare(text, options));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function prepare(_x, _x2) {
        return _prepare.apply(this, arguments);
      }

      return prepare;
    }()
  }, {
    key: "query",
    value: function () {
      var _query = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(text) {
        var options,
            cacheHit,
            statement,
            results,
            _args2 = arguments;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
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
                return this.db.prepare(text, options);

              case 8:
                statement = _context2.sent;
                _context2.next = 11;
                return statement.execute();

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
        }, _callee2, this);
      }));

      function query(_x3) {
        return _query.apply(this, arguments);
      }

      return query;
    }()
  }]);
  return PgRedis;
}();

exports["default"] = PgRedis;