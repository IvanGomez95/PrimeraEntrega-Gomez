import { request, response } from "express";
import productRepository from "../persistence/mongoDB/product.repository.js";
import { verifyToken } from "../utils/jwt.js";
import passport from "passport";
import cartServices from "../services/cart.services.js";
import productsServices from "../services/products.services.js";

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

        const productExists = await productRepository.checkProductByCode(code);
        if (productExists) {
            return res.status(400).json({ status: "Error", msg: `Product with code ${code} already exists` });
        };

        const checkData = Object.values (newProduct).includes (undefined);
        if (checkData) return res.status (400).json ({status: "Error", msg: "All fields are mandatory"});

        next();

    } catch (error) {
        console.log(error);
        res.status (500).json ({status: "Error", msg: "Internal server error"});
    };
};

//Middleware que chequea que el cid y el pid sean correctos en el endpoint para actualizar la cantidad de un producto en el carrito
export const checkCartAndProductIds = async (req = request, res = response, next) => {
    const { cid, pid } = req.params;

    try {
        const product = await productRepository.getById(pid);
        if (!product) {
            return res.status(404).json({ status: "Error", msg: `Product with ID ${pid} couldn't be found` });
        }

        const cart = await cartServices.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ status: "Error", msg: `Cart with ID ${cid} couldn't be found`});
        }

        next();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Internal server error" });
    }
};




//Middleware que chequea que se esté enviando una cantidad por body cuando queremos cambiar la cantidad de un producto en el carrito
export const checkQuantity = (req = request, res = response, next) => {
    const { quantity } = req.body;

    if (quantity === undefined || typeof quantity !== "number" || quantity <= 0) {
        return res.status(400).json({ status: "Error", msg: "You must indicate a quantity and this must also be greater than zero" });
    };

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
  return (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        const message = info && info.message ? info.message : 'Authentication failed';
        return res.status(401).json({
          status: "Error",
          msg: message,
        });
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};


export const checkProductExists = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const product = await productsServices.getProductById(pid);
        if (!product) {
            return res.status(404).json({ status: "Error", msg: `Product with ID ${pid} couldn't be found` });
        }
        req.product = product;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Internal server error" });
    }
};


export const isUserCart = async (req = request, res = response, next) => {
  const { cid } = req.params;

  if (req.user.cart._id !== cid) return res.status(401).json({ status: "Error", msg: "Incorrect user's cart" });

  next();
};