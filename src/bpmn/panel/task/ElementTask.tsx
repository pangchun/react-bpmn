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

const { Panel } = Collapse;

interface IProps {
  businessObject: any;
}

const keyOptions = {
  id: 'id',
  name: 'name',
  isExecutable: 'isExecutable',
  versionTag: 'versionTag',
};

export default function ElementTask(props: IProps) {
  // props属性
  const { businessObject } = props;

  // 其它属性
  const [form] = Form.useForm<{
    asyncBefore: boolean;
    asyncAfter: boolean;
    exclusive: boolean;
  }>();

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

  return (
    <>
      <Collapse
        bordered={false}
        expandIconPosition={'right'}
        defaultActiveKey={['1']}
      >
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
            >
              <Checkbox style={{ marginLeft: 5 }}>异步前</Checkbox>
            </Form.Item>
            <Form.Item name="asyncAfter" valuePropName="checked">
              <Checkbox>异步后</Checkbox>
            </Form.Item>
            {(asyncBefore || asyncAfter) && (
              <Form.Item name="exclusive" valuePropName="checked">
                <Checkbox>是否排除</Checkbox>
              </Form.Item>
            )}
          </Form>
        </Panel>
      </Collapse>
    </>
  );
}
