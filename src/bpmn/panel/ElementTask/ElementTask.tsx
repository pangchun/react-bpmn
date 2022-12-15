import React, { useEffect } from 'react';
import { Checkbox, Form } from 'antd';
import UserTask from '@/bpmn/panel/ElementTask/UserTask/UserTask';
import ReceiveTask from '@/bpmn/panel/ElementTask/ReceiveTask/ReceiveTask';
import ScriptTask from '@/bpmn/panel/ElementTask/ScriptTask/ScriptTask';

interface IProps {
  businessObject: any;
}

/**
 * 任务 组件
 *
 * @param props
 * @constructor
 */
export default function ElementTask(props: IProps) {
  // props
  const { businessObject } = props;
  // form
  const [form] = Form.useForm<{
    asyncBefore: boolean;
    asyncAfter: boolean;
    // 是否排除只有为false才会在xml中体现
    exclusive: boolean;
  }>();
  // 字段监听
  const asyncBefore = Form.useWatch('asyncBefore', form);
  const asyncAfter = Form.useWatch('asyncAfter', form);

  // 初始化
  useEffect(() => {
    if (businessObject) {
      initPageData();
    }
  }, [businessObject?.id]);

  /**
   * 初始化页面数据
   */
  function initPageData() {
    form.setFieldsValue({
      asyncBefore: businessObject?.asyncBefore || false,
      asyncAfter: businessObject?.asyncAfter || false,
      exclusive: businessObject?.exclusive || false,
    });
  }

  /**
   * 更新异步延续
   */
  function updateTaskAsync() {
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
      <Form form={form} layout="inline">
        <Form.Item
          label={'异步延续'}
          name="asyncBefore"
          valuePropName="checked"
          style={{ marginLeft: 19, marginBottom: 20 }}
        >
          <Checkbox style={{ marginLeft: 2 }} onChange={updateTaskAsync}>
            {'异步前'}
          </Checkbox>
        </Form.Item>
        <Form.Item name="asyncAfter" valuePropName="checked">
          <Checkbox onChange={updateTaskAsync}>{'异步后'}</Checkbox>
        </Form.Item>
        {(asyncBefore || asyncAfter) && (
          <Form.Item name="exclusive" valuePropName="checked">
            <Checkbox onChange={updateTaskAsync}>{'是否排除'}</Checkbox>
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
    </>
  );
}
