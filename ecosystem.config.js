module.exports = {
  apps: [
    {
      name: "snirs-file-upload",
      script: "server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G"
    }
  ]
};
