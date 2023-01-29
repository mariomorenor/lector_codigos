const express = require("express");
const app = express();

app.get("/test",(req,res)=>{
    res.send("Server Running")
});


app.get("/reportes",(req,res)=>{

    // consulta bd devuelvo 

    res.send("vista de reportes");
} );



app.listen(3000,()=>{
    console.log("Server Runing on port",3000)
});