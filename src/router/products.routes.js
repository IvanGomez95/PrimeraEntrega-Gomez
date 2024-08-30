import { Router } from "express";
import { authorization, checkProductData, checkProductExists, passportCall } from "../middlewares/middlewares.js";
import productsControllers from "../controllers/products.controllers.js";

const router = Router ();

router.get ("/", passportCall ("jwt"), authorization ("user"), productsControllers.getAllProducts);

router.get ("/:pid", checkProductExists, productsControllers.getProductById);

router.put ("/:pid", passportCall ("current"), authorization ("admin"), checkProductExists, productsControllers.updateProduct);

router.delete ("/:pid", passportCall ("current"), authorization ("admin"), checkProductExists, productsControllers.deleteProduct);

router.post ("/", passportCall ("current"), authorization ("admin"), checkProductData, productsControllers.createProduct);


export default router;