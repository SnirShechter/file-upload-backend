"use strict";
const path = require("path");

const { ServiceProvider } = require("@adonisjs/fold");
const mime = require("mime-types");
const uuid = require("uuid/v4");

class StorageProvider extends ServiceProvider {
  register() {
    this.app.singleton("FileUpload/Src/Storage", () => {
      const provider = {
        _Drive: null,
        _Logger: null,
        download(response, fileRecord) {
          const { clientFileName, fileName, storedAt } = fileRecord;

          // Manually setting the response headers
          response.type(mime.contentType(path.extname(clientFileName)));
          response.header("Content-disposition", `attachment; filename=${clientFileName}`);

          // Getting the file and piping it to the client
          let file = provider._Drive.disk(storedAt).getStream(fileName);
          file.pipe(response.response);
          file.on("end", response.end); // Ending the response manually
        },
        async upload(request) {
          let clientFileName = null;
          let fileName = null;

          // Processing and storing file
          try {
            request.multipart.file("file", {}, async file => {
              if (!fileName) {
                clientFileName = file.clientName;
                fileName = `${uuid()}-${file.clientName}`;
              }
              await provider._Drive.put(fileName, file.stream);
            });
            // Awaiting process
            await request.multipart.process();
          } catch (e) {
            provider._Logger.error(e);
            throw new provider._GeneralException();
          }
          if (!fileName || !clientFileName) throw new provider._FileRequiredException();

          return { clientFileName, fileName, storedAt: provider._Drive._config.default };
        }
      };

      return provider;
    });
  }
  boot() {
    // Registering dependencies
    const StorageProvider = this.app.use("FileUpload/Src/Storage");

    const Drive = this.app.use("Drive");
    const Logger = this.app.use("Logger");
    const GeneralException = use("App/Exceptions/BaseException");
    const FileRequiredException = use("App/Exceptions/FileRequiredException");

    StorageProvider._Drive = Drive;
    StorageProvider._Logger = Logger;
    StorageProvider._GeneralException = GeneralException;
    StorageProvider._FileRequiredException = FileRequiredException;
  }
}

module.exports = StorageProvider;
