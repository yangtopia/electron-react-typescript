import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

let browserWindow: BrowserWindow | null;
const createWindow = async () => {
  browserWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1';
    browserWindow.loadURL(`http://localhost:4000`);

    browserWindow.webContents.once('dom-ready', () => {
      if (browserWindow) {
        browserWindow.webContents.openDevTools();
      }
    });
  } else {
    browserWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
      }),
    );
  }

  browserWindow.on('closed', () => {
    browserWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (browserWindow === null) {
    createWindow();
  }
});
