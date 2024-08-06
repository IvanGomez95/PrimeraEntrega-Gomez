import { Router } from "express";
import { authorization, checkProductData, passportCall } from "../middlewares/middlewares.js";
import productDao from "../dao/mongoDB/product.dao.js";

const router = Router ();

router.get ("/", passportCall ("jwt"), authorization ("user"), async (req, res) => {
    try {
        const { limit, page, sort, category, status } = req.query;

        const options = {
            limit: limit || 10,
            page: page || 1,
            sort: {
                price: sort === "asc" ? 1 : -1
            },
            learn: true
        }

        if (category) {
            const products = await productDao.getAll({ category }, options);
            return res.status (200).json({status: "Success", products});
        }

        if (status) {
            const products = await productDao.getAll({ status }, options);
            return res.status (200).json({status: "Success", products});
        }

        const products = await productDao.getAll({}, options);
        res.status (200).json({status: "Success", products});

    } catch (error) {
        console.log(error);
        res.status (500).json({status: "Error", msg: "Internal server error"});
    }
});


router.get ("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productDao.getById (pid);
        if (!product) return res.status (404).json ({status: "Error", msg: `Product with ID ${pid} couldn't be found`});

        res.status (200).json({status: "Success", product});
        
    } catch (error) {
        console.log(error);
        res.status (500).json({status: "Error", msg: "Internal server error"});
    }
});

router.put ("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const productData = req.body;
        const product = await productDao.update (pid, productData);
        if (!product) return res.status (404).json ({status: "Error", msg: `Product with ID ${pid} couldn't be found`});

        res.status (200).json({status: "Success", product});
        
    } catch (error) {
        console.log(error);
        res.status (500).json({status: "Error", msg: "Internal server error"});
    }
});

router.delete ("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productDao.deleteOne (pid);
        if (!product) return res.status (404).json ({status: "Error", msg: `Product with ID ${pid} couldn't be found`});

        res.status (200).json({status: "Success", msg: `Product with ID ${pid} has been deleted`});
        
    } catch (error) {
        console.log(error);
        res.status (500).json({status: "Error", msg: "Internal server error"});
    }
});

router.post ("/", checkProductData, async (req, res) => {
    try {
        const productData = req.body;
        const product = await productDao.create (productData);
        

        res.status (201).json({status: "Success", product});
        
    } catch (error) {
        console.log(error);
        res.status (500).json({status: "Error", msg: "Internal server error"});
    }
});



export default router;