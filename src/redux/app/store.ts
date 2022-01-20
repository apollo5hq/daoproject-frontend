import {
  configureStore,
  ThunkAction,
  Action,
  MiddlewareArray,
} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import web3Reducer from "../features/web3/webSlice";
import snackbarReducer from "../features/snackbar/snackbarSlice";

export function makeStore() {
  return configureStore({
    reducer: { web3: web3Reducer, snackbar: snackbarReducer },
    middleware: new MiddlewareArray(thunk),
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type StoreActions = Action<any>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<StoreActions>
>;

export default store;
