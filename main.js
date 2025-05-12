const {app, BrowserWindow, dialog, ipcMain} = require('electron');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const {
  checkCacheExists,
  saveCacheFile,
  loadCacheFile,
  clearCacheFile
} = require('./electronFunctions');


let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.menuBarVisible = false;
  mainWindow.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });

  mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('open-file-dialog', async () => {
  const {canceled, filePaths} = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {name: 'Videos', extensions: ['mp4', 'avi']}
    ]
  });

  if (!canceled) {
    return filePaths[0];
  }
  return null;
});

ipcMain.handle('export-csv', async (event, data) => {
  const {canceled, filePath} = await dialog.showSaveDialog({
    title: 'Сохранить CSV',
    defaultPath: 'video-analysis.csv',
    filters: [
      {name: 'CSV Files', extensions: ['csv']}
    ]
  });

  if (!canceled && filePath) {
    fs.writeFileSync(filePath, data, 'utf-8');
    return true;
  }
  return false;
});

ipcMain.handle('export-xlsx', async (event, data) => {
  const {canceled, filePath} = await dialog.showSaveDialog({
    title: 'Сохранить XLSX',
    defaultPath: 'video-analysis.xlsx',
    filters: [
      {name: 'Excel Files', extensions: ['xlsx']}
    ]
  });
  if (!canceled && filePath) {
    try {
      const jsonData = JSON.parse(data);
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(jsonData);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Разметка видео");
      XLSX.writeFile(workbook, filePath);
      return true;
    } catch (error) {
      console.error('Ошибка при экспорте XLSX:', error);
      return false;
    }
  }
  return false;
});

ipcMain.handle('check-cache', async () => {
  return checkCacheExists();
});

ipcMain.handle('save-cache', async (_, cacheData) => {
  return saveCacheFile(cacheData);
});

ipcMain.handle('load-cache', async () => {
  return loadCacheFile();
});

ipcMain.handle('clear-cache', async () => {
  return clearCacheFile();
});