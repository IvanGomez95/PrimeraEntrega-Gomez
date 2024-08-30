import productsServices from "../services/products.services.js"

const getAllProducts = async (req, res) => {
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
            const products = await productsServices.getAllProducts({ category }, options);
            return res.status (200).json({status: "Success", products});
        }

        if (status) {
            const products = await productsServices.getAllProducts({ status }, options);
            return res.status (200).json({status: "Success", products});
        }

        const products = await productsServices.getAllProducts({}, options);
        res.status (200).json({status: "Success", products});

    } catch (error) {
        console.log(error);
        res.status (500).json({status: "Error", msg: "Internal server error"});
    }
};

const getProductById = async (req, res) => {

    res.status (200).json({status: "Success", product: req.product});

};

const updateProduct = async (req, res) => {
    try {
        const productData = req.body;
        const updatedProduct = await productsServices.updateProduct(req.params.pid, productData);
        res.status(200).json({ status: "Success", product: updatedProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Internal server error" });
    }
};

const deleteProduct = async (req, res) => {

    try {
        await productsServices.deleteProduct(req.params.pid);
        res.status(200).json({ status: "Success", msg: `Product with ID ${req.params.pid} has been deleted` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Internal server error" });
    }
};

const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        const product = await productsServices.createProduct (productData);
        

        res.status (201).json({status: "Success", product});
        
    } catch (error) {
        console.log(error);
        res.status (500).json({status: "Error", msg: "Internal server error"});
    }
};

export default {
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    createProduct,
};