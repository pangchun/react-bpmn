import React, { useEffect, useState } from 'react';
import { Button, Input, Space, Switch, Typography } from 'antd';
import Title from 'antd/lib/typography/Title';

const { Text, Link } = Typography;

import { Collapse } from 'antd';
import {
  PaperClipOutlined,
  PushpinTwoTone,
  RightCircleTwoTone,
} from '@ant-design/icons';

const { Panel } = Collapse;

const { TextArea } = Input;

interface IProps {
  element: any;
  modeling: any;
  bpmnFactory: any;
}

export default function ElementOtherInfo(props: IProps) {
  // props属性
  const { element, modeling, bpmnFactory } = props;

  // setState属性
  const [businessObject, setBusinessObject] = useState<any>();

  useEffect(() => {
    setBusinessObject(element?.businessObject);
    console.log('element in other \n', element);
  }, [element]);

  /**
   * 更新 元素文档 todo 如果更新的信息与原信息一样，则不需要进行更新
   */
  function updateDocumentation(value: string) {
    // 创建一个元素文档
    const documentation = bpmnFactory?.create('bpmn:Documentation', {
      text: value,
    });
    return modeling.updateProperties(element, {
      documentation: [documentation],
    });
  }

  return (
    <>
      <Collapse bordered={false} expandIconPosition={'right'}>
        <Panel
          header={
            <Typography style={{ color: '#1890ff' }}>
              <PaperClipOutlined />
              &nbsp;其它
            </Typography>
          }
          key="1"
          style={{ backgroundColor: '#FFF' }}
          showArrow={true}
        >
          <Typography>元素文档:</Typography>
          <TextArea
            rows={4}
            placeholder={'请输入元素文档信息'}
            key={businessObject?.documentation?.at(0).text}
            defaultValue={businessObject?.documentation?.at(0).text || ''}
            onPressEnter={(event) => {
              updateDocumentation(event.currentTarget.value);
            }}
            onBlur={(event) => {
              updateDocumentation(event.currentTarget.value);
            }}
          />
        </Panel>
      </Collapse>
    </>
  );
}
