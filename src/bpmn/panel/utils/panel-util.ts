// ts: 属性面板通用方法

import { FLOWABLE_PREFIX } from '@/bpmn/constant/moddle-constant';

export async function getXml(modeler: any) {
  let result = await modeler.saveXML({ format: true });
  return result.xml;
}

/**
 * 生成唯一id
 * @param prefix
 * @param length
 * @constructor
 */
export function IdGenerator(prefix: string, length: number = 8) {
  let id: string = prefix ? prefix + '-' : '';
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = length; i > 0; --i) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

/**
 * 更新扩展元素属性
 * @param element
 * @param extensionList
 */
export function updateElementExtensions(
  element: any,
  extensionList: Array<any>,
) {
  const extensions = window.bpmnInstance?.moddle?.create(
    'bpmn:ExtensionElements',
    {
      values: extensionList,
    },
  );
  window.bpmnInstance?.modeling?.updateProperties(element, {
    extensionElements: extensions,
  });
}

/**
 * 提取扩展元素，指定类型为非suffix类型
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

export function createProperty(options: any) {
  const { name, value } = options;
  return window.bpmnInstance.moddle?.create(`${FLOWABLE_PREFIX}:Property`, {
    name,
    value,
  });
}

export function createProperties(options: any) {
  const { properties } = options;
  debugger;
  return window.bpmnInstance.moddle?.create(`${FLOWABLE_PREFIX}:Properties`, {
    values: properties,
  });
}
