import fs from "fs";

let carts = [];
const pathFile = "./src/data/carts.json";

const getCarts = async () => {
  const cartsJson = await fs.promises.readFile(pathFile, "utf-8");
  const cartsPars = JSON.parse(cartsJson);
  carts = cartsPars || [];
};

const createCart = async () => {
  await getCarts();
  const newCart = {
    id: carts.length + 1,
    products: [],
  };

  carts.push(newCart);

  await fs.promises.writeFile(pathFile, JSON.stringify(carts));
  return newCart;
};

const getCartById = async (cid) => {
  
  await getCarts();
  const cart = carts.find((c) => c.id === cid);
  return cart;
};

//Función que agrega productos al carrito. Chequea si el producto ya se encuentra en el carrito y, si se encuentra, se suma cantidad+1. Si no se encuentra el producto, lo suma.
const addProductToCart = async (cid, pid) => {
  await getCarts();
  const product = {
    product: pid,
    quantity: 1,
  };
  
  const index = carts.findIndex((cart) => cart.id === cid);
  const existingProductIndex = carts[index].products.findIndex(item => item.product === pid);
  
  if (existingProductIndex !== -1) {
   
    carts[index].products[existingProductIndex].quantity++;
  } else {
  
    carts[index].products.push(product);
  }

  await fs.promises.writeFile(pathFile, JSON.stringify(carts));
  
  return carts[index];
};

//Esta función elimina todos los productos que se han ido agregando al carrito. No elimina el carrito, sólo los productos dentro del mismo.
const deleteAllProducts = async (cid) => {
  await getCarts();
  
  const index = carts.findIndex((cart) => cart.id === cid);
  
  if (index !== -1) {
    carts[index].products = [];
    
    await fs.promises.writeFile(pathFile, JSON.stringify(carts));
    return { success: true, msg: "Todos los productos han sido eliminados" };
  } else {
    return { success: false, msg: "Carrito no encontrado" };
  }
};



export default {
  getCarts,
  getCartById,
  addProductToCart,
  createCart,
  deleteAllProducts,
};