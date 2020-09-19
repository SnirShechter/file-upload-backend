"use strict";

const BaseException = use("App/Exceptions/BaseException");

class FileRequiredException extends BaseException {
  constructor() {
    super("Parameter 'file' is required and must be of type 'file'", 400, "E_PARAMETER_FILE_REQUIRED");
  }
}

module.exports = FileRequiredException;
