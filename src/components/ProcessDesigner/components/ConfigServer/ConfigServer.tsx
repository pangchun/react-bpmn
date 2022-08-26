import React, { useEffect, useState } from 'react';
import { Button, Drawer, Form, message, Radio, Space } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import {
  ACTIVITI_PREFIX,
  CAMUNDA_PREFIX,
  FLOWABLE_PREFIX,
} from '@/bpmn/constant/constants';
import { useAppDispatch, useAppSelector } from '@/redux/hook/hooks';
import { handlePrefix } from '@/redux/slice/bpmnSlice';

interface IProps {}

/**
 * 配置中心
 * @param props
 * @constructor
 */
export default function ConfigServer(props: IProps) {
  // state
  const [visible, setVisible] = useState(false);
  // redux
  const bpmnPrefix = useAppSelector((state) => state.bpmn.prefix);
  const dispatch = useAppDispatch();
  // form
  const [form] = Form.useForm<{
    engineType: string;
  }>();

  useEffect(() => {
    form.setFieldsValue({
      engineType: 'flowable',
    });
  }, []);

  function showDrawer() {
    setVisible(true);
  }

  function onClose() {
    setVisible(false);
  }

  function changeEngineType(value: string) {
    dispatch(handlePrefix(value));
    message.info('流程引擎已切换为 ' + value).then((r) => {});
  }

  return (
    <>
      <Button
        type="primary"
        size={'small'}
        icon={<SettingOutlined />}
        onClick={showDrawer}
      >
        {'配置编辑器'}
      </Button>
      <Drawer
        title="Basic Drawer"
        placement={'left'}
        closable={false}
        onClose={onClose}
        visible={visible}
        key={'left'}
        forceRender={true}
        destroyOnClose
        extra={
          <Space>
            <Button onClick={onClose}>收起</Button>
          </Space>
        }
      >
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} form={form}>
          <Form.Item label="流程引擎" name="engineType">
            <Radio.Group onChange={(e) => changeEngineType(e.target.value)}>
              <Radio.Button
                value={`${CAMUNDA_PREFIX}`}
              >{`${CAMUNDA_PREFIX}`}</Radio.Button>
              <Radio.Button
                value={`${FLOWABLE_PREFIX}`}
              >{`${FLOWABLE_PREFIX}`}</Radio.Button>
              <Radio.Button
                value={`${ACTIVITI_PREFIX}`}
              >{`${ACTIVITI_PREFIX}`}</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
