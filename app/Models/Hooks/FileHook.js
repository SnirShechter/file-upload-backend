"use strict";
const path = require("path");
const Helpers = use("Helpers");

const {
  logTypes: { STORE_FILE }
} = require(path.join(Helpers.appRoot(), "utils/constants"));

const FileHook = (exports = module.exports = {});
const Log = use("App/Models/Log");
FileHook.logCreation = async modelInstance => {
  Log.create({ type: STORE_FILE, file_id: modelInstance.id });
};
