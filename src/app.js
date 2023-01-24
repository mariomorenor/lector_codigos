const { app, BrowserWindow, net } = require('electron');
const path = require("path")

const db = require("./db");

const electronReload = require('electron-reload')

let data = [];

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
    });

    win.loadFile(path.join(__dirname, "views", "index.html"));

    win.webContents.on("before-input-event", (event, input) => {
        if (input.type == "keyUp") {
            data.push(input.key);
            if (data.at(-1) == 'Tab') {
                data.pop();
                data.shift();

                data = data.join("");

                // TODO listo para enviar la info (variable data) al server
                console.log(data);

                data = [];
            }
        }

    })



};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});