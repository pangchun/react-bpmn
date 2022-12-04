import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FLOWABLE_PREFIX } from '@/bpmn/constant/constants';

// 定义redux属性的名称和类型
export interface BpmnState {
  // 流程引擎前缀
  prefix: string;
  // 流程id
  processId: string | undefined;
  // 流程名称
  processName: string | undefined;
}

// 定义redux属性的默认值
const initialState: BpmnState = {
  prefix: FLOWABLE_PREFIX,
  processId: undefined,
  processName: undefined,
};

/**
 * 定义修改redux属性的方法
 */
export const bpmnSlice = createSlice({
  name: 'bpmn',
  initialState,
  reducers: {
    handlePrefix: (state, action: PayloadAction<string>) => {
      state.prefix = action.payload;
    },
    handleProcessId: (state, action: PayloadAction<string | undefined>) => {
      state.processId = action.payload || undefined;
    },
    handleProcessName: (state, action: PayloadAction<string | undefined>) => {
      state.processName = action.payload || undefined;
    },
  },
});

export const {
  handlePrefix,
  handleProcessId,
  handleProcessName,
} = bpmnSlice.actions;

export default bpmnSlice.reducer;
