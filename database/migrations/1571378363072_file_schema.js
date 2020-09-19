"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class FileSchema extends Schema {
  up() {
    this.create("files", table => {
      table.increments();
      table.text("fileName").notNullable();
      table.text("storedAt").notNullable();
      table.text("clientFileName").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("files");
  }
}

module.exports = FileSchema;
