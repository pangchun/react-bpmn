import React, { Ref, useImperativeHandle, useState } from 'react';
import { Drawer, Button } from 'antd';

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

  return (
    <>
      <Drawer
        title="Basic Drawer"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>
  );
}
