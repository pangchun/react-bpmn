import React, { useEffect, useState } from 'react';
import { Divider, Space } from 'antd';
import ElementBaseInfo from '@/bpmn/panel/base/ElementBaseInfo';

import ElementOtherInfo from '@/bpmn/panel/other/ElementOtherInfo';
import ExtensionProperties from '@/bpmn/panel/extension-properties/ExtensionProperties';
import SignalMessage from '@/bpmn/panel/signal-message/SignalMessage';
import ElementListener from '@/bpmn/panel/element-listener/ElementListener';
import ElementTask from '@/bpmn/panel/task/ElementTask';
import MultiInstance from '@/bpmn/panel/multi-instance/MultiInstance';
import ElementForm from '@/bpmn/panel/form/ElementForm';

// todo 这个全局声明后面可以抽取到单独的ts文件中
declare global {
  interface Window {
    bpmnInstance: {
      element: any;
      modeler: any;
      modeling: any;
      elementRegistry: any;
      bpmnFactory: any;
      moddle: any;
      rootElements: any[];
    };
  }
}

function initBpmnInstance() {
  window.bpmnInstance = {
    element: null,
    modeler: null,
    modeling: null,
    elementRegistry: null,
    bpmnFactory: null,
    moddle: null,
    rootElements: [],
  };
}

interface IProps {
  modeler: any;
}

export default function CustomPanel(props: IProps) {
  // props属性
  const { modeler } = props;

  // setState属性
  const [element, setElement] = useState<any>();
  const [businessObject, setBusinessObject] = useState<any>();
  const [modeling, setModeling] = useState<any>();
  const [bpmnFactory, setBpmnFactory] = useState<any>();
  const [moddle, setModdel] = useState<any>();
  const [rootElements, setRootElements] = useState([]);

  useEffect(() => {
    initBpmnInstance();
    // 避免初始化，流程图未加载完导致出错
    if (!modeler) {
      return;
    }
    init();
  }, [modeler]);

  function init() {
    // 设置window的bpmnInstance对象属性
    window.bpmnInstance.modeler = modeler;
    window.bpmnInstance.elementRegistry = modeler.get('elementRegistry');
    window.bpmnInstance.modeling = modeler.get('modeling', true);
    window.bpmnInstance.bpmnFactory = modeler.get('bpmnFactory', true);
    window.bpmnInstance.moddle = modeler.get('moddle', true);

    // 获取modeling
    setModeling(modeler.get('modeling', true));
    // 获取bpmnFactory
    setBpmnFactory(modeler.get('bpmnFactory', true));
    // 获取moddle
    setModdel(modeler.get('moddle', true));

    // 设置监听器，监听所有工作就绪后，要做的事
    modeler?.on('import.done', (e: any) => {
      confirmCurrentElement(null);
      // 获取rootElements
      setRootElements(modeler.getDefinitions().rootElements);
      window.bpmnInstance.rootElements = modeler.getDefinitions().rootElements;
    });

    // 设置监听器，监听选中节点变化
    modeler?.on('selection.changed', (e: any) => {
      confirmCurrentElement(e.newSelection[0] || null);
    });

    // 设置监听器，监听当前节点属性变化
    modeler?.on('element.changed', ({ element }: any) => {
      // setState 这一步是成功的，但是这个state没有被子组件响应，原因可能是对象的hash地址相同，react认为state没改变，所以未刷新
      if (
        element &&
        element.id === window.bpmnInstance.element.businessObject.id
      ) {
        confirmCurrentElement(element);
      }
    });
  }

  /**
   * 确认当前选中节点
   * @param element
   */
  function confirmCurrentElement(element: any) {
    // 如果element为空，则设置流程节点为当前节点，否则设置选中节点为当前节点 (点击canvas空白处默认指流程节点)
    if (!element) {
      // todo 目前是通过流程id获取，但是这个id固定不好，后面要修改
      /* todo 获取流程节点可以通过这个方法获取
      function getProcess$1(element) {
        return is$3(element, 'bpmn:Process') ? getBusinessObject(element) : getBusinessObject(element).get('processRef');
      }*/
      let processElement: any = modeler.get('elementRegistry').get('Process_1');
      setElement(processElement);
      window.bpmnInstance.element = processElement;
      setBusinessObject(
        JSON.parse(JSON.stringify(processElement?.businessObject || null)),
      );
      console.log(
        '当前选中的元素为: \n',
        modeler.get('elementRegistry').get('Process_1')?.businessObject,
      );
      return;
    }
    console.log('当前选中的元素为: \n', element?.businessObject);
    window.bpmnInstance.element = element;
    setBusinessObject(JSON.parse(JSON.stringify(element.businessObject)));
    setElement(element);
  }

  function renderSignalMessage() {
    if (element?.type === 'bpmn:Process') {
      return <SignalMessage businessObject={businessObject} />;
    }
  }

  return (
    <>
      <Space direction="vertical" size={0} style={{ display: 'flex' }}>
        <ElementBaseInfo businessObject={businessObject} />
        <CustomDivider />
        <ElementTask businessObject={businessObject} />
        <CustomDivider />
        {renderSignalMessage()}
        <CustomDivider />
        <ElementForm businessObject={businessObject} />
        <MultiInstance businessObject={businessObject} />
        <CustomDivider />
        <ElementListener businessObject={businessObject} isTask={false} />
        <CustomDivider />
        <ElementListener businessObject={businessObject} isTask={true} />
        <CustomDivider />
        <ExtensionProperties businessObject={businessObject} />
        <CustomDivider />
        <ElementOtherInfo businessObject={businessObject} />
        <CustomDivider />
      </Space>
    </>
  );
}

function CustomDivider() {
  return (
    <>
      <Divider type={'horizontal'} style={{ margin: 0 }} />
    </>
  );
}
