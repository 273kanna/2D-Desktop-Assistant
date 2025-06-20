// main.js
const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let win, tray;

function createWindow() {
  win = new BrowserWindow({
    width: 250,
    height: 250,
    x: 20,
    y: 700,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: false,
    resizable: false,
    hasShadow: false,
    autoHideMenuBar: true,         // ← hide the menu bar unless Alt is pressed
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html').then(() => {
    win.setAlwaysOnTop(true, 'screen-saver');
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    win.show();
  });
}

app.whenReady().then(() => {
  // Remove the default application menu entirely
  Menu.setApplicationMenu(null);

  createWindow();

  // ─── TRAY ICON ────────────────────────────────────────────
  tray = new Tray(path.join(__dirname, 'assets', 'icon.png'));
  const trayMenu = Menu.buildFromTemplate([
    { label: 'Show', click: () => win && win.show() },
    { label: 'Hide', click: () => win && win.hide() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setToolTip('2D Desktop Assistant');
  tray.setContextMenu(trayMenu);
  // ─────────────────────────────────────────────────────────

  // IPC handler for commands
  ipcMain.on('handle-command', (_, command) => {
    const cmd = command.toLowerCase();
    if (cmd.includes('spotify')) {
      exec('start spotify');
    } else if (cmd.includes('youtube')) {
      exec('start https://youtube.com');
    } else if (cmd.includes('google')) {
      exec('start https://google.com');
    } else {
      console.log('Unknown command:', cmd);
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
