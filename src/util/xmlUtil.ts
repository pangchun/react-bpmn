// ts: xml操作工具

/**
 * 获取xml
 */
export async function xml() {
  let result = await window.bpmnInstance?.modeler?.saveXML({ format: true });
  return result.xml;
}

/**
 * 使用xml2js解析xml获取流程信息
 * todo 后面基本上不大可能用到这个方法，先留着作为xml2js的使用示例
 */
export function xml2string() {
  // 定义流程信息
  let definitionsInfo: any = null;
  let processInfo: any = null;
  // 使用xml2js解析xml获取流程对象
  const parseString = require('xml2js').parseString;
  parseString(xml, function (err: any, result: any) {
    if (result) {
      definitionsInfo = result[`bpmn2:definitions`];
      processInfo = result[`bpmn2:definitions`][`bpmn2:process`][0][`$`];
    }
  });
  console.log(processInfo?.id);
  console.log(processInfo?.name);
}
