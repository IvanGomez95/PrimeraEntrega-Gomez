//*Estas rutas son para poder mostrar un mensaje un poco más personalizado si el front/cliente intenta acceder a una ruta errónea. El profe había hecho sólo con GET, pero me pareció sumar para todas las distintas peticiones posibles y pasarlas todas a errors.routes.js y sacarlas del index.routes.js para que esté más ordenado todo. Largo el comentario, si.

import { Router } from "express";

const router = Router();
router.get ("*", async (req, res) => {
    try {
        res.status (404).json ({status: "Error", msg: "Route not found"})
    } catch (error) {
        console.log(error);
        res.status (500).json ({status: "Error", msg: "Internal server error"});
    }
});

router.post ("*", async (req, res) => {
    try {
        res.status (404).json ({status: "Error", msg: "Route not found"});
    } catch (error) {
        console.log(error);
        res.status (500).json ({status: "Error", msg: "Internal server error"});
    }
});

router.put ("*", async (req, res) => {
    try {
        res.status (404).json ({status: "Error", msg: "Route not found"});
    } catch (error) {
        console.log(error);
        res.status (500).json ({status: "Error", msg: "Internal server error"});
    }
});

router.delete ("*", async (req, res) => {
    try {
        res.status (404).json ({status: "Error", msg: "Route not found"});
    } catch (error) {
        console.log(error);
        res.status (500).json ({status: "Error", msg: "Internal server error"});
    }
});


export default router;