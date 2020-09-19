"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const path = require("path");
const Schema = use("Schema");
const Helpers = use("Helpers");

const { logTypes } = require(path.join(Helpers.appRoot(), "utils/constants"));

class LogSchema extends Schema {
  up() {
    this.create("logs", table => {
      table.increments();
      table
        .integer("file_id")
        .unsigned()
        .references("id")
        .inTable("files")
        .notNullable();
      table.enum("type", Object.values(logTypes)).notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("logs");
  }
}

module.exports = LogSchema;
