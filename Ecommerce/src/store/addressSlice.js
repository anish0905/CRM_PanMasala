import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
    name: "address",
    initialState: {
        address: null,
    },
    reducers: {
        updateAddress: (state, action) => {
            console.log("updateAddress, state: " + state + ", action: " + action)
            return {...state,...action.payload};
        },
        clearAddress: (state) => {
            return {...state, address: null};
        },
    },
 });


 export const addressActions = addressSlice.actions;
 
 export default addressSlice;