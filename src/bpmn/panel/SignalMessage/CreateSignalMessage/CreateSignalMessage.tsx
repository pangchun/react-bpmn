import React, { useState } from 'react';
import { Modal, Button, Input, Typography, Form } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

const MESSAGE_CONSTANT: string = 'message';

interface IProps {
  createType: 'message' | 'signal';
  reInitRows: () => any;
}

export default function CreateSignalMessage(props: IProps) {
  // props属性
  const { createType, reInitRows } = props;

  // setState属性
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 其它属性
  const [form] = Form.useForm<{
    id: string;
    name: string;
  }>();

  function showModal() {
    setIsModalVisible(true);
    form.resetFields();
  }

  function handleCancel() {
    setIsModalVisible(false);
  }

  function handleOK() {
    form
      .validateFields()
      .then((values) => {
        let prefix: string;
        if (createType === MESSAGE_CONSTANT) {
          prefix = 'bpmn:Message';
        } else {
          prefix = 'bpmn:Signal';
        }
        const element = window.bpmnInstance.moddle?.create(prefix, {
          id: values.id,
          name: values.name,
        });
        window.bpmnInstance.rootElements.push(element);
        // push之后，更新父组件的表格行数据
        reInitRows();
        handleCancel();
      })
      .catch((info) => {
        console.log('表单校验失败: ', info);
      });
  }

  return (
    <>
      <Button
        type="primary"
        size={'small'}
        style={{
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
        <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
          <Form.Item
            name="id"
            label={createType === MESSAGE_CONSTANT ? '消息ID' : '信号ID'}
            rules={[{ required: true, message: '编号不能为空哦!' }]}
          >
            <Input placeholder={'请输入'} />
          </Form.Item>
          <Form.Item
            name="name"
            label={createType === MESSAGE_CONSTANT ? '消息名称' : '信号名称'}
            rules={[{ required: true, message: '名称不能为空哦!' }]}
          >
            <Input placeholder={'请输入'} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
