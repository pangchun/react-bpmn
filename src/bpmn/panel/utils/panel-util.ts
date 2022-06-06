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
 * 提取扩展元素，指定类型为非suffix类型
 * @param suffix
 * @param businessObject 当前元素的业务镜像
 */
export function extractOtherExtensionList(
  suffix: string,
  businessObject?: any,
) {
  let extensionElements: any =
    businessObject?.extensionElements ||
    window.bpmnInstance?.element.businessObject.extensionElements;
  let otherExtensionList: any[];
  otherExtensionList = extensionElements?.values?.filter((el: any) => {
    return el.$type !== `${FLOWABLE_PREFIX}:${suffix}`;
  });
  return otherExtensionList;
}
