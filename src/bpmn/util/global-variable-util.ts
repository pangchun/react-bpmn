// ts: 全局变量定义工具

import { FLOWABLE_PREFIX } from '@/bpmn/constant/moddle-constant';

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
    bpmnPrefix: string;
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
  window.bpmnPrefix = FLOWABLE_PREFIX;
}
