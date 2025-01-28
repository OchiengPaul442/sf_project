import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  modalOpen: boolean;
  contactModalOpen: boolean;
}

const initialState: UIState = {
  modalOpen: false,
  contactModalOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setModalOpen(state, action: PayloadAction<boolean>) {
      state.modalOpen = action.payload;
    },
    setContactModalOpen(state, action: PayloadAction<boolean>) {
      state.contactModalOpen = action.payload;
    },
  },
});

export const { setModalOpen, setContactModalOpen } = uiSlice.actions;
export default uiSlice.reducer;
