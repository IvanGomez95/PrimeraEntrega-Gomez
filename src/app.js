import express from 'express';
import router from "./router/index.routes.js"
import viewRoutes from "./router/views.routes.js"
import __dirname from './dirname.js';
import handlebars from "express-handlebars";
import { Server } from 'socket.io';
import { connectMongoDB } from './config/mongoDB.config.js';

const PORT = 8080;
const app = express ();

connectMongoDB ();


app.use (express.urlencoded ({extended:true}));
app.use (express.json ());
app.use ("/static", express.static (__dirname + "/public"));
app.use (express.static ("public"))

//Handlebars
app.engine ( "handlebars", handlebars.engine() );
app.set ("views", __dirname + "/views");
app.set ("view engine", "handlebars");

app.use ("/", viewRoutes);






app.use ("/api", router);





const httpServer= app.listen (PORT, ()=> console.log(`Servidor escuchando en el puerto ${PORT}`));


export const io = new Server (httpServer);

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");


    
});


