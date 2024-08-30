import cartRepository from "../persistence/mongoDB/cart.repository.js";
import productRepository from "../persistence/mongoDB/product.repository.js";

const createCart = async () => {
    return await cartRepository.create();
};

const getCartById = async (cid) => {
    return await cartRepository.getById(cid);
};

const addProductToCart = async (cid, pid) => {
    return await cartRepository.addProductToCart (cid, pid);

};

const updateProductQuantity = async (cid, pid, quantity) => {
    return await cartRepository.updateQuantityInCart(cid, pid, quantity);
};

const deleteProductInCart = async (cid, pid) => {
    return await await cartRepository.deleteProductInCart(cid, pid);
};

const deleteAllProductsInCart = async (cid) => {
    return await cartRepository.clearAllProductsInCart (cid);
};

const purchaseCart = async (cid) => {
    const cart = await cartRepository.getById(cid);
    let total = 0;
    const productsWithOutStock = [];

    for (const productCart of cart.products) {
        const product = await productRepository.getById(productCart.product);

        if (product.stock >= productCart.quantity) {
            total += product.price * productCart.quantity;
            await productRepository.update(product._id, {stock: product.stock - productCart.quantity})
        } else {
            productsWithOutStock.push(productCart);
        }

        await cartRepository.update(cid, { products: productsWithOutStock });
    }

    return total;
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