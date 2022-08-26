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
import testXML from '@/bpmn/constant/testXML';
import DefaultEmptyXML from '@/bpmn/constant/emptyXML';

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
  const [xmlStr, setXmlStr] = useState<string>(testXML.xml);
  const [processId, setProcessId] = useState<string>();
  // redux
  const bpmnPrefix = useAppSelector((state) => state.bpmn.prefix);
  const dispatch = useAppDispatch();

  /**
   * 初始化建模器
   */
  useEffect(() => {
    initBpmnModeler();
    // todo 考虑将解析流程信息放在这一步，抽取一个方法解析xml并设置流程信息
  }, [bpmnPrefix]);

  /**
   * 导入 xml，并添加监听器
   * 1、监听面板变化，有变化时立即更新到 xml 中；
   * 2、如果 bpmnModeler 还未初始化，不能导入流程图；
   */
  useEffect(() => {
    if (bpmnModeler) {
      (async () => {
        // await createBpmnDiagram();
        await createBpmnDiagram(xmlStr);
        addPropertiesListener();
      })();
    }
  }, [bpmnModeler]);

  /**
   * 初始化建模器
   */
  function initBpmnModeler() {
    setBpmnModeler(
      new BpmnModeler({
        container: '#canvas',
        height: '96.5vh',
        additionalModules: getAdditionalModules(),
        moddleExtensions: getModdleExtensions(),
      }),
    );
    console.log('初始化建模器完成...');
  }

  function getAdditionalModules() {
    const modules: Array<any> = [];

    // 添加解析器
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

  function getModdleExtensions() {
    const extensions: any = {};

    // 添加解析文件
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
   * 绘制流程图
   * 1、调用 modeler 的 importXML 方法，将 xml 字符串转为图像；
   * @param xml
   */
  function createBpmnDiagram(xml?: string) {
    console.log('createBpmnDiagram执行了1次...');
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
      console.error('流程图绘制出错：createBpmnDiagram => ' + e);
    }
    console.log('绘制流程图完成...');
  }

  /**
   * 监听面板属性变化
   */
  function addPropertiesListener() {
    bpmnModeler?.on('commandStack.changed', async () => {
      // 你可以尝试在这里执行一些操作
    });
    console.log('添加监听面板属性变化完成...');
  }

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
            {'打开'}
          </Button>
          <TextViewer modeler={bpmnModeler} />
          <Button
            type="primary"
            size={'small'}
            icon={<FolderOpenOutlined />}
            onClick={() => createBpmnDiagram()}
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
        <Col span={1}>{/*快捷工具栏*/}</Col>
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
          <PropertyPanel modeler={bpmnModeler} processId={processId} />
        </Col>
      </Row>
    </>
  );
}