import React from 'react';
import { translateMessage } from '../../utils';
import "./ErrorMessage.css";

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

  msg = translateMessage(msg, schema);
  if (hardHidden) return /*#__PURE__*/React.createElement("div", {
    className: "error-message"
  });
  return !msg && softHidden ? null : /*#__PURE__*/React.createElement("div", {
    className: "error-message"
  }, msg);
};

export default ErrorMessage;