const { app, BrowserWindow } = require('electron');
const path = require('path');
app.commandLine.appendSwitch('lang', 'zh_CN');
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.webContents.openDevTools();
  mainWindow.loadFile('index.html');
}
app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
