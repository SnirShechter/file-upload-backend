"use strict";
const { ServiceProvider } = require("@adonisjs/fold");

class NotificationsProvider extends ServiceProvider {
  register() {
    this.app.singleton("FileUpload/Src/Notifications", () => {
      let provider = {
        _Ws: null,
        // These two object contain the same data, only with opposite key-value pairs for easy access
        _uploadersByFileId: {},
        _uploadersBySocketId: {},
        unregisterSubscriber(socketId) {
          let hashedFileId = provider._uploadersBySocketId[socketId];

          delete provider._uploadersByFileId[hashedFileId];
          delete provider._uploadersBySocketId[socketId];
        },
        registerSubscriber(hashedFileId, socketId) {
          provider._uploadersByFileId[hashedFileId] = socketId;
          provider._uploadersBySocketId[socketId] = hashedFileId;
        },
        notify(hashedFileId) {
          let socketId = provider._uploadersByFileId[hashedFileId];
          if (socketId && provider._Ws && provider._Ws.io) {
            let socket = provider._Ws.io.sockets.sockets[socketId];
            if (socket) socket.emit("download");
          }
        }
      };
      return provider;
    });
  }
  boot() {
    // Registering dependencies
    const Notifications = this.app.use("FileUpload/Src/Notifications");
    const Ws = this.app.use("FileUpload/Src/WebSocket");
    Notifications._Ws = Ws;
  }
}

module.exports = NotificationsProvider;
