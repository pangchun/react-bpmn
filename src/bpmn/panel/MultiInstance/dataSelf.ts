//tips： 这些数据是从bpmn-js包下的bpmn-js-properties-panel源码中获取的

/**
 * 回路特性类型
 */
export const loop_characteristics_type = {
  parallelMultiInstance: 'parallelMultiInstance',
  sequentialMultiInstance: 'sequentialMultiInstance',
  standardLoop: 'standardLoop',
};

/**
 * 回路特性下拉选
 */
export const loop_characteristics_type_options = [
  {
    name: '并行多重事件',
    value: loop_characteristics_type.parallelMultiInstance,
  },
  {
    name: '时序多重事件',
    value: loop_characteristics_type.sequentialMultiInstance,
  },
  {
    name: '循环事件',
    value: loop_characteristics_type.standardLoop,
  },
  {
    name: '无',
    value: '-1',
  },
];
