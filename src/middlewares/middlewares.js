import { request, response } from "express";
import productDao from "../dao/mongoDB/product.dao.js";
import cartDao from "../dao/mongoDB/cart.dao.js";
import { verifyToken } from "../utils/jwt.js";
import passport from "passport";

export const checkProductData = async (req = request, res = response, next) => {
    try {
        
        const { title, description, price, code, stock, category } = req.body;
        const newProduct = {
            title, 
            description,
            price,
            code,
            stock,
            category
        };

        const products = await productDao.getAll ();
        const productExists = products.docs.find ((p) => p.code === code );
        if (productExists) return res.status (400).json ({status: "Error", msg: `El producto con el código ${code} ya existe`});

        const checkData = Object.values (newProduct).includes (undefined);
        if (checkData) return res.status (400).json ({status: "Error", msg: "Todos los campos son obligatorios"});

        next();

    } catch (error) {
        console.log(error);
        res.status (500).json ({status: "Error", msg: "Error interno del servidor"});
    }
};

//Middleware que chequea que el cid y el pid sean correctos en el endpoint para actualizar la cantidad de un producto en el carrito
export const checkCartAndProductIds = async (req = request, res = response, next) => {
    const { cid, pid } = req.params;

    try {
        const product = await productDao.getById(pid);
        if (!product) {
            return res.status(404).json({ status: "Error", msg: `No se encontró el producto con el ID ${pid}` });
        }

        const cart = await cartDao.getById(cid);
        if (!cart) {
            return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el ID ${cid}`});
        }

        next();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
    }
};




//Middleware que chequea que se esté enviando una cantidad por body cuando queremos cambiar la cantidad de un producto en el carrito
export const checkQuantity = (req = request, res = response, next) => {
    const { quantity } = req.body;

    if (quantity === undefined || typeof quantity !== "number" || quantity <= 0) {
        return res.status(400).json({ status: "Error", msg: "Tenés que indicar una cantidad y que ésta sea mayor a cero" });
    }

    next();
};

//Middleware que chequea si el usuario está autorizado y si cuenta con los permisos necesarios
export const authorization = (role) => {
    return async (req = request, res = response, next) => {
      if (!req.user) return res.status(401).json({ status: "error", msg: "Unauthorized" });
      if (req.user.role != role) return res.status(403).json({ status: "error", msg: "You credentials don't have the authorization to perform this task" });
      
      next();
    };
};

//Middleware para chequear y validar Tokens
export const checkToken = async (req = request, res = response, next) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ status: "Error", msg: "Token has not been provided" });
  
      const tokenVerify = verifyToken(token);
      if (!tokenVerify) return res.status(401).json({ status: "Error", msg: "Invalid Token" });
  
      req.user = verifyToken;
  
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "Error", msg: "Internal server error" });
    }
};

//Middleware para enviar mensajes personalizados al cliente
export const passportCall = (strategy) => {
    return async (req = request, res = response, next) => {
      passport.authenticate(strategy, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ status: "Error", msg: info.message ? info.message : info.toString() });
  
        req.user = user;
        next();
      })(req, res, next);
    };
};


// export const isUserCart = async (req = request, res = response, next) => {
//    const { cid } = req.params;
//    if (req.user.cart !== cid) return res.status (401).json ({status: "Error", msg: "Wrong cart user"});
   
//    next();
// };