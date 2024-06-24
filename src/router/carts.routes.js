import { Router } from "express";
import cartDao from "../dao/mongoDB/cart.dao.js";
import productDao from "../dao/mongoDB/product.dao.js";
import { checkCartAndProductIds, checkQuantity } from "../middlewares/middlewares.js";

const router = Router ();

router.post ("/", async (req, res) => {
    try {
        const cart = await cartDao.create ();

        res.status (201).json({status: "success", cart});

    } catch (error) {
        console.log(error);
        res.status (500).json ({status: "Error", msg: "Error interno del servidor"});
    }
});


router.get ("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartDao.getById (cid);
        if (!cart) return res.status (404).json ({status: "Error", msg: `El carrito con ID ${cid} no existe`});

        res.status (200).json({status: "success", cart});

    } catch (error) {
        console.log(error);
        res.status (500).json ({status: "Error", msg: "Error interno del servidor"});
    }
});



router.post ("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const product = await productDao.getById(pid);

        if (!product) return res.status (404).json ({status: "Error", msg: `No se encontró el producto con el ID ${pid}`});
        
        const cart = await cartDao.getById(cid);
        if (!cart) return res.status (404).json ({status: "Error", msg: `No se encontró el carrito con el ID ${cid}`});

        const cartUpdate = await cartDao.addProductToCart(cid, pid);
        
        res.status (200).json({status: "success", payload: cartUpdate});

    } catch (error) {
        console.log(error);
        res.status (500).json ({status: "Error", msg: "Error interno del servidor"});
    }
});



//Endpoint para actualizar la quantity de un producto en el carrito a través del body. Se armaron middlewares para chequear la data que llega.
router.put("/:cid/product/:pid", checkCartAndProductIds, checkQuantity, async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cartUpdate = await cartDao.updateQuantityInCart(cid, pid, Number(quantity));

        res.status(200).json({ status: "success", payload: cartUpdate });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
    }
});


//Delete para eliminar de a 1 producto del carrito (teniendo en cuenta su quantity)
router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const product = await productDao.getById(pid);
        if (!product) {
            return res.status(404).json({ status: "Error", msg: `No se encontró el producto con el ID ${pid}` });
        }
        
        const cart = await cartDao.getById(cid);
        if (!cart) {
            return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el ID ${cid}` });
        }

        const cartUpdate = await cartDao.deleteProductInCart(cid, pid);
        
        res.status(200).json({ status: "success", payload: cartUpdate });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
    }
});

//Delete para eliminar todos los productos de un carrito
router.delete ("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartDao.clearAllProductsInCart (cid);
        if (!cart) return res.status (404).json ({status: "Error", msg: "Carrito no encontrado"});

        res.status (200).json({status: "success", cart});

    } catch (error) {
        console.log(error);
        res.status (500).json ({status: "Error", msg: "Error interno del servidor"});
    }
});



export default router;