import productRepository from "../persistence/mongoDB/product.repository.js";

const getAllProducts = async (query, options) => {
    return await productRepository.getAll(query, options);
};


const getProductById = async (pid) => {
    return await productRepository.getById(pid);
};


const updateProduct = async (pid, productData) => {
   return await productRepository.update(pid, productData); 
};


const deleteProduct  = async (pid) => {
    return await productRepository.deleteOne(pid);
};


const createProduct = async (productData) => {
    return await productRepository.create(productData);
};

export default {
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    createProduct,
};