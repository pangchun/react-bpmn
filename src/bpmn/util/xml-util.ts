// ts: xml操作工具

/**
 * 获取xml
 */
export async function xml() {
  let result = await window.bpmnInstance?.modeler?.saveXML({ format: true });
  return result.xml;
}
