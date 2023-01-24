const { contextBridge, ipcRenderer } = require('electron');
console.log("PReload")
contextBridge.exposeInMainWorld('ipcRenderer', {
    on: (channel, action) => {
        ipcRenderer.on(channel, action)
    }
})