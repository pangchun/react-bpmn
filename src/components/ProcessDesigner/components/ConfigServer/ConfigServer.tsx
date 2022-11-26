import React, { useEffect, useState } from 'react';
import { Button, Drawer, FloatButton, Form, message, Radio, Space } from 'antd';
import {
  EditOutlined,
  QuestionOutlined,
  SettingOutlined,
} from '@ant-design/icons';
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
  const [open, setOpen] = useState(false);
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
    setOpen(true);
  }

  function onClose() {
    setOpen(false);
  }

  function changeEngineType(value: string) {
    dispatch(handlePrefix(value));
    message.info('流程引擎已切换为 ' + value).then(() => {});
  }

  return (
    <>
      <FloatButton.Group icon={<EditOutlined />} type="primary" trigger="hover">
        <FloatButton icon={<SettingOutlined />} onClick={showDrawer} />
        <FloatButton
          icon={<QuestionOutlined />}
          onClick={() => message.info('暂未开发')}
        />
      </FloatButton.Group>
      <Drawer
        title="Basic Drawer"
        placement={'left'}
        closable={false}
        onClose={onClose}
        open={open}
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
