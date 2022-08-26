// ts: 属性面板通用方法

import { FLOWABLE_PREFIX } from '@/bpmn/constant/constants';

/**
 * 创建 Property实例
 * @param options
 */
export function createProperty(options: any) {
  const { name, value } = options;
  return window.bpmnInstance.moddle?.create(`${FLOWABLE_PREFIX}:Property`, {
    name,
    value,
  });
}

/**
 * 创建 Properties实例
 * @param options
 */
export function createProperties(options: any) {
  const { properties } = options;
  return window.bpmnInstance.moddle?.create(`${FLOWABLE_PREFIX}:Properties`, {
    values: properties,
  });
}

/**
 * 获取 非suffix类型扩展属性
 * @param suffix
 */
export function extractOtherExtensionList(suffix: string) {
  let extensionElements: any =
    window.bpmnInstance?.element.businessObject.extensionElements;
  let otherExtensionList: any[] =
    extensionElements?.values?.filter((el: any) => {
      return el.$type !== `${FLOWABLE_PREFIX}:${suffix}`;
    }) || [];
  return otherExtensionList;
}

/**
 * 更新 扩展属性
 * @param extensionList
 */
export function updateElementExtensions(extensionList: Array<any>) {
  const extensions = window.bpmnInstance?.moddle?.create(
    'bpmn:ExtensionElements',
    {
      values: extensionList,
    },
  );
  window.bpmnInstance?.modeling?.updateProperties(
    window.bpmnInstance?.element,
    {
      extensionElements: extensions,
    },
  );
}
