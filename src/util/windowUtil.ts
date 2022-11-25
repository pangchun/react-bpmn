// ts: 全局变量定义工具

declare global {
  interface Window {
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

export function initBpmnInstance() {
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
