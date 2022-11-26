// ts: xml操作工具

/**
 * 获取最新的xml
 */
export async function getXml() {
  let result = await window.bpmnInstance?.modeler?.saveXML({ format: true });
  return result.xml;
}

/**
 * xml字符串解析为json字符串
 */
export function xml2json(xmlStr: string) {
  const parseString = require('xml2js').parseString;
  let jsonStr: string = '';
  parseString(xmlStr, function (err: any, result: any) {
    jsonStr = JSON.stringify(result, null, 4);
  });
  return jsonStr;
}
