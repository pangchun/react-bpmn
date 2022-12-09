import React, { Ref, useImperativeHandle, useState } from 'react';
import { Form, Input, Modal, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { defaultData } from '@/pages/globalTheme';

interface IProps {
  onRef: Ref<any>;
  createOrUpdate: (options: any) => any;
}

/**
 * 编辑扩展属性 组件
 *
 * @param props
 * @constructor
 */
export default function EditProperty(props: IProps) {
  // props
  const { onRef, createOrUpdate } = props;
  // state
  const [isOpen, setIsOpen] = useState(false);
  // form表单
  const [form] = Form.useForm<{
    key: number;
    propertyName: string;
    propertyValue: string;
  }>();

  /**
   * 暴露方法给父组件
   */
  useImperativeHandle(onRef, () => ({
    // 打开弹窗
    showEditModal: (rowObj: any) => showModal(rowObj),
  }));

  /**
   * 打开弹窗，并提前加载表单数据
   *
   * @param rowObj
   */
  function showModal(rowObj: any) {
    form.setFieldsValue({
      key: rowObj?.key || -1,
      propertyName: rowObj?.name,
      propertyValue: rowObj?.value,
    });
    setIsOpen(true);
  }

  /**
   * 关闭弹窗
   */
  function handleCancel() {
    form.resetFields();
    setIsOpen(false);
  }

  /**
   * 提交表单
   */
  function handleOK() {
    form
      .validateFields()
      .then((values) => {
        createOrUpdate({
          rowKey: form.getFieldValue('key'),
          ...values,
        });
        setIsOpen(false);
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
          <Typography style={{ color: defaultData.colorPrimary }}>
            <EditOutlined />
            &nbsp;编辑属性
          </Typography>
        }
        open={isOpen}
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
