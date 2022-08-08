import React, { Ref, useImperativeHandle, useState } from 'react';
import { Form, Input, Modal, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';

interface IProps {
  onRef: Ref<any>;
  createOrUpdate: (options: any) => any;
}

export default function EditProperty(props: IProps) {
  // props属性
  const { onRef, createOrUpdate } = props;
  // state属性
  const [isModalVisible, setIsModalVisible] = useState(false);
  // form表单属性
  const [form] = Form.useForm<{
    key: number;
    propertyName: string;
    propertyValue: string;
  }>();

  useImperativeHandle(onRef, () => ({
    showEditModal: (rowObj: any) => showModal(rowObj),
  }));

  function showModal(rowObj: any) {
    form.setFieldsValue({
      key: rowObj?.key || -1,
      propertyName: rowObj?.name,
      propertyValue: rowObj?.value,
    });
    setIsModalVisible(true);
  }

  function handleCancel() {
    form.resetFields();
    setIsModalVisible(false);
  }

  function handleOK() {
    form
      .validateFields()
      .then((values) => {
        createOrUpdate({
          rowKey: form.getFieldValue('key'),
          ...values,
        });
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log('表单校验失败: ', info);
      });
  }

  return (
    <>
      <Modal
        width={500}
        style={{ maxHeight: '50vh' }}
        title={
          <Typography style={{ color: '#1890ff' }}>
            <EditOutlined />
            &nbsp;编辑属性
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
            label="属性名"
            name="propertyName"
            rules={[{ required: true, message: '属性名不能为空哦!' }]}
          >
            <Input placeholder={'请输入'} />
          </Form.Item>
          <Form.Item
            label="属性值"
            name="propertyValue"
            rules={[{ required: true, message: '属性值不能为空哦!' }]}
          >
            <Input placeholder={'请输入'} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
