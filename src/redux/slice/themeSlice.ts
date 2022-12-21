import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ThemeState {
  borderRadius: number;
  // 基础主题色
  colorPrimary: string;
}

const initialState: ThemeState = {
  borderRadius: 6,
  colorPrimary: '#FF33CC',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    handleColorPrimary: (state, action: PayloadAction<string>) => {
      state.colorPrimary = action.payload;
    },
  },
});

export const { handleColorPrimary } = themeSlice.actions;

export default themeSlice.reducer;
