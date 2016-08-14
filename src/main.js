const {app, BrowserWindow, Menu, Tray} = require('electron');

const isDebug = process.env.NODE_ENV === 'development';
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// http://electron.atom.io/docs/api/app/#appmakesingleinstancecallback
function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        title: 'Dr. Know',
        frame: false,
        icon: `${__dirname}/assets/images/icon-64.png`
        // titleBarStyle: 'hidden',
    });

    // and load the index.html of the app.
    win.loadURL(`file://${__dirname}/index.html`);

    // Open the DevTools.
    isDebug && win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});

// http://electron.atom.io/docs/api/tray/
let tray = null;
app.on('ready', () => {
    tray = new Tray(`${__dirname}/assets/images/icon-64.png`);
    tray.setToolTip('Dr. Know');

    const contextMenu = Menu.buildFromTemplate([
        {label: 'Item1', type: 'radio'},
        {label: 'Item2', type: 'radio'},
        {label: 'Item3', type: 'radio', checked: true},
        {label: 'Item4', type: 'radio'}
    ]);
    tray.setContextMenu(contextMenu);
});
