import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage,
  transforms: [
    encryptTransform({
      secretKey: import.meta.env.VITE_SECRET_KEY,
      // eslint-disable-next-line
      onError: function (error) {
        console.log(error);
        // Handle the error.
      },
    }),
  ],
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: import.meta.env.VITE_NODE_ENV !== "production",
  middleware: [thunk],
});

export const persistor = persistStore(store);
