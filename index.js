const { app, ipcMain, dialog, BrowserWindow } = require('electron');
const process = require('process');
const window = require('./window');
console.log(`*🚀开始启动客户端应用程序`);
let winInstance = null;
app.commandLine.appendSwitch('lang', 'zh_CN');
function initialize() {
  let isGetLock = app.requestSingleInstanceLock();
  if (!isGetLock) {
    app.quit();
    process.exit(0);
  }
  app.on('second-instance', () => {
    if (winInstance) {
      if (winInstance.isMinimized()) winInstance.restore();
      winInstance.focus();
      winInstance.show();
    } else {
      winInstance = window.create();
    }
  });
  app.on('ready', async () => {
    try {
      winInstance = window.create();
    } catch (error) {
      if (error.code == 'EADDRINUSE') {
        dialog.showErrorBox('端口被占用！', '请关闭其他程序或重启计算机');
        app.quit();
      } else {
        dialog.showErrorBox('启动失败', '初始化应用失败，请卸载后重新安装');
        app.quit();
      }
    }
  });
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  app.on('window-all-closed', () => {
    app.quit();
  });
  app.on('gpu-process-crashed', () => {
    console.log('App crashed!!!');
    app.exit(0);
  });
}
initialize();
ipcMain.on('quit', () => {
  app.quit();
  process.exit(0);
});
