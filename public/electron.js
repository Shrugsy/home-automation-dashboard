const path = require('path');

const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const Store = require('electron-store');
const store = new Store();

function createWindow() {
  // Create the browser window.
  const opts = {
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
    ...store.get('winBounds'),
  };
  const win = new BrowserWindow(opts);

  win.on('close', () => {
    store.set('winBounds', win.getBounds());
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  const url = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../dist/index.html')}`;
  win.loadURL(url);
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bars to stay active until the user quits
// explicitly with Cmd + Q.
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
