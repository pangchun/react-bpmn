import React, { Ref, useImperativeHandle, useState } from 'react';
import { Form, Input, Modal, Select, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { field_type_options } from '@/bpmn/panel/element-listener/data-self';

interface IProps {
  onRef: Ref<any>;
  reFreshParent: (rowsData: any) => any;
}

export default function EditConstraint(props: IProps) {
  // props属性
  const { onRef, reFreshParent } = props;

  // setState属性
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 其它属性
  const [form] = Form.useForm<{
    key: number;
    name: string;
    config: string;
  }>();

  useImperativeHandle(onRef, () => ({
    showEditModal: (rowObj: any) => showModal(rowObj),
  }));

  function showModal(rowObj: any) {
    form.setFieldsValue({
      // -1表示当前是新增
      key: rowObj?.key || -1,
      name: rowObj?.name || undefined,
      config: rowObj?.config || undefined,
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
        let rowObj: any = Object.create(null);
        rowObj.key = form.getFieldValue('key');
        rowObj.name = values.name;
        rowObj.config = values.config;
        // 更新父组件表格数据
        console.log(rowObj);
        reFreshParent(rowObj);
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
            label="名称"
            name="name"
            rules={[{ required: true, message: '名称不能为空哦!' }]}
          >
            <Input placeholder={'请输入'} />
          </Form.Item>
          <Form.Item
            label="配置"
            name="config"
            rules={[{ required: true, message: '配置不能为空哦!' }]}
          >
            <Input placeholder={'请输入'} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
