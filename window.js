const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
let mainWindow = null;
function createWindow(callback) {
  const indexPage = path.resolve(__dirname, './www/index.html');
  const config = {
    title: 'Yocoding',
    show: true,
    center: true,
    resizable: true,
    movable: true,
    minimizable: true,
    maximizable: true,
    // fullscreen: true,
    skipTaskbar: false,
    acceptFirstMouse: true,
    closable: true,
    backgroundColor: '#00BFFF',
    allowRunningInsecureContent: true,
    frame: true,
    webPreferences: {
      devTools: true,
      webSecurity: false,
      allowDisplayingInsecureContent: true,
      allowRunningInsecureContent: true,
      nodeIntegration: true,
    },
  };
  Menu.setApplicationMenu(null);
  mainWindow = new BrowserWindow(config);
  mainWindow.maximize();
  mainWindow.loadFile(indexPage);
  // 点击右上角退出，弹出确认窗口。
  // ***************************
  mainWindow.on('close', async (event) => {
    event.preventDefault();
    mainWindow.focus();
    const index = await dialog.showMessageBoxSync({
      type: 'warning',
      title: 'Yocoding',
      defaultId: 0,
      message: '退出应用',
      detail: '确定要离开Yocoding吗？未保存的工作将会消失。',
      buttons: ['取消', '退出'],
      noLink: true,
      cancelId: 0,
    });
    if (index == 1) {
      mainWindow = null;
      app.exit();
    }
  });
  // *******************************
  mainWindow
    .on('closed', function () {
      mainWindow = null;
    })
    .once('ready-to-show', function () {
      if (callback instanceof Function) {
        callback(mainWindow);
      }
      mainWindow.show();
    });
  return mainWindow;
}
module.exports = {
  create(callback) {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.destroy();
    }
    mainWindow = createWindow(callback);
    return mainWindow;
  },
};
