const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('assistantAPI', {
  send: (cmd) => ipcRenderer.send('handle-command', cmd)
});
