"use strict";
const { ServiceProvider } = require("@adonisjs/fold");

class WebSocketProvider extends ServiceProvider {
  register() {
    this.app.singleton("FileUpload/Src/WebSocket", () => {
      return { io: null };
    });
  }

  boot() {
    const Server = this.app.use("Server");
    const Logger = this.app.use("Logger");
    const Socket = this.app.use("FileUpload/Src/WebSocket");
    const Notifications = this.app.use("FileUpload/Src/Notifications");

    Socket.io = use("socket.io")(Server.getInstance());
    Socket.io.on("connection", function(socket) {
      Logger.debug(`[Socket] New connection: ${socket.id}`);

      socket.on("disconnect", function() {
        Logger.debug(`[Socket] Connection lost: ${socket.id}`);
        Notifications.unregisterSubscriber(socket.id);
      });
    });
  }
}

module.exports = WebSocketProvider;
