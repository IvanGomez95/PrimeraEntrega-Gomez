import { cartModel } from "./models/cart.model.js";

const getAll= async () => {
    const cart = await cartModel.find({status: true});
    return cart;
};

const getById= async (id) => {
    const carts = await cartModel.findById(id).populate ("products.product");
    return carts;
};

const create = async () => {
    const cart = await cartModel.create({});
    return cart;
};

const update = async (id, data) => {
    await cartModel.findByIdAndUpdate(id, data, {new: true});
    return cartUpdate;
};

const deleteOne = async (data) => {
    const cart = await cartModel.deleteOne ({_id: id});
    return cart;
};

const addProductToCart = async (cid, pid) => {
    const cart = await cartModel.findById(cid);
   
    const productInCart = cart.products.find((product) => product.product == pid);
    if (productInCart){
        productInCart.quantity++;
    } else {
        cart.products.push({ product: pid, quantity: 1});
    }

    await cart.save();
    return cart;
};


//Esta función se extiende sobre lo que nos enseñó el profe: La función original no chequeaba las cantidades de un producto específico en el array de carrito, sino que eliminaba todo el producto, independientemente de si la cantidad era 1/2/4, etcétera.
const deleteProductInCart = async (cid, pid) => {
    try {
        const cart = await cartModel.findById(cid);

        if (!cart) {
            throw new Error(`No se encontró el carrito con el ID ${cid}`);
        }

        //Esta parte busca el índice del producto en el carrito
        const productIndex = cart.products.findIndex(item => item.product.toString() === pid);

        if (productIndex !== -1) {
            //Si la propiedad "quantity" del producto es mayor a 1, la reduce en 1
            if (cart.products[productIndex].quantity > 1) {
                cart.products[productIndex].quantity--;
            } else {
                //Cuando la propiedad "quantity" llega a 1, si volvemos a sacar el producto, directamente saca al producto del array (ya que no podemos tener 0 de un producto en el array del carrito)
                cart.products.splice(productIndex, 1);
            }

            await cart.save();
        }

        return cart;
    } catch (error) {
        throw new Error(`Error al borrar el producto del carrito: ${error.message}`);
    }
};


//Función para actualizar quantity de un producto en el carrito a través del body
const updateQuantityInCart = async (cid, pid, quantity) => {
    const cart = await cartModel.findById(cid);
    const product = cart.products.find(element => element.product == pid);
    product.quantity = quantity;

    await cart.save();
    return cart;
};

const clearAllProductsInCart = async (cid) => {
    const cart = await cartModel.findById(cid);
    cart.products = []

    await cart.save();
    return cart;
};

export default {
    getAll,
    getById,
    create,
    update,
    deleteOne,
    addProductToCart,
    deleteProductInCart,
    updateQuantityInCart,
    clearAllProductsInCart
};