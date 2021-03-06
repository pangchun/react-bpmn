import React, { useEffect, useState } from 'react';

// 引入bpmn建模器
import BpmnModeler from 'bpmn-js/lib/Modeler';

// 引入属性解析文件和对应的解析器
import flowableDescriptor from '@/bpmn/descriptor/flowable-descriptor.json';
import { flowableExtension } from '@/bpmn/moddle/flowable';

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
import diagramExample from '@/bpmn/resource/diagram-example';

// 引入当前组件样式
import CustomPanel from '@/components/CustomDesigner/components/CustomPanel/CustomPanel';
import { Button, Col, Row, Space } from 'antd';
import { Layout } from 'antd';

const { Header, Footer, Sider, Content } = Layout;
import XmlPreview from '@/components/CustomDesigner/components/XmlPreview/XmlPreview';
import { FolderOpenOutlined } from '@ant-design/icons';

export default function CustomDesigner() {
  // setState属性
  const [bpmnModeler, setBpmnModeler] = useState<any>();
  const [xmlStr, setXmlStr] = useState<string>(diagramExample.xml);

  /**
   * 初始化建模器
   */
  useEffect(() => {
    initBpmnModeler();
  }, []);

  /**
   * 导入 xml，并添加监听器
   * 1、监听面板变化，有变化时立即更新到 xml 中；
   */
  useEffect(() => {
    (async () => {
      await createBpmnDiagram(xmlStr);
      addPropertiesListener();
    })();
  }, [bpmnModeler]);

  /**
   * 初始化建模器
   */
  function initBpmnModeler() {
    setBpmnModeler(
      new BpmnModeler({
        container: '#canvas',
        height: '96.5vh',
        additionalModules: [flowableExtension],
        moddleExtensions: {
          flowable: flowableDescriptor,
        },
      }),
    );
  }

  /**
   * 绘制流程图
   * 1、调用 modeler 的 importXML 方法，将 xml 字符串转为图像；
   * @param xmlString
   */
  function createBpmnDiagram(xmlString: string) {
    try {
      bpmnModeler?.importXML(xmlString);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 监听面板属性变化
   */
  function addPropertiesListener() {
    bpmnModeler?.on('commandStack.changed', async () => {
      // 你可以尝试在这里执行一些操作
    });
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
          <XmlPreview modeler={bpmnModeler} />
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
          <CustomPanel modeler={bpmnModeler} />
        </Col>
      </Row>
    </>
  );
}
