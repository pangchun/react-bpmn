//tips： 这些数据是从bpmn-js包下的bpmn-js-properties-panel源码中获取的，搜索FormField与FormDataProps可以查看

// 流转类型
export const flow_type = {
  normalFlow: 'normalFlow',
  defaultFlow: 'defaultFlow',
  conditionalFlow: 'conditionalFlow',
};

// 流转类型下拉项
export const flow_type_options = [
  {
    name: '普通流转路径',
    value: flow_type.normalFlow,
  },
  {
    name: '默认流转路径',
    value: flow_type.defaultFlow,
  },
  {
    name: '条件流转路径',
    value: flow_type.conditionalFlow,
  },
];

// 条件格式
export const condition_type = {
  script: 'script',
  expression: 'expression',
};

// 条件格式下拉项
export const condition_type_options = [
  {
    name: '脚本',
    value: condition_type.script,
  },
  {
    name: '表达式',
    value: condition_type.expression,
  },
];

// 脚本类型
export const script_type = {
  inlineScript: 'inlineScript',
  externalResource: 'externalResource',
};

// 脚本类型下拉项
export const script_type_options = [
  {
    name: '内联脚本',
    value: script_type.inlineScript,
  },
  {
    name: '外部资源',
    value: script_type.externalResource,
  },
];
