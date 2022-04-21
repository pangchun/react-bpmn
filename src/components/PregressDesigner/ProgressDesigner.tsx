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

  const xmlstr = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="5.1.2">\n' +
    '<process id="Process_1" isExecutable="false">\n' +
    '    <startEvent id="StartEvent_1y45yut" name="开始">\n' +
    '    <outgoing>SequenceFlow_0h21x7r</outgoing>\n' +
    '    </startEvent>\n' +
    '    <task id="Task_1hcentk">\n' +
    '    <incoming>SequenceFlow_0h21x7r</incoming>\n' +
    '    </task>\n' +
    '    <sequenceFlow id="SequenceFlow_0h21x7r" sourceRef="StartEvent_1y45yut" targetRef="Task_1hcentk" />\n' +
    '</process>\n' +
    '<bpmndi:BPMNDiagram id="BpmnDiagram_1">\n' +
    '    <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1">\n' +
    '    <bpmndi:BPMNShape id="StartEvent_1y45yut_di" bpmnElement="StartEvent_1y45yut">\n' +
    '        <omgdc:Bounds x="152" y="102" width="36" height="36" />\n' +
    '        <bpmndi:BPMNLabel>\n' +
    '        <omgdc:Bounds x="160" y="145" width="22" height="14" />\n' +
    '        </bpmndi:BPMNLabel>\n' +
    '    </bpmndi:BPMNShape>\n' +
    '    <bpmndi:BPMNShape id="Task_1hcentk_di" bpmnElement="Task_1hcentk">\n' +
    '        <omgdc:Bounds x="240" y="80" width="100" height="80" />\n' +
    '    </bpmndi:BPMNShape>\n' +
    '    <bpmndi:BPMNEdge id="SequenceFlow_0h21x7r_di" bpmnElement="SequenceFlow_0h21x7r">\n' +
    '        <omgdi:waypoint x="188" y="120" />\n' +
    '        <omgdi:waypoint x="240" y="120" />\n' +
    '    </bpmndi:BPMNEdge>\n' +
    '    </bpmndi:BPMNPlane>\n' +
    '</bpmndi:BPMNDiagram>\n' +
    '</definitions>';

  useEffect(() => {
    initBpmn();
  }, [])

  const initBpmn = () => {

    bpmnModeler = new BpmnModeler({
      container: '#canvas', // 这里为数组的第一个元素
      height: '100vh',
      propertiesPanel: {
        parent: '#properties'
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        camundaExtensionModule
      ],
      moddleExtensions: {
        camunda: camundaModdle
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
      <div id="properties" className="properties-panel"/>
    </div>
  );
}

export default ProgressDesigner;
