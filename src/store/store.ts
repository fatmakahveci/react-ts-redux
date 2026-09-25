import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth-slice";
import counterReducer from "./slices/counter-slice";

// A factory keeps mutable Redux state isolated between application instances.
export function makeStore() {
  return configureStore({
    reducer: {
      counter: counterReducer,
      auth: authReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
