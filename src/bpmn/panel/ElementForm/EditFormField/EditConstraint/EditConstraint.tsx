import React, { Ref, useImperativeHandle, useState } from 'react';
import { Form, Input, Modal, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { defaultData } from '@/pages/globalTheme';
import { useAppSelector } from '@/redux/hook/hooks';

interface IProps {
  onRef: Ref<any>;
  reFreshParent: (rowData: any) => any;
}

/**
 * 编辑约束条件 组件
 *
 * @param props
 * @constructor
 */
export default function EditConstraint(props: IProps) {
  // props
  const { onRef, reFreshParent } = props;
  // state
  const [open, setOpen] = useState(false);
  // redux
  const colorPrimary = useAppSelector((state) => state.theme.colorPrimary);
  // form
  const [form] = Form.useForm<{
    key: number;
    name: string;
    config: string;
  }>();

  // 暴露给父组件的方法
  useImperativeHandle(onRef, () => ({
    // 打开弹窗
    showEditModal: (rowObj: any) => showModal(rowObj),
  }));

  /**
   * 打开弹窗并初始化表单数据
   *
   * @param rowObj
   */
  function showModal(rowObj: any) {
    form.setFieldsValue({
      // -1表示当前是新增
      key: rowObj?.key || -1,
      name: rowObj?.name,
      config: rowObj?.config,
    });
    setOpen(true);
  }

  /**
   * 关闭弹窗并重置表单
   */
  function handleCancel() {
    form.resetFields();
    setOpen(false);
  }

  /**
   * 提交表单
   */
  function handleOK() {
    form
      .validateFields()
      .then((values) => {
        let rowObj: any = Object.create(null);
        rowObj.key = form.getFieldValue('key');
        rowObj.name = values.name;
        rowObj.config = values.config;
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
          <Typography style={{ color: colorPrimary }}>
            {'编辑约束条件'}
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
