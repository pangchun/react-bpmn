import React, { useState } from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

const MESSAGE_CONSTANT: string = 'message';

interface IProps {
  createType: 'message' | 'signal';
  rootElements: any[];
  moddle: any;
  modeling: any;
  reInitRows: () => any;
}

export default function CreateSignalMessage(props: IProps) {
  // props属性
  const { createType, rootElements, moddle, modeling, reInitRows } = props;

  // setState属性
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [id, setId] = useState<string>('');
  const [name, setName] = useState<string>('');

  function showModal(param: any) {
    setIsModalVisible(true);
    // 清除上一次输入
    setId('');
    setName('');
  }

  function handleCancel() {
    setIsModalVisible(false);
  }

  function handleOK() {
    let prefix: string;

    if (createType === MESSAGE_CONSTANT) {
      prefix = 'bpmn:Message';
    } else {
      prefix = 'bpmn:Signal';
    }

    const element = moddle?.create(prefix, {
      id: id,
      name: name,
    });
    rootElements.push(element);

    // push之后，更新父组件的表格行数据
    reInitRows();

    handleCancel();
  }

  function updateId(value: string) {
    setId(value);
  }

  function updateName(value: string) {
    setName(value);
  }

  return (
    <>
      <Button
        type="primary"
        size={'small'}
        style={{
          // width: '100%',
          marginTop: 8,
          float: 'right',
        }}
        onClick={showModal}
      >
        <PlusOutlined />
        <span style={{ marginLeft: 0 }}>
          {createType === MESSAGE_CONSTANT ? '创建新消息' : '创建新信号'}
        </span>
      </Button>

      <Modal
        width={500}
        style={{ maxHeight: '50vh' }}
        title={
          <Typography style={{ color: '#1890ff' }}>
            <EditOutlined />
            &nbsp;
            {createType === MESSAGE_CONSTANT ? '创建新消息' : '创建新信号'}
          </Typography>
        }
        visible={isModalVisible}
        okText={'确认'}
        cancelText={'取消'}
        onOk={handleOK}
        onCancel={handleCancel}
      >
        <Input
          size="middle"
          addonBefore={createType === MESSAGE_CONSTANT ? '消息ID' : '信号ID'}
          placeholder={'请输入'}
          value={id}
          onChange={(event) => {
            updateId(event.currentTarget.value);
          }}
        />
        <Input
          size="middle"
          addonBefore={
            createType === MESSAGE_CONSTANT ? '消息名称' : '信号名称'
          }
          placeholder={'请输入'}
          style={{ marginTop: 4 }}
          value={name}
          onChange={(event) => {
            updateName(event.currentTarget.value);
          }}
        />
      </Modal>
    </>
  );
}
