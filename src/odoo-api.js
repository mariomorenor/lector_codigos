const { default: axios } = require("axios");
const Store = require("electron-store")
const store = new Store({ name: "Configuracion" });

var config = {
    host: "http://localhost:8069/jsonrpc",
    username: "stecnico@pucesd.edu.ec",
    db: "pucesd",
    password: "825374200M@rio"
}

if (store.size == 0) {
    store.set(config)
} else {
    config = store.get()
}
const url = config.host

const odoo = {
    username: config.username,
    db: config.db,
    password: config.password
}


async function json_rpc(url, method, params) {
    const data = {
        jsonrpc: "2.0",
        method,
        params,
        id: Math.floor(Math.random() * 1000000)
    }

    const res = await axios.post(url, data, { "Content-Type": "application/json" })
    return res.data.result
}

async function call(url, service, method, ...args) {
    return await json_rpc(url, "call", { service, method, args })
}


async function login() {
    const uid = await call(url, "common", "login", odoo.db, odoo.username, odoo.password);
    return uid;
}

async function getUsers() {
    const uid = await login()
    const usuarios = await call(url, "object", "execute", odoo.db, uid, odoo.password, "biblioteca.usuarios", "search_read", [], ["nombres", "apellidos", "cedula", "email"])
    return usuarios;
}

async function saveRecords(records) {
    const uid = await login();
    const res = await call(url, "object", "execute", odoo.db, uid, odoo.password, "biblioteca.ingresos", "create", records);
    return res;
}

module.exports.login = login;
module.exports.getUsers = getUsers;
module.exports.saveRecords = saveRecords;