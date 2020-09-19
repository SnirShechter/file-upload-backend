"use strict";

const BaseException = use("App/Exceptions/BaseException");

class FileNotFoundException extends BaseException {
  constructor() {
    super("File not found", 404, "E_FILE_NOT_FOUND");
  }
}

module.exports = FileNotFoundException;
