import { request, response } from "express";
import productDao from "../dao/mongoDB/product.dao.js";
import cartDao from "../dao/mongoDB/cart.dao.js";

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
            return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el ID ${cid}` });
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
