import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 为切片状态定义一个类型
export interface CounterState {
  value: number;
}

// 使用该类型定义初始状态
const initialState: CounterState = {
  value: 0,
};

/**
 * 创建 redux 分片
 * 导出 action 和 reducer
 */
export const counterSliceExample = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } =
  counterSliceExample.actions;

export default counterSliceExample.reducer;
