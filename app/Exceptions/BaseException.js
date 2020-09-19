"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");
const Logger = use("Logger");

class BaseException extends LogicalException {
  constructor(message, status, code) {
    super(message, status, code);
  }
  handle(error, { response }) {
    // Returns the error as JSON
    response
      .status(error.status)
      .send(JSON.stringify({ message: error.message, code: error.code }));
  }
  report(error) {
    Logger.error(error);
  }
}

module.exports = BaseException;
