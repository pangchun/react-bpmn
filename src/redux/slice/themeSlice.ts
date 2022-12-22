import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ThemeState {
  borderRadius: number;
  // 基础主题色
  colorPrimary: string;
  // 暗夜模式
  darkMode: boolean;
}

const initialState: ThemeState = {
  borderRadius: 6,
  colorPrimary: '#FF33CC',
  darkMode: false,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    handleColorPrimary: (state, action: PayloadAction<string>) => {
      state.colorPrimary = action.payload;
    },
    handleDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
  },
});

export const { handleColorPrimary, handleDarkMode } = themeSlice.actions;

export default themeSlice.reducer;
