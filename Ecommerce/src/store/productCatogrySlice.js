import { createSlice} from '@reduxjs/toolkit'


const productCatogrySlice = createSlice({
    name:'productCategory',
    initialState:[],
    reducers: {
        addInitialProductCategory: (state, action) => {
            
            return action.payload;
          
        }
        
    }
})

export const productCatogryActions = productCatogrySlice.actions;

export default productCatogrySlice;