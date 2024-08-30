//*Este DTO oculta la contraseña y el mail y muestra toda la demás información en /current.
export const respUserDto = (user) => {
    return {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
      role: user.role,
      cart: {
        _id: user.cart._id,
        products: user.cart.products,
        __v: user.cart.__v
      }
    };
};