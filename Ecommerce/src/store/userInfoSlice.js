import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userId:null
    },
    reducers: {
        updateUser: (state, action) => {

            console.log("store",  action.payload)
            return {...state,...action.payload};
        },
        clearUser: (state) => {
            return {...state, userId: null};
        },
    }
 });

export const UserActions = userSlice.actions;

export default userSlice;