import { PROCESS_TYPE, TYPE_TARGET } from '@/bpmn/constant/constants';

/**
 * 新建空流程
 * @param key 流程id
 * @param name 流程名称
 * @param type 流程类型
 */
export default (key: string, name: string, type: string) => {
  let type_target: string;
  if (type === PROCESS_TYPE.activiti) {
    type_target = TYPE_TARGET.activiti;
  } else if (type === PROCESS_TYPE.flowable) {
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
