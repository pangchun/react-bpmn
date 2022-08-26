import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FLOWABLE_PREFIX } from '@/bpmn/constant/constants';

// 为切片状态定义一个类型
export interface BpmnState {
  prefix: string;
}

// 使用该类型定义初始状态
const initialState: BpmnState = {
  // 流程引擎前缀，默认flowable
  prefix: FLOWABLE_PREFIX,
};

/**
 * 创建 redux 分片
 * 导出 action 和 reducer
 */
export const bpmnSlice = createSlice({
  name: 'bpmn',
  initialState,
  reducers: {
    handlePrefix: (state, action: PayloadAction<string>) => {
      state.prefix = action.payload;
    },
  },
});

export const { handlePrefix } = bpmnSlice.actions;

export default bpmnSlice.reducer;
