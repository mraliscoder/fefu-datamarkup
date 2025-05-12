const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openFile: () => ipcRenderer.invoke('open-file-dialog'),
  exportCsv: (data) => ipcRenderer.invoke('export-csv', data),
  exportXlsx: (data) => ipcRenderer.invoke('export-xlsx', data),

  checkCache: () => ipcRenderer.invoke('check-cache'),
  saveCache: (cacheData) => ipcRenderer.invoke('save-cache', cacheData),
  loadCache: () => ipcRenderer.invoke('load-cache'),
  clearCache: () => ipcRenderer.invoke('clear-cache')
});
