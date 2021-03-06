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

var _pg = require("pg");

var Database =
/*#__PURE__*/
function () {
  function Database(config) {
    (0, _classCallCheck2["default"])(this, Database);
    this.config = config;
    this.pool = new _pg.Pool(this.config);
  }

  (0, _createClass2["default"])(Database, [{
    key: "prepare",
    value: function () {
      var _prepare = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(text) {
        var options,
            existingClient,
            batch,
            client,
            _args2 = arguments;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
                existingClient = options.client, batch = options.batch; // get a new client from the pool if one is needed

                if (!existingClient) {
                  _context2.next = 6;
                  break;
                }

                _context2.t0 = existingClient;
                _context2.next = 9;
                break;

              case 6:
                _context2.next = 8;
                return this.pool.connect();

              case 8:
                _context2.t0 = _context2.sent;

              case 9:
                client = _context2.t0;
                return _context2.abrupt("return", {
                  client: client,
                  text: text,
                  execute: function () {
                    var _execute = (0, _asyncToGenerator2["default"])(
                    /*#__PURE__*/
                    _regenerator["default"].mark(function _callee(params) {
                      var results;
                      return _regenerator["default"].wrap(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              _context.next = 2;
                              return client.query(text, params);

                            case 2:
                              results = _context.sent;

                              if (client.release && batch !== true) {
                                client.release();
                              }

                              return _context.abrupt("return", results);

                            case 5:
                            case "end":
                              return _context.stop();
                          }
                        }
                      }, _callee);
                    }));

                    function execute(_x2) {
                      return _execute.apply(this, arguments);
                    }

                    return execute;
                  }()
                });

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function prepare(_x) {
        return _prepare.apply(this, arguments);
      }

      return prepare;
    }()
  }]);
  return Database;
}();

exports["default"] = Database;