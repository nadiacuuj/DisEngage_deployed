// CartContext.js
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [addedToCart, setAddedToCart] = useState(0);

  return (
    <CartContext.Provider value={{ addedToCart, setAddedToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
