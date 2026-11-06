const { app, BrowserWindow, shell } = require('electron');
const path = require('node:path');

const isExternalUrl = (url) => /^https?:|^mailto:|^tel:/i.test(url);

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1050,
    minHeight: 700,
    title: 'Bitigey Türkiyat',
    backgroundColor: '#0b0f17',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (isExternalUrl(url)) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  window.webContents.on('will-navigate', (event, url) => {
    if (isExternalUrl(url)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  window.loadFile(path.join(__dirname, '..', 'html', 'turkiyat.html'), {
    query: { desktop: '1' }
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
