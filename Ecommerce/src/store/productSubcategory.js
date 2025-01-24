import { createSlice} from '@reduxjs/toolkit'


const productSubcategorySlice = createSlice({
    name:'productSubcategory',
    initialState:[],
    reducers: {
        addInitialProductSubcategory: (state, action) => {
            
            return action.payload;
          
        }
        
    }
})

export const productSubcategoryActions = productSubcategorySlice.actions;

export default productSubcategorySlice;