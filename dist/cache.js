"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _crypto = require("crypto");

var _redis = require("redis");

var cache = (0, _redis.createClient)();

var Cache =
/*#__PURE__*/
function () {
  function Cache() {
    (0, _classCallCheck2["default"])(this, Cache);
  }

  (0, _createClass2["default"])(Cache, [{
    key: "hash",
    value: function hash(input) {
      var hash = (0, _crypto.createHash)('sha1');
      hash.update(input);
      return hash.digest('hex');
    }
  }, {
    key: "store",
    value: function store(query, results, duration) {
      var hash;
      return _regenerator["default"].async(function store$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              hash = this.hash(query);
              _context.next = 3;
              return _regenerator["default"].awrap(cache.set(hash, JSON.stringify(results)));

            case 3:
              cache.expire(hash, duration);

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "get",
    value: function get(query) {
      var hash, exists;
      return _regenerator["default"].async(function get$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              hash = this.hash(query);
              _context2.next = 3;
              return _regenerator["default"].awrap(cache.exists(hash));

            case 3:
              exists = _context2.sent;

              if (!exists) {
                _context2.next = 10;
                break;
              }

              _context2.next = 7;
              return _regenerator["default"].awrap(cache.get(hash));

            case 7:
              _context2.t0 = _context2.sent;
              _context2.next = 11;
              break;

            case 10:
              _context2.t0 = null;

            case 11:
              return _context2.abrupt("return", _context2.t0);

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }]);
  return Cache;
}();

exports["default"] = Cache;