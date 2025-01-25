import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  modalOpen: boolean;
}

const initialState: UIState = {
  modalOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setModalOpen(state, action: PayloadAction<boolean>) {
      state.modalOpen = action.payload;
    },
  },
});

export const { setModalOpen } = uiSlice.actions;
export default uiSlice.reducer;
