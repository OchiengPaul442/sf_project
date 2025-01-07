import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MenuState {
  isOpen: boolean;
}

const initialState: MenuState = {
  isOpen: false,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    openMenu(state) {
      state.isOpen = true;
    },
    closeMenu(state) {
      state.isOpen = false;
    },
    toggleMenu(state) {
      state.isOpen = !state.isOpen;
    },
    setMenuState(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
  },
});

export const { openMenu, closeMenu, toggleMenu, setMenuState } =
  menuSlice.actions;
export default menuSlice.reducer;
