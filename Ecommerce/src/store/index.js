import {configureStore} from '@reduxjs/toolkit'

import bagSlice from './bagSlice';
import productCatogrySlice from './productCatogrySlice';
import productSubcategorySlice from './productSubcategory';
import userSlice from './userInfoSlice';
import addressSlice from './addressSlice';



const Jijivisha = configureStore({
    reducer: {
       
        bag: bagSlice.reducer,
        productCategory:productCatogrySlice.reducer,
        productSubcategory:productSubcategorySlice.reducer,
        user:userSlice.reducer,
        address:addressSlice.reducer


       
        
    }
})

export default Jijivisha;