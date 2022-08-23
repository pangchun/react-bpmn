// 常量池

export const MODDLE_TYPE = {
  flowable: 'flowable',
  activiti: 'activiti',
  camunda: 'camunda',
};

export const FLOWABLE_PREFIX: string = MODDLE_TYPE.flowable;
export const ACTIVITI_PREFIX: string = MODDLE_TYPE.activiti;
export const CAMUNDA_PREFIX: string = MODDLE_TYPE.camunda;

export const TYPE_TARGET = {
  activiti: 'http://activiti.org/bpmn',
  camunda: 'http://bpmn.io/schema/bpmn',
  flowable: 'http://flowable.org/bpmn',
};

/**
 * 导出默认xml字符串
 * @param key 流程id
 * @param name 流程名称
 * @param type 流程类型
 */
export default (key: string, name: string, type: string) => {
  let type_target: string;
  if (type === MODDLE_TYPE.activiti) {
    type_target = TYPE_TARGET.activiti;
  } else if (type === MODDLE_TYPE.flowable) {
    type_target = TYPE_TARGET.flowable;
  } else {
    type_target = TYPE_TARGET.camunda;
  }
  return `
  <?xml version="1.0" encoding="UTF-8"?>
  <bpmn2:definitions
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
    xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
    id="diagram_${key}"
    targetNamespace="${type_target}">
    <bpmn2:process id="${key}" name="${name}" isExecutable="true">
    </bpmn2:process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
      <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${key}">
      </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
  </bpmn2:definitions>`;
};
