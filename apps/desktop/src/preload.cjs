const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("sparkDesktop", {
  platform: process.platform
});
