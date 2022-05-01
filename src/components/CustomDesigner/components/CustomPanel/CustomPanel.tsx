import React, { useEffect, useState } from 'react';
import { Button, Divider, Input, Space, Typography } from 'antd';
import Title from 'antd/lib/typography/Title';
import ElementBaseInfo from '@/bpmn/panel/base/ElementBaseInfo';

import { Collapse } from 'antd';
import ElementOtherInfo from '@/bpmn/panel/other/ElementOtherInfo';
import ExtensionProperties from '@/bpmn/panel/extension-properties/ExtensionProperties';

const { Panel } = Collapse;

/**
 * 接口检查
 */
interface IProps {
  name?: 'CustomPanel';
  modeler: any;
}

export default function CustomPanel(props: IProps) {
  // props属性
  const { name, modeler } = props;

  // setState属性
  const [element, setElement] = useState<any>();
  const [selectedElements, setSelectedElements] = useState([]);
  const [businessObject, setBusinessObject] = useState<any>();
  const [modeling, setModeling] = useState<any>();
  const [elementRegistry, setElementRegistry] = useState<any>();
  const [processElement, setProcessElement] = useState<any>();
  const [bpmnFactory, setBpmnFactory] = useState<any>();
  const [moddle, setModdel] = useState<any>();

  useEffect(() => {
    // 避免初始化，流程图未加载完导致出错
    if (!modeler) {
      return;
    }
    init();
  }, [modeler]);

  function init() {
    console.log('===============初始化 start=====================');
    // 获取所有节点
    setElementRegistry(modeler.get('elementRegistry'));
    console.log('elementRegistry \n', modeler.get('elementRegistry'));
    // 获取modeling
    setModeling(modeler.get('modeling', true));
    console.log('modeling \n', modeler.get('modeling', true));
    // 获取bpmnFactory
    setBpmnFactory(modeler.get('bpmnFactory', true));
    console.log('bpmnFactory \n', modeler.get('bpmnFactory', true));
    // 获取moddle
    setModdel(modeler.get('moddle', true));
    console.log('moddle \n', modeler.get('moddle', true));
    console.log('===============初始化 end=====================');

    // 设置监听器，监听所有工作就绪后，要做的事
    modeler?.on('import.done', (e: any) => {
      // 获取当前流程信息 todo 目前是通过流程id获取，但是这个id固定不好，后面要修改
      setProcessElement(modeler.get('elementRegistry').get('Process_1'));
      confirmCurrentElement(null);
      console.log(
        'import.done \n',
        modeler.get('elementRegistry').get('Process_1'),
      );
    });

    // 设置监听器，监听选中节点变化
    modeler?.on('selection.changed', (e: any) => {
      setSelectedElements(e.newSelection);
      setElement(e.newSelection[0]);
      confirmCurrentElement(e.newSelection[0] || null);
      console.log('selection.changed \n', e);
    });

    // 设置监听器，监听当前节点属性变化
    modeler?.on('element.changed', (e: any) => {
      console.log('element.changed \n', e);
    });
  }

  /**
   * 确认当前选中节点
   * @param element
   */
  function confirmCurrentElement(element: any) {
    // 如果element为空，则设置流程节点为当前节点，否则设置选中节点为当前节点 (点击canvas空白处默认指流程节点)
    if (!element) {
      setElement(modeler.get('elementRegistry').get('Process_1'));
      return;
    }
    setElement(element);
  }

  return (
    <>
      <Space direction="vertical" size={0} style={{ display: 'flex' }}>
        {/*<Title level={1}>{element?.type || '属性面板'}</Title>*/}
        <ElementBaseInfo element={element} modeling={modeling} />
        <Divider type={'horizontal'} style={{ margin: 0 }} />
        <ExtensionProperties
          element={element}
          modeling={modeling}
          bpmnFactory={bpmnFactory}
        />
        <Divider type={'horizontal'} style={{ margin: 0 }} />
        <ElementOtherInfo
          element={element}
          modeling={modeling}
          bpmnFactory={bpmnFactory}
        />
        <Divider type={'horizontal'} style={{ margin: 0 }} />
      </Space>
    </>
  );
}
