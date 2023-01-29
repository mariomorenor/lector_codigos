const { default: axios } = require("axios");

const url = "http://localhost:8069/jsonrpc"


const odoo = {
    username: "stecnico@pucesd.edu.ec",
    db: "pucesd",
    password: "825374200M@rio"
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