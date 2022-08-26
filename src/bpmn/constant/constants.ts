/**
 * 流程类型
 */
export const PROCESS_TYPE = {
  flowable: 'flowable',
  activiti: 'activiti',
  camunda: 'camunda',
};

/**
 * 流程前缀
 */
export const FLOWABLE_PREFIX: string = PROCESS_TYPE.flowable;
export const ACTIVITI_PREFIX: string = PROCESS_TYPE.activiti;
export const CAMUNDA_PREFIX: string = PROCESS_TYPE.camunda;

/**
 * 流程类型对应命名空间
 */
export const TYPE_TARGET = {
  activiti: 'http://activiti.org/bpmn',
  camunda: 'http://bpmn.io/schema/bpmn',
  flowable: 'http://flowable.org/bpmn',
};
