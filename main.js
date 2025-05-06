const {app, BrowserWindow, dialog, ipcMain} = require('electron');
const path = require('path');
const fs = require('fs');

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
