import React, { Ref, useImperativeHandle, useState } from 'react';
import { Drawer, Button, Select, Space } from 'antd';
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

  function handleChange(value: string) {
    console.log(`selected ${value}`);
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
        <Space direction={'vertical'}>
          <Space style={{ display: 'flex', justifyContent: 'end' }}>
            事件类型
            <Select
              defaultValue="lucy"
              style={{ width: 350 }}
              onChange={handleChange}
            >
              <Option value="1">Jack</Option>
              <Option value="2">Lucy</Option>
              <Option value="disabled" disabled>
                Disabled
              </Option>
              <Option value="3">yiminghe</Option>
            </Select>
          </Space>
          <Space>
            监听器类型
            <Select
              defaultValue="lucy"
              style={{ width: 350 }}
              onChange={handleChange}
            >
              <Option value="1">Jack</Option>
              <Option value="2">Lucy</Option>
              <Option value="disabled" disabled>
                Disabled
              </Option>
              <Option value="3">yiminghe</Option>
            </Select>
          </Space>
        </Space>
      </Drawer>
    </>
  );
}
