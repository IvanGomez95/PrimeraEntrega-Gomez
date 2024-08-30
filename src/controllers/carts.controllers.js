import cartServices from "../services/cart.services.js";
import ticketServices from "../services/ticket.services.js";

const createCart = async (req, res) => {
    try {
        const cart = await cartServices.createCart();

        res.status (201).json({status: "Success", cart});

    } catch (error) {
        console.log(error);
        res.status (500).json ({status: "Error", msg: "Internal server error"});
    }
};

const getCartById = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartServices.getCartById (cid);
        if (!cart) return res.status (404).json ({status: "Error", msg: `The cart with ID ${cid} does not exist`});

        res.status (200).json({status: "Success", cart});

    } catch (error) {
        console.log(error);
        res.status (500).json ({status: "Error", msg: "Internal server error"});
    }
};

const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cartUpdate = await cartServices.addProductToCart(cid, pid);
        
        res.status (200).json({status: "Success", payload: cartUpdate});

    } catch (error) {
        console.log(error);
        res.status (500).json ({status: "Error", msg: "Internal server error"});
    }
};

const updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cartUpdate = await cartServices.updateProductQuantity(cid, pid, Number(quantity));

        res.status(200).json({ status: "Success", payload: cartUpdate });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Internal server error" });
    }
};

const deleteProductInCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cartUpdate = await cartServices.deleteProductInCart(cid, pid);
        
        res.status(200).json({ status: "Success", payload: cartUpdate });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Internal server error" });
    }
};

const deleteAllProductsInCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartServices.deleteAllProductsInCart (cid);
        if (!cart) return res.status (404).json ({status: "Error", msg: "Cart not found"});

        res.status (200).json({status: "Success", cart});

    } catch (error) {
        console.log(error);
        res.status (500).json ({status: "Error", msg: "Internal server error"});
    }
};


const purchaseCart = async (req = request, res = response) => {
    try {
        const { cid } = req.params;
        const cart = await cartServices.getCartById(cid);
        if (!cart) return res.status (404).json ({status: "Error", msg: `The cart with ID ${cid} does not exist`});

        const total = await cartServices.purchaseCart(cid);
        const ticket = await ticketServices.createTicket(req.user.email, total);

        res.status(200).json({ status: "Success", ticket });
    } catch (error) {
        console.log(error);
        res.status (500).json ({status: "Error", msg: "Internal server error"});
    };
};



export default {
    createCart,
    getCartById,
    addProductToCart,
    updateProductQuantity,
    deleteProductInCart,
    deleteAllProductsInCart,
    purchaseCart,
};