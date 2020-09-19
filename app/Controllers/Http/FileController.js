const path = require("path");

// Internal/Framework libraries
const Helpers = use("Helpers");
const Logger = use("Logger");
const File = use("App/Models/File");
const Log = use("App/Models/Log");
const Notifications = use("FileUpload/Src/Notifications");
const Storage = use("FileUpload/Src/Storage");

// Exceptions
const IdRequiredException = use("App/Exceptions/IdRequiredException");

const {
  logTypes: { GET_FILE }
} = require(path.join(Helpers.appRoot(), "utils/constants"));

class FileController {
  /** Stores a new file and returns the id */
  async store({ request }) {
    Logger.debug("[File] Storing file");

    // Processing and storing file
    const { fileName, clientFileName, storedAt } = await Storage.upload(request);

    // Save payload to database. A new log is automatically created (using a model hook).
    const fileRecord = await File.create({ fileName, clientFileName, storedAt });
    const hashedId = fileRecord.toJSON().hashedId;

    // Registering uploader as subscriber
    Notifications.registerSubscriber(hashedId, request.all().socketId);

    Logger.debug("[File] Successfully stored " + clientFileName);
    return { id: hashedId };
  }

  /** Receives an id and returns the matching file */
  async show({ response, params }) {
    Logger.debug("[File] Showing file");

    // The server is not handling the s3 stream correctly, so we must handle the request ourselves
    response.implicitEnd = false;

    // Decode id and fetch it from the database
    const hashedId = params.id;
    if (!hashedId) throw new IdRequiredException();
    const fileRecord = await File.findByHashedId(hashedId);

    // Downloading the file to the client
    await Storage.download(response, fileRecord);

    // Sending a notification to the uploader (if applicable)
    Notifications.notify(hashedId);

    // Creating a log
    await Log.create({ type: GET_FILE, file_id: fileRecord.id });
    Logger.debug(`[Show] Successfully Showed ${fileRecord.clientFileName}`);
  }
}

module.exports = FileController;
