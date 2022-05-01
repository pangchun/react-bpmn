import React, { Ref, RefObject, useImperativeHandle, useState } from 'react';
import { Modal, Button, message, Input } from 'antd';

interface IProps {
  onRef: Ref<any>;
  // rowsData: [],
  // currentRow: any,
}
export default function EditProperty(props: IProps) {
  // props属性
  // const { rowsData, currentRow, onRef } = props;
  const { onRef } = props;

  // setState属性
  const [isModalVisible, setIsModalVisible] = useState(false);

  /**
   * 暴露给父组件的方法或变量
   */
  useImperativeHandle(onRef, () => ({
    showEditModal: () => showModal(),
  }));

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCopy = () => {};

  return (
    <>
      <Modal
        width={500}
        style={{ maxHeight: '50vh' }}
        title="编辑属性"
        visible={isModalVisible}
        okText={'确认'}
        cancelText={'取消'}
        onOk={handleCopy}
        onCancel={handleCancel}
      >
        <Input
          size="middle"
          addonBefore={'编号'}
          placeholder="编号"
          // key={businessObject?.id}
          // defaultValue={businessObject?.id}
          // readOnly={businessObject?.$type === 'bpmn:Process'}
          // onPressEnter={(event) => {
          //   updateId(event.currentTarget.value);
          // }}
          // onBlur={(event) => {
          //   updateId(event.currentTarget.value);
          // }}
        />
        <Input
          size="middle"
          addonBefore={'名称'}
          placeholder="名称"
          style={{ marginTop: 4 }}
          // key={businessObject?.name}
          // defaultValue={businessObject?.name}
          // onPressEnter={(event) => {
          //   updateName(event.currentTarget.value);
          // }}
          // onBlur={(event) => {
          //   updateName(event.currentTarget.value);
          // }}
        />
      </Modal>
    </>
  );
}
