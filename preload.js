const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openFile: () => ipcRenderer.invoke('open-file-dialog'),
  exportCsv: (data) => ipcRenderer.invoke('export-csv', data)
});
