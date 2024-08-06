import { Router } from "express";
import productManager from "../dao/fileSystem/productManager.js";
import { io } from "../app.js";

const router = Router ();


router.get ("/", async (req, res) => {
    try{
        const products = await productManager.getProducts ();
        res.render ("home", {products, styles: "index.css"});
    }catch (error) {
        console.log(error);
        res.status (500).json ({error: "Internal server error"});
    }    
})

router.get ("/realtimeproducts", async (req, res) => {
    try{
        const products = await productManager.getProducts ();
        io.emit ("products", products)
        res.render ("realTimeProducts", {products, styles: "index.css"});
    }catch (error) {
        console.log(error);
        res.status (500).json ({error: "Internal server error"});
    }    
})

router.post ("/realtimeproducts", async (req, res) => {
    try{
        const { title, price, description } = req.body;
        await productManager.addProduct ({title, price, description});
        const products = await productManager.getProducts ();
        io.emit ("products", products)
        res.render ("realTimeProducts", {styles: "index.css"});
    }catch (error) {
        console.log(error);
        res.status (500).json ({error: "Internal server error"});
    }    
})

router.delete ("/realtimeproducts", async (req, res) => {
    try{
        const { id } = req.body;
        await productManager.deleteProduct (Number (id));
        const products = await productManager.getProducts();
        io.emit ("products", products)
        res.render ("realTimeProducts", {styles: "index.css"});
    }catch (error) {
        console.log(error);
        res.status (500).json ({error: "Internal server error"});
    }    
})





export default router;