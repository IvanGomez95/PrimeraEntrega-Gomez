import express from 'express';
import router from "./router/index.routes.js"
import __dirname from './dirname.js';

const PORT = 8080;
const app = express ();


app.use (express.urlencoded ({extended:true}));
app.use (express.json ());
app.use ("/static", express.static (__dirname + "public"));







app.use ("/api", router);





app.listen (PORT, ()=> console.log(`Servidor escuchando en el puerto ${PORT}`));