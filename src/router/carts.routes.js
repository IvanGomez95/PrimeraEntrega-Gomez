import { Router } from "express";
import { authorization, checkCartAndProductIds, checkQuantity, isUserCart, passportCall } from "../middlewares/middlewares.js";
import cartsControllers from "../controllers/carts.controllers.js";

const router = Router ();

router.post ("/", cartsControllers.createCart);

router.get ("/:cid", cartsControllers.getCartById);

router.post ("/:cid/product/:pid", passportCall ("current"), authorization ("user"), checkCartAndProductIds, cartsControllers.addProductToCart);


//Endpoint para actualizar la quantity de un producto en el carrito a través del body. Se armaron middlewares para chequear la data que llega.
router.put("/:cid/product/:pid", passportCall ("current"), authorization ("user"), checkCartAndProductIds, checkQuantity, cartsControllers.updateProductQuantity);


//Delete para eliminar de a 1 producto del carrito (teniendo en cuenta su quantity)
router.delete("/:cid/product/:pid", passportCall ("current"), authorization ("user"), checkCartAndProductIds, cartsControllers.deleteProductInCart);


//Delete para eliminar todos los productos de un carrito
router.delete ("/:cid", passportCall ("current"), authorization ("user"), cartsControllers.deleteAllProductsInCart);

//Endpoint para finalizar la compra. Chequea con un middleware que no se esté realizando la compra con un CID que no sea el mismo que el del usuario.
router.get ("/:cid/purchase", passportCall ("jwt"), authorization ("user"), isUserCart, cartsControllers.purchaseCart);

export default router;