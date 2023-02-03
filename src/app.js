const { app, BrowserWindow } = require('electron');
const path = require("path");

require("./express.js")

const models = require("./db");
const odoo = require("./odoo-api.js")



var Estudiantes = [];

const electronReload = require('electron-reload');
const moment = require('moment');

let data = [];

const createWindow = async () => {
    try {
        Estudiantes = await odoo.getUsers();
        setInterval(async () => {
            Estudiantes = await odoo.getUsers();
        }, 600000);
    } catch (error) {
        console.log("Ocurrió un error al conectarse con la base de datos");
        //TODO Obtener usuarios de manera local
    }
    const win = new BrowserWindow({
        width: 1366,
        height: 768,
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
                data.pop();
                data.shift();
                data = data.join("");

                // Cédula del estudiante
                console.log(data);
                const result = Estudiantes.find(e => e.cedula == data);

                if (result) {
                    models.Ingresos.create({
                        fecha: new Date(),
                        nombres: result.nombres,
                        apellidos: result.apellidos,
                        cedula: result.cedula,
                        email: result.email,
                        usuario_id: result.id
                    })
                    win.webContents.send("datos", result)
                } else {
                    win.webContents.send("no_data", null)
                }
                data = [];
            }
        }

    })


};

app.whenReady().then(() => {
    createWindow().then(() => {

        setInterval(async () => {
            let ingresos = await models.Ingresos.findAll({
                where: {
                    fecha: {
                        [models.Op.between]: [moment().format("Y-MM-DD 00:00:00"), moment().format("Y-MM-DD 23:59:59")]
                    }
                }, raw: true, attributes: ["id", "usuario_id",
                    [models.sequelize.fn("STRFTIME", "%Y-%m-%d %H:%M:%S", models.sequelize.col("fecha")), "fecha"]
                ]
            });

            if (ingresos.length > 0) {
                odoo.saveRecords(ingresos).then(res => {
                    models.Ingresos.destroy({
                        where: {
                            id: ingresos.map(i => i.id)
                        }
                    })
                }).catch(err => {
                    // Ocurrió un error al conectarse a la base de datos
                    console.log("Ocurrió un error al conectarse a la base de datos")
                });
            }
        }, 5000);

    });

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
