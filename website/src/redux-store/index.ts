import { configureStore } from "@reduxjs/toolkit";

// Slice Imports
import menuReducer from "@/redux-store/slices/menuSlice";
export const store = configureStore({
  reducer: {
    menu: menuReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
