"use strict";
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ipcRenderer", {
  on(channel, listener) {
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
  },
  off(channel, listener) {
    return ipcRenderer.off(channel, listener);
  },
  send(channel, ...args) {
    return ipcRenderer.send(channel, ...args);
  },
  invoke(channel, ...args) {
    return ipcRenderer.invoke(channel, ...args);
  }
  // Você pode expor outras APIs aqui, como:
  // getAllEtiquetas: () => ipcRenderer.invoke('get-all-etiquetas'),
  // getTemplate: () => ipcRenderer.invoke('get-template'),
  // getBaseProduto: () => ipcRenderer.invoke('get-base-produto'),
});
