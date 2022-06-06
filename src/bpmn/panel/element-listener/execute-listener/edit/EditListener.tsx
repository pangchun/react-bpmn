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
  rowsData: Array<any>;
}

export default function EditListener(props: IProps) {
  // props属性
  const { rowsData, onRef } = props;

  // setState属性
  const [visible, setVisible] = useState(false);

  // 其它属性
  const [form] = Form.useForm<{
    eventType: string;
    listenerType: string;
    javaClass: string;
    expression: string;
    delegateExpression: string;
    scriptType: string;
    scriptFormat: string;
    scriptValue: string;
    resource: string;
  }>();

  const eventType = Form.useWatch('eventType', form);
  const listenerType = Form.useWatch('listenerType', form);
  const scriptType = Form.useWatch('scriptType', form);

  useImperativeHandle(onRef, () => ({
    showEditDrawer: (rowObj: any) => showDrawer(rowObj),
  }));

  function showDrawer(rowObj: any) {
    console.log(rowObj);
    initPageData(rowObj);
    setVisible(true);
  }

  function closeDrawer() {
    setVisible(false);
  }

  function initPageData(rowObj: any) {
    form.setFieldsValue({
      eventType: rowObj?.protoListener?.eventType.value || '',
      listenerType: rowObj?.protoListener?.listenerType.value || '',
      javaClass: rowObj?.protoListener?.class || '',
      expression: rowObj?.protoListener?.expression || '',
      delegateExpression: rowObj?.protoListener?.delegateExpression || '',
      scriptType: rowObj?.protoListener?.scriptType?.value || '',
      scriptFormat: rowObj?.protoListener?.script?.scriptFormat || '',
      scriptValue: rowObj?.protoListener?.script?.value || '',
      resource: rowObj?.protoListener?.script?.resource || '',
    });
  }

  function updateEventType(value: string) {
    // setEventType(value);
  }

  function updateListenerType(value: string) {
    // setListenerType(value);
  }

  function updateScriptType(value: string) {
    // setScriptType(value);
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
        onClose={closeDrawer}
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
