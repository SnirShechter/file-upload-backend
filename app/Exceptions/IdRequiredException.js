"use strict";

const BaseException = use("App/Exceptions/BaseException");

class IdRequiredException extends BaseException {
  constructor() {
    super("Parameter 'id' is required", 400, "E_PARAMETER_ID_REQUIRED");
  }
}

module.exports = IdRequiredException;
