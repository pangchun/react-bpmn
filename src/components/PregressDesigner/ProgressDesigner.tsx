import { useEffect } from 'react';
import './ProgressDesigner.css';

import BpmnModeler from 'bpmn-js/lib/Modeler';

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from 'bpmn-js-properties-panel';

import camundaModdle from 'camunda-bpmn-moddle/resources/camunda';
import camundaExtensionModule  from 'camunda-bpmn-moddle/lib';

// 以下为bpmn工作流绘图工具的样式
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

import 'bpmn-js-properties-panel/dist/assets/element-templates.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';

// 全局组件
function ProgressDesigner() {

  let bpmnModeler: any = null;

  const xmlstr = '' +
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

  useEffect(() => {
    initBpmn();
  }, [])

  const initBpmn = () => {

    bpmnModeler = new BpmnModeler({
      container: '#canvas', // 这里为数组的第一个元素
      height: '100vh',
      propertiesPanel: {
        parent: '#properties-panel'
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        camundaExtensionModule,
      ],
      moddleExtensions: {
        camunda: camundaModdle,
      }
    });

    createBpmnDiagram();
  }

  const createBpmnDiagram = async () => {
    // 开始绘制出事bpmn的图
    try {
      const result = await bpmnModeler?.importXML(xmlstr);
      console.log(result);
    } catch(error) {
      console.error(error)
    }
  }

  return (
    <div className="App">
      {/* bpmn容器 */}
      <div id="canvas" className="container"/>
      <div id="properties-panel" className="properties-panel"/>
    </div>
  );
}

export default ProgressDesigner;
