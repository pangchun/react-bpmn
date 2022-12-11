// ts: 属性面板通用方法

/* *************************************** 扩展属性相关 *************************************** */

/**
 * 创建 Property实例
 * @param prefix
 * @param options
 */
export function createProperty(prefix: string, options: any) {
  const { name, value } = options;
  return window.bpmnInstance.moddle?.create(`${prefix}:Property`, {
    name,
    value,
  });
}

/**
 * 创建 Properties实例
 * @param prefix
 * @param options
 */
export function createProperties(prefix: string, options: any) {
  const { properties } = options;
  return window.bpmnInstance.moddle?.create(`${prefix}:Properties`, {
    values: properties,
  });
}

/* *************************************** 监听器相关 *************************************** */

/* *************************************** 通用 *************************************** */

/**
 * 获取 指定suffix类型扩展属性 todo 将这个方法提取出一个查询properties的方法，然后将这个设置为通用方法
 * @param prefix
 * @param suffix
 */
export function extractExtensionList(prefix: string, suffix: string) {
  let extensionElements: any =
    window.bpmnInstance?.element.businessObject.extensionElements;
  // find 方法只会查出满足条件的第一个对象
  let list: any[] =
    extensionElements?.values?.find(
      (e: any) => e.$type === `${prefix}:${suffix}`,
    )?.values || [];
  return list;
}

/**
 * 获取 非suffix类型扩展属性
 * @param prefix
 * @param suffix
 */
export function extractOtherExtensionList(prefix: string, suffix: string) {
  let extensionElements: any =
    window.bpmnInstance?.element.businessObject.extensionElements;
  let list: any[] =
    extensionElements?.values?.filter(
      (el: any) => el.$type !== `${prefix}:${suffix}`,
    ) || [];
  return list;
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
