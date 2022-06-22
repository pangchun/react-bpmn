import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  Form,
  Input,
  message,
  Space,
  Switch,
  Typography,
} from 'antd';
import { Collapse } from 'antd';
import { PushpinTwoTone } from '@ant-design/icons';
import { useInterval } from 'ahooks';
import { useWatch } from 'antd/es/form/Form';
import UserTask from '@/bpmn/panel/task/task-components/UserTask';
import ReceiveTask from '@/bpmn/panel/task/task-components/ReceiveTask';
import ScriptTask from '@/bpmn/panel/task/task-components/ScriptTask';

const { Panel } = Collapse;

interface IProps {
  businessObject: any;
}

export default function ElementTask(props: IProps) {
  // props属性
  const { businessObject } = props;

  // 其它属性
  const [form] = Form.useForm<{
    asyncBefore: boolean;
    asyncAfter: boolean;
    exclusive: boolean;
  }>();

  // 字段监听
  const asyncBefore = Form.useWatch('asyncBefore', form);
  const asyncAfter = Form.useWatch('asyncAfter', form);

  useEffect(() => {
    initPageData();
  }, [businessObject?.id]);

  function initPageData() {
    form.setFieldsValue({
      asyncBefore: businessObject?.asyncBefore || false,
      asyncAfter: businessObject?.asyncAfter || false,
      exclusive: businessObject?.exclusive || false,
    });
  }

  function updateTaskAsync() {
    console.log(form.getFieldsValue());
    let asyncBefore: boolean = form.getFieldValue('asyncBefore');
    let asyncAfter: boolean = form.getFieldValue('asyncAfter');
    let exclusive: boolean = form.getFieldValue('exclusive');
    if (!asyncBefore && !asyncAfter) {
      exclusive = false;
    }
    window.bpmnInstance.modeling.updateProperties(window.bpmnInstance.element, {
      asyncBefore,
      asyncAfter,
      exclusive,
    });
  }

  return (
    <>
      <Collapse bordered={false} expandIconPosition={'right'}>
        <Panel
          header={
            <Typography style={{ color: '#1890ff', fontWeight: 'bold' }}>
              <PushpinTwoTone />
              &nbsp;任务
            </Typography>
          }
          key="1"
          style={{ backgroundColor: '#FFF' }}
          showArrow={true}
        >
          <Form form={form} layout="inline">
            <Form.Item
              label={'异步延续'}
              name="asyncBefore"
              valuePropName="checked"
              style={{ marginLeft: 22, marginBottom: 20 }}
            >
              <Checkbox style={{ marginLeft: 5 }} onChange={updateTaskAsync}>
                异步前
              </Checkbox>
            </Form.Item>
            <Form.Item name="asyncAfter" valuePropName="checked">
              <Checkbox onChange={updateTaskAsync}>异步后</Checkbox>
            </Form.Item>
            {(asyncBefore || asyncAfter) && (
              <Form.Item name="exclusive" valuePropName="checked">
                <Checkbox onChange={updateTaskAsync}>是否排除</Checkbox>
              </Form.Item>
            )}
          </Form>
          {businessObject?.$type === 'bpmn:UserTask' && (
            <UserTask businessObject={businessObject} />
          )}
          {businessObject?.$type === 'bpmn:ReceiveTask' && (
            <ReceiveTask businessObject={businessObject} />
          )}
          {businessObject?.$type === 'bpmn:ScriptTask' && (
            <ScriptTask businessObject={businessObject} />
          )}
        </Panel>
      </Collapse>
    </>
  );
}
