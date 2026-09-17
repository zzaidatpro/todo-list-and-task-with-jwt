import { createSlice } from '@reduxjs/toolkit';

const personSlice = createSlice({
  name: 'persons',
  initialState: {
    list: [],
    loading : false,
    error : null,
    
  },
  reducers: {
    setPersons: (state, action) => {
      state.list = action.payload;
    },
    addPersonSeccess : (state,action) => {state.list.push(action.payload);},

   removePersonSuccess: (state, action) => {
      state.list = state.list.filter((p) => p._id !== action.payload); 
    },
    clearPersons: (state) => {
      state.list = [];
    },
  },
});

export const {  setPersons, addPersonSuccess, removePersonSuccess, clearPersons } = personSlice.actions;
export default personSlice.reducer;