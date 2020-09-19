"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const HashIds = use("FileUpload/Src/HashIds");

const FileNotFoundException = use("App/Exceptions/FileNotFoundException");
const GeneralException = use("App/Exceptions/BaseException");

class File extends Model {
  static boot() {
    super.boot();
    this.addHook("afterCreate", "FileHook.logCreation");
  }
  // Custom queries
  static async findByHashedId(hashedId) {
    try {
      const id = HashIds.decode(hashedId);
      const fileRecord = await File.find(id);
      if (!fileRecord) throw new FileNotFoundException();
      return fileRecord;
    } catch (e) {
      throw new GeneralException();
    }
  }
  // Relationships
  logs() {
    return this.hasMany("App/Models/Log");
  }

  // Computed
  static get computed() {
    return ["hashedId"];
  }
  getHashedId({ id }) {
    return HashIds.encode(id);
  }
}

module.exports = File;
