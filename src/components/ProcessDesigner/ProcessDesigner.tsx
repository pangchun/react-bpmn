import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hook/hooks';

// 引入bpmn建模器
import BpmnModeler from 'bpmn-js/lib/Modeler';

// 引入属性解析文件和对应的解析器
import flowableDescriptor from '@/bpmn/descriptor/flowable.json';
import { flowableExtension } from '@/bpmn/moddle/flowable';
import camundaDescriptor from '@/bpmn/descriptor/camunda.json';
import { camundaExtension } from '@/bpmn/moddle/camunda';
import activitiDescriptor from '@/bpmn/descriptor/activiti.json';
import { activitiExtension } from '@/bpmn/moddle/activiti';

// 引入bpmn工作流绘图工具(bpmn-js)样式
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

// 引入属性面板(properties-panel)样式
import 'bpmn-js-properties-panel/dist/assets/element-templates.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';

// 引入流程图文件
import testXml from '@/bpmn/constant/testXml';
import DefaultEmptyXML from '@/bpmn/constant/emptyXml';

// 引入当前组件样式
import { Button, Col, Row, Space } from 'antd';

// 组件引入
import PropertyPanel from '@/components/ProcessDesigner/components/PropertyPanel/PropertyPanel';
import TextViewer from '@/components/ProcessDesigner/components/TextViewer/TextViewer';
import { FolderOpenOutlined } from '@ant-design/icons';
import ConfigServer from '@/components/ProcessDesigner/components/ConfigServer/ConfigServer';

// 常量引入
import {
  ACTIVITI_PREFIX,
  CAMUNDA_PREFIX,
  FLOWABLE_PREFIX,
} from '@/bpmn/constant/constants';

