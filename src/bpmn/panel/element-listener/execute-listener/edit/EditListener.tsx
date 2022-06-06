import React, { Ref, useImperativeHandle, useState } from 'react';
import { Drawer, Button, Select, Space, Input, Divider, Form } from 'antd';
import {
  execute_event_type_options,
  listener_event_type,
  listener_event_type_options,
  script_type,
  script_type_options,
} from '@/bpmn/panel/element-listener/data-self';

const { Option } = Select;

interface IProps {
  onRef: Ref<any>;
  otherExtensionList: any[];
  rowsData: Array<any>;
  // 新增时传null，编辑时必传
  currentRow: any;
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export default function EditListener(props: IProps) {
  const [form] = Form.useForm();

  // props属性
  const { rowsData, currentRow, onRef, otherExtensionList } = props;

  // setState属性
  const [visible, setVisible] = useState(false);
  const [eventType, setEventType] = useState<string>('');
  const [listenerType, setListenerType] = useState<string>('');
  const [javaClassName, setJavaClassName] = useState<string>('');
  const [expressionValue, setExpressionValue] = useState<string>('');
  const [
    delegateExpressionValue,
    setDelegateExpressionValue,
  ] = useState<string>('');
  const [scriptType, setScriptType] = useState<string>('');

  /**
   * 暴露给父组件的方法或变量
   */
  useImperativeHandle(onRef, () => ({
    showEditDrawer: () => showDrawer(),
  }));

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  function updateEventType(value: string) {
    setEventType(value);
  }

  function updateListenerType(value: string) {
    setListenerType(value);
  }

  function updateScriptType(value: string) {
    setScriptType(value);
  }

  function renderListenerForm() {
    switch (listenerType) {
      case listener_event_type.class:
        return (
          <Form.Item
            name="javaClass"
            label="Java类"
            rules={[{ required: true }]}
          >
            <Input
              placeholder="请输入"
              onChange={(event) => {
                console.log(event.target.value);
              }}
            />
          </Form.Item>
        );
      case listener_event_type.expression:
        return (
          <Form.Item
            name="expression"
            label="表达式"
            rules={[{ required: true }]}
          >
            <Input
              placeholder="请输入"
              onChange={(event) => {
                console.log(event.target.value);
              }}
            />
          </Form.Item>
        );
      case listener_event_type.delegateExpression:
        return (
          <Form.Item
            name="delegateExpression"
            label="代理表达式"
            rules={[{ required: true }]}
          >
            <Input
              placeholder="请输入"
              onChange={(event) => {
                console.log(event.target.value);
              }}
            />
          </Form.Item>
        );
      case listener_event_type.script:
        return (
          <>
            <Form.Item
              name="scriptFormat"
              label="脚本格式"
              rules={[{ required: true }]}
            >
              <Input
                placeholder="请输入"
                onChange={(event) => {
                  console.log(event.target.value);
                }}
              />
            </Form.Item>
            <Form.Item
              name="scriptType"
              label="脚本类型"
              rules={[{ required: true }]}
            >
              <Select value={scriptType} onChange={updateEventType}>
                {script_type_options.map((e) => {
                  return (
                    <Option key={e.value} value={e.value}>
                      {e.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            {scriptType === script_type.inlineScript && (
              <Form.Item
                name="scriptValue"
                label="脚本内容"
                rules={[{ required: true }]}
              >
                <Input
                  placeholder="请输入"
                  onChange={(event) => {
                    console.log(event.target.value);
                  }}
                />
              </Form.Item>
            )}
            {scriptType === script_type.externalResource && (
              <Form.Item
                name="resource"
                label="资源地址"
                rules={[{ required: true }]}
              >
                <Input
                  placeholder="请输入"
                  onChange={(event) => {
                    console.log(event.target.value);
                  }}
                />
              </Form.Item>
            )}
          </>
        );
    }
  }

  return (
    <>
      <Drawer
        width={495}
        title="属性配置"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} form={form}>
          <Form.Item
            name="eventType"
            label="事件类型"
            rules={[{ required: true }]}
          >
            <Select value={eventType} onChange={updateEventType}>
              {execute_event_type_options.map((e) => {
                return (
                  <Option key={e.value} value={e.value}>
                    {e.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="listenerType"
            label="监听器类型"
            rules={[{ required: true }]}
          >
            <Select value={listenerType} onChange={updateListenerType}>
              {listener_event_type_options.map((e) => {
                return (
                  <Option key={e.value} value={e.value}>
                    {e.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          {renderListenerForm()}
        </Form>
        <Divider />
      </Drawer>
    </>
  );
}
