const { app, BrowserWindow, net } = require('electron');
const path = require("path")

const models = require("./db");

const Estudiantes = [];

// REALIZAR CONSULTA DE INFORMACIÓN Y LLENAR LA VARIABLE ESTUDIANTES
function obtener_estudiantes() {
    // Datos de prueba
    Estudiantes.push({
        nombres:"JONATHAN MARIO",
        apellidos:"MORENO RIVERA",
        cedula:"2300349640",
        email:"jmmorenor@pucesd.edu.ec"
    });
    Estudiantes.push({
        nombres:"RICARDO ALEXANDER",
        apellidos:"MORÁN CHIMBO",
        cedula:"2300349641",
        email:"redes@pucesd.edu.ec"
    });
}

obtener_estudiantes();

const electronReload = require('electron-reload')

let data = [];

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    win.loadFile(path.join(__dirname, "views", "index.html"));

    win.webContents.on("before-input-event", (event, input) => {
        if (input.type == "keyUp") {
            data.push(input.key);
            if (data.at(-1) == 'Tab') {
                data.pop();
                data.shift();

                data = data.join("");

                // Cédula del estudiante
                console.log(data);
                const result = Estudiantes.find(e => e.cedula == data);
                if (result) {
                    win.webContents.send("datos", result)    
                }else{
                    win.webContents.send("no_data", null)    
                }
                
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