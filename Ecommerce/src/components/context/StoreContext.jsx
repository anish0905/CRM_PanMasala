import { createContext, useEffect } from "react";
import { gold_list } from "../../assets/assets";
import { useState } from "react";

export const storeContext = createContext(null);
// apple
const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});

  const addToCartItems = (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  const removeToCartItems = (itemId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId] > 1) {
        updatedCart[itemId] -= 1;
      } else {
        delete updatedCart[itemId];
      }
      return updatedCart;
    });
  };

  const getTotalCartAmount = () => {
    return gold_list.reduce((acc, item) => {
      // Check if the item exists in the cart and its quantity is greater than 0
      if (cartItems[item._id] > 0) {
        acc += item.price * cartItems[item._id]; // Add the item's total cost to the accumulator
      }
      return acc; // Return the accumulated value
    }, 0); // Start the accumulation from 0
  };

  useEffect(() => {
    console.log("cartItems");
  }, [cartItems]);

  const contextValue = {
    gold_list,
    addToCartItems,
    removeToCartItems,
    cartItems,
    setCartItems,
    getTotalCartAmount,
  };

  return (
    <storeContext.Provider value={contextValue}>
      {props.children}
    </storeContext.Provider>
  );
};

export default StoreContextProvider;
