import React, { Ref, useImperativeHandle, useState } from 'react';
import { Drawer, Button, Select, Space, Input } from 'antd';
import {
  EXECUTE_EVENT_TYPE,
  EXECUTE_EVENT_TYPE_OPTIONS,
  LISTENER_EVENT_TYPE,
  LISTENER_EVENT_TYPE_OPTIONS,
} from '@/bpmn/panel/element-listener/data-self';
const { Option } = Select;

interface IProps {
  onRef: Ref<any>;
  otherExtensionList: any[];
  rowsData: Array<any>;
  // 新增时传null，编辑时必传
  currentRow: any;
  moddle: any;
  modeling: any;
  element: any;
}

export default function EditListener(props: IProps) {
  // props属性
  const {
    rowsData,
    currentRow,
    onRef,
    moddle,
    modeling,
    element,
    otherExtensionList,
  } = props;

  // setState属性
  const [visible, setVisible] = useState(false);
  const [eventType, setEventType] = useState<string>('');
  const [listenerType, setListenerType] = useState<string>('');

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

  function renderListenerForm() {
    switch (listenerType) {
      case LISTENER_EVENT_TYPE.class:
        return (
          <>
            <Space style={{ display: 'flex', justifyContent: 'end' }}>
              Java类
              <Input
                placeholder="请输入"
                style={{ width: 350 }}
                // value={businessObject?.id}
                // readOnly={businessObject?.$type === 'bpmn:Process'}
                // onPressEnter={(event) => {
                //   updateId(event.currentTarget.value);
                // }}
                // onBlur={(event) => {
                //   updateId(event.currentTarget.value);
                // }}
                // onChange={(event) => {
                //   setBusinessObject({ ...businessObject, id: event.target.value });
                // }}
              />
            </Space>
          </>
        );
      case LISTENER_EVENT_TYPE.expression:
        return (
          <>
            <Space style={{ display: 'flex', justifyContent: 'end' }}>
              表达式
              <Input
                placeholder="请输入"
                style={{ width: 350 }}
                // value={businessObject?.id}
                // readOnly={businessObject?.$type === 'bpmn:Process'}
                // onPressEnter={(event) => {
                //   updateId(event.currentTarget.value);
                // }}
                // onBlur={(event) => {
                //   updateId(event.currentTarget.value);
                // }}
                // onChange={(event) => {
                //   setBusinessObject({ ...businessObject, id: event.target.value });
                // }}
              />
            </Space>
          </>
        );
      case LISTENER_EVENT_TYPE.delegateExpression:
        return (
          <>
            <Space style={{ display: 'flex', justifyContent: 'end' }}>
              代理表达式
              <Input
                placeholder="请输入"
                style={{ width: 350 }}
                // value={businessObject?.id}
                // readOnly={businessObject?.$type === 'bpmn:Process'}
                // onPressEnter={(event) => {
                //   updateId(event.currentTarget.value);
                // }}
                // onBlur={(event) => {
                //   updateId(event.currentTarget.value);
                // }}
                // onChange={(event) => {
                //   setBusinessObject({ ...businessObject, id: event.target.value });
                // }}
              />
            </Space>
          </>
        );
      case LISTENER_EVENT_TYPE.script:
        return (
          <>
            <Space style={{ display: 'flex', justifyContent: 'end' }}>
              脚本
              <Input
                placeholder="请输入"
                style={{ width: 350 }}
                // value={businessObject?.id}
                // readOnly={businessObject?.$type === 'bpmn:Process'}
                // onPressEnter={(event) => {
                //   updateId(event.currentTarget.value);
                // }}
                // onBlur={(event) => {
                //   updateId(event.currentTarget.value);
                // }}
                // onChange={(event) => {
                //   setBusinessObject({ ...businessObject, id: event.target.value });
                // }}
              />
            </Space>
          </>
        );
    }
  }

  function renderScriptForm() {}

  return (
    <>
      <Drawer
        width={495}
        title="属性配置"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <Space direction={'vertical'}>
          <Space style={{ display: 'flex', justifyContent: 'end' }}>
            事件类型
            <Select
              // defaultValue="lucy"
              value={eventType}
              style={{ width: 350 }}
              onChange={updateEventType}
            >
              {EXECUTE_EVENT_TYPE_OPTIONS.map((e) => {
                return <Option value={e.value}>{e.name}</Option>;
              })}
            </Select>
          </Space>
          <Space>
            监听器类型
            <Select
              value={listenerType}
              style={{ width: 350 }}
              onChange={updateListenerType}
            >
              {LISTENER_EVENT_TYPE_OPTIONS.map((e) => {
                return <Option value={e.value}>{e.name}</Option>;
              })}
            </Select>
          </Space>
          {renderListenerForm()}
        </Space>
      </Drawer>
    </>
  );
}
