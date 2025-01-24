import { createSlice } from '@reduxjs/toolkit';

const bagSlice = createSlice({
  name: 'bag',
  initialState: {
    data: [], // Array to store products with attributes
    totalQuantity: 0,
  },
  reducers: {
    addToBag: (state, action) => {
      console.log(action )
      const newProduct = action.payload.data;
      const quantityToAdd = action.payload.quantity || 1;
      const existingProductIndex = state.data.findIndex(
        (item) => item._id === newProduct._id
      );

      if (existingProductIndex !== -1) {
        state.data[existingProductIndex].quantity += quantityToAdd;
      } else {
        state.data.push({ ...newProduct, quantity: quantityToAdd });
      }

      state.totalQuantity += quantityToAdd;
    },

    removeFromBag: (state, action) => {
      const productIdToRemove = action.payload.productId;
      const existingProductIndex = state.data.findIndex(
        (item) => item._id === productIdToRemove
      );

      if (existingProductIndex !== -1) {
        state.totalQuantity -= state.data[existingProductIndex].quantity;
        state.data.splice(existingProductIndex, 1);
      }
    },

    clearBag: (state) => {
      state.data = [];
      state.totalQuantity = 0;
    },

    increaseQuantity: (state, action) => {
      const productIdToIncrease = action.payload._id;
      const quantityToIncrease = action.payload.quantity || 1;
      const existingProductIndex = state.data.findIndex(
        (item) => item._id === productIdToIncrease
      );

      if (existingProductIndex !== -1) {
        state.data[existingProductIndex].quantity += quantityToIncrease;
        state.totalQuantity += quantityToIncrease;
      }
    },

    decreaseQuantity: (state, action) => {
      const productIdToDecrease = action.payload._id;
      const quantityToDecrease = action.payload.quantity || 1;
      const existingProductIndex = state.data.findIndex(
        (item) => item._id === productIdToDecrease
      );

      if (existingProductIndex !== -1) {
        if (state.data[existingProductIndex].quantity > quantityToDecrease) {
          state.data[existingProductIndex].quantity -= quantityToDecrease;
          state.totalQuantity -= quantityToDecrease;
        } else {
          state.totalQuantity -= state.data[existingProductIndex].quantity;
          state.data.splice(existingProductIndex, 1);
        }
      }
    },

    updateAttributes: (state, action) => {
      const { productId, size, color } = action.payload;
      const existingProductIndex = state.data.findIndex(
        (item) => item._id === productId
      );
    
      if (existingProductIndex !== -1) {
        state.data[existingProductIndex] = {
          ...state.data[existingProductIndex],
          ...(size && { size }),
          ...(color && { color }),
        };
      }
    },
    
  },
});

export const bagActions = bagSlice.actions;
export default bagSlice;
