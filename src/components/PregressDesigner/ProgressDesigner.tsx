import { useEffect } from 'react';

// 引入bpmn建模器
import BpmnModeler from 'bpmn-js/lib/Modeler';

// 引入属性面板
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
} from 'bpmn-js-properties-panel';

// 引入camunda流程引擎，也是官方默认的
import camundaExtensionModule from 'camunda-bpmn-moddle/lib';
import camundaDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';

// 引入bpmn工作流绘图工具(bpmn-js)样式
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

// 引入属性面板(properties-panel)样式
import 'bpmn-js-properties-panel/dist/assets/element-templates.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';

// 引入magic相关内容
import magicDescriptor from '@/bpmn/descriptors/magic.json';
import magicPropertiesProvider from '@/bpmn/properties-panel/magic';

// 引入当前组件样式
import './ProgressDesigner.css';

/**
 * 流程设计引擎
 * @constructor
 */
export default function ProgressDesigner() {
  let bpmnModeler: any = null;

  let xmlStr =
    '' +
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">\n' +
    '  <bpmn2:process id="Process_1" isExecutable="false">\n' +
    '    <bpmn2:startEvent id="StartEvent_1"/>\n' +
    '  </bpmn2:process>\n' +
    '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n' +
    '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\n' +
    '      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\n' +
    '        <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>\n' +
    '      </bpmndi:BPMNShape>\n' +
    '    </bpmndi:BPMNPlane>\n' +
    '  </bpmndi:BPMNDiagram>\n' +
    '</bpmn2:definitions>';

  /**
   * 初始化建模工具
   */
  useEffect(() => {
    (async () => {
      await initBpmn();
      addPropertiesListener();
    })();
  }, []);

  /**
   * 初始化建模工具
   */
  const initBpmn = () => {
    bpmnModeler = new BpmnModeler({
      container: '#canvas', // 这里为数组的第一个元素
      height: '100vh',
      propertiesPanel: {
        parent: '#properties-panel',
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        CamundaPlatformPropertiesProviderModule,
        camundaExtensionModule,
        magicPropertiesProvider,
      ],
      moddleExtensions: {
        camunda: camundaDescriptor,
        magic: magicDescriptor,
      },
    });

    createBpmnDiagram().then((r) => {
      console.log('流程绘制成功');
    });
  };

  /**
   * 绘制流程图
   * 1、调用 modeler 的 importXML 方法，将 xml 字符串转为图像；
   */
  const createBpmnDiagram = async () => {
    try {
      const result = await bpmnModeler?.importXML(xmlStr);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 监听面板属性变化，实时更新到 xml 字符串中
   * 1、当属性面板值改变时，将改变后的值写入 xml 字符串中；
   */
  const addPropertiesListener = () => {
    bpmnModeler?.on('commandStack.changed', async () => {
      let result = await bpmnModeler.saveXML({ format: true });
      const { xml } = result;
      xmlStr = xml;
      console.log(xmlStr);
    });
  };

  return (
    <div className="App">
      <div id="canvas" className="container" />
      <div id="properties-panel" className="properties-panel" />
      <button
        onClick={() => {
          console.log(xmlStr);
        }}
      >
        打印xml文本
      </button>
    </div>
  );
}
