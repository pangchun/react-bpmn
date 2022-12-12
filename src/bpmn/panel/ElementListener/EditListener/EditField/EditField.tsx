import React, { Ref, useImperativeHandle, useState } from 'react';
import { Form, Input, Modal, Select, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { field_type_options } from '@/bpmn/panel/ElementListener/dataSelf';

interface IProps {
  onRef: Ref<any>;
  reFreshParent: (rowsData: any) => any;
}

export default function EditField(props: IProps) {
  // props属性
  const { onRef, reFreshParent } = props;

  // setState属性
  const [open, setOpen] = useState(false);

  // 其它属性
  const [form] = Form.useForm<{
    key: number;
    fieldName: string;
    fieldType: string;
    fieldTypeValue: string;
    fieldValue: string;
  }>();

  useImperativeHandle(onRef, () => ({
    showEditModal: (rowObj: any) => showModal(rowObj),
  }));

  function showModal(rowObj: any) {
    form.setFieldsValue({
      // -1表示当前是新增
      key: rowObj?.key || -1,
      fieldName: rowObj?.fieldName || '',
      fieldType: rowObj?.fieldType || '',
      fieldTypeValue: rowObj?.fieldTypeValue || '',
      fieldValue: rowObj?.fieldValue || '',
    });
    setOpen(true);
  }

  function handleCancel() {
    form.resetFields();
    setOpen(false);
  }

  function handleOK() {
    form
      .validateFields()
      .then((values) => {
        let rowObj: any = Object.create(null);
        rowObj.key = form.getFieldValue('key');
        rowObj.fieldName = values.fieldName;
        rowObj.fieldType = field_type_options.find(
          (el) => el.value === values.fieldTypeValue,
        )?.name;
        rowObj.fieldTypeValue = values.fieldTypeValue;
        rowObj.fieldValue = values.fieldValue;
        // 更新父组件表格数据
        reFreshParent(rowObj);
        setOpen(false);
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
        open={open}
        okText={'确认'}
        cancelText={'取消'}
        onOk={handleOK}
        onCancel={handleCancel}
      >
        <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
          <Form.Item
            label="字段名称"
            name="fieldName"
            rules={[{ required: true, message: '字段名称不能为空哦!' }]}
          >
            <Input placeholder={'请输入'} />
          </Form.Item>
          <Form.Item
            name="fieldTypeValue"
            label="字段类型"
            rules={[{ required: true }]}
          >
            <Select>
              {field_type_options.map((e) => {
                return (
                  <Select.Option key={e.value} value={e.value}>
                    {e.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="字段值"
            name="fieldValue"
            rules={[{ required: true, message: '字段值不能为空哦!' }]}
          >
            <Input placeholder={'请输入'} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
