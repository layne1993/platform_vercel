"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _utils = require("../../utils");

require("./ErrorMessage.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ErrorMessage = function ErrorMessage(_ref) {
  var message = _ref.message,
      schema = _ref.schema,
      softHidden = _ref.softHidden,
      hardHidden = _ref.hardHidden;
  var msg = '';
  if (typeof message === 'string') msg = message;

  if (Array.isArray(message)) {
    msg = message[0] || '';
  }

  msg = (0, _utils.translateMessage)(msg, schema);
  if (hardHidden) return /*#__PURE__*/_react.default.createElement("div", {
    className: "error-message"
  });
  return !msg && softHidden ? null : /*#__PURE__*/_react.default.createElement("div", {
    className: "error-message"
  }, msg);
};

var _default = ErrorMessage;
exports.default = _default;