// ts: 全局变量定义工具

declare global {
  interface Window {
    // bpmn实例
    bpmnInstance: {
      element: any;
      modeler: any;
      modeling: any;
      elementRegistry: any;
      bpmnFactory: any;
      moddle: any;
      rootElements: any[];
    };
  }
}

/**
 * 初始化bpmn实例,设置默认值
 */
export function initBpmnInstance() {
  console.log('【初始化bpmn实例】1、设置默认值为null');
  window.bpmnInstance = {
    element: null,
    modeler: null,
    modeling: null,
    elementRegistry: null,
    bpmnFactory: null,
    moddle: null,
    rootElements: [],
  };
}
