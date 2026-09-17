import { configureStore, combineReducers } from "@reduxjs/toolkit";
import taskReducer from "./taskSlice";
import personReducer from "./personSlice";
import authReducer, {logout} from "./authSlice"

const appReducer = combineReducers({
  auth : authReducer,
  tasks : taskReducer,
  persons : personReducer
});

const rootReducer = (state, action) => {
  if (action.type == logout.type) {
    state ={auth : state?.auth};
  } 
  return  appReducer(state,action);
}

export const store = configureStore({
  reducer: rootReducer,
  },
 );