export default function ProcessDesigner() {
  // state属性
  const [bpmnModeler, setBpmnModeler] = useState<any>();
  const [xmlStr, setXmlStr] = useState<string>(testXml.xml);
  const [processId, setProcessId] = useState<string>();
  // redux
  const bpmnPrefix = useAppSelector((state) => state.bpmn.prefix);
  const dispatch = useAppDispatch();

  /**
   * 初始化建模器
   * 1、这一步在绘制流程图之前进行，且随流程前缀改变而改变；
   * 2、因为解析器和解析文件与流程引擎类型(也就是前缀)有关，因此这里依赖的变量是放在redux里的流程前缀名
   */
  useEffect(() => {
    initBpmnModeler();
  }, [bpmnPrefix]);

  /**
   * 初始化建模器
   */
  function initBpmnModeler() {
    console.log(
      '===============================【初始化建模器】1、初始化建模器开始===================================',
    );
    const modeler = new BpmnModeler({
      container: '#canvas',
      height: '96.5vh',
      additionalModules: getAdditionalModules(),
      moddleExtensions: getModdleExtensions(),
    });
    setBpmnModeler(modeler);
    console.log(
      '===============================【初始化建模器】4、初始化建模器结束===================================',
    );
  }

  /**
   * 添加解析器
   */
  function getAdditionalModules() {
    console.log(
      '===============================【初始化建模器】2、添加解析器===================================',
    );
    const modules: Array<any> = [];
    if (bpmnPrefix === FLOWABLE_PREFIX) {
      modules.push(flowableExtension);
    }
    if (bpmnPrefix === CAMUNDA_PREFIX) {
      modules.push(camundaExtension);
    }
    if (bpmnPrefix === ACTIVITI_PREFIX) {
      modules.push(activitiExtension);
    }
    return modules;
  }

  /**
   * 添加解析文件
   */
  function getModdleExtensions() {
    console.log(
      '===============================【初始化建模器】3、添加解析文件===================================',
    );
    const extensions: any = {};
    if (bpmnPrefix === FLOWABLE_PREFIX) {
      extensions.flowable = flowableDescriptor;
    }
    if (bpmnPrefix === CAMUNDA_PREFIX) {
      extensions.camunda = camundaDescriptor;
    }
    if (bpmnPrefix === ACTIVITI_PREFIX) {
      extensions.activiti = activitiDescriptor;
    }
    return extensions;
  }

  /**
   * 绘制流程图，并设置属性面板的监听器
   * 1、建模器初始化完成后，开始绘制流程图，如果需要创建空白的流程图可以使用bpmnModeler.createDiagram()方法，但是这个流程的id是固定的，是bpmn内部默认的xml字符串；
   */
  useEffect(() => {
    if (!bpmnModeler) return;
    (async () => {
      await createBpmnDiagram(xmlStr);
      bindPropertiesListener();
    })();
  }, [bpmnModeler]);

  /**
   * 绘制流程图
   * 1、调用 modeler 的 importXML 方法，将 xml 字符串转为图像；
   *
   * @param xml
   */
  function createBpmnDiagram(xml?: string) {
    console.log('++++++++++++++++++++++++++++++++++++');
    // 定义流程信息
    let definitionsInfo: any = null;
    let processInfo: any = null;
    // 使用xml2js解析xml获取流程对象 todo 这里的xml解析成js的方法要分解拆成多个方法来调用，代码会更清晰，写成工具类
    const parseString = require('xml2js').parseString;
    parseString(xml, function (err: any, result: any) {
      if (result) {
        definitionsInfo = result[`bpmn2:definitions`];
        processInfo = result[`bpmn2:definitions`][`bpmn2:process`][0][`$`];
      }
    });
    console.log(definitionsInfo);
    console.log(processInfo);
    // 设置流程基本信息 todo 要保证id的传递不会改变, 这里用变量传递会导致更改不能穿到子组件
    let newId = processInfo?.id || 'Process_' + new Date().getTime();
    let newName = processInfo?.name || '新建业务流程';
    let newXML = xml ? xml : DefaultEmptyXML(newId, newName, bpmnPrefix);
    // 更新流程id
    setProcessId(newId);
    // 执行importXML方法
    try {
      bpmnModeler?.importXML(newXML);
    } catch (e) {
      console.error('流程图绘制出错：' + e);
    }
    // 获取流程的信息
    setTimeout(() => {
      const canvas = bpmnModeler.get('canvas');
      const rootElement = canvas.getRootElement();
      console.log('Process Id:' + rootElement.id);
      console.log('Process Name:' + rootElement.businessObject.name);
    }, 10);
  }

  /**
   * 属性面板监听器
   * 1、属性面板监听器，当监听到属性面板的属性发生变化，会同步更新到xml字符串中；
   * 2、监听器要等到流程图绘制结束后才能添加；
   */
  function bindPropertiesListener() {
    console.log('-----------------------');
    bpmnModeler?.on('commandStack.changed', async () => {
      // 这里可以执行一些其他操作
    });
  }

  /**
   * 渲染顶部工具栏
   */
  function renderToolBar() {
    return (
      <>
        <Space
          direction={'horizontal'}
          size={1}
          style={{ marginTop: 3, marginBottom: 3 }}
        >
          <Button
            type="primary"
            size={'small'}
            icon={<FolderOpenOutlined />}
            onClick={() => {}}
          >
            {'打开文件'}
          </Button>
          <Button
            type="primary"
            size={'small'}
            icon={<FolderOpenOutlined />}
            onClick={() => {}}
          >
            {'下载文件'}
          </Button>
          <TextViewer modeler={bpmnModeler} />
          <Button
            type="primary"
            size={'small'}
            icon={<FolderOpenOutlined />}
            // onClick={() => createBpmnDiagram()}
          >
            {'重置'}
          </Button>
          <ConfigServer />
        </Space>
      </>
    );
  }

  return (
    <>
      <Row gutter={0}>
        <Col span={1}>
          {/*todo 2022/10/31 快捷工具栏，暂时留空，后面补充功能和界面*/}
        </Col>
        <Col span={17}>
          {renderToolBar()}
          <div
            id="canvas"
            style={{
              backgroundColor: '#fff',
              backgroundImage:
                'linear-gradient(rgba(24,144,255, .5) 1px, transparent 0), linear-gradient(90deg,rgba(24,144,255, .5) 1px, transparent 0)',
              backgroundSize: '20px 20px',
            }}
          />
        </Col>
        <Col
          span={6}
          style={{
            height: '100vh',
            overflowY: 'auto',
            borderLeft: '1px solid #eee',
            boxShadow: '0 0 8px #ccc',
          }}
        >
          {/*<PropertyPanel modeler={bpmnModeler} processId={processId}/>*/}
        </Col>
      </Row>
    </>
  );
}
