// ts: 属性面板通用方法

export async function getXml(modeler: any) {
  let result = await modeler.saveXML({ format: true });
  return result.xml;
}
