import { configureStore } from "@reduxjs/toolkit";

// Slice Imports
import menuReducer from "@/redux-store/slices/menuSlice";
import uiReducer from "@/redux-store/slices/uiSlice";
export const store = configureStore({
  reducer: {
    menu: menuReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
