import React, { useState } from 'react';
import { Modal, Button, Input, Typography, Form } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { defaultData } from '@/pages/globalTheme';

const MESSAGE_CONSTANT: string = 'message';

interface IProps {
  createType: 'message' | 'signal';
  initRows: () => any;
}

/**
 * 编辑消息与信号 组件
 *
 * @param props
 * @constructor
 */
export default function CreateSignalMessage(props: IProps) {
  // props
  const { createType, initRows } = props;
  // state
  const [open, setOpen] = useState(false);
  // form
  const [form] = Form.useForm<{
    id: string;
    name: string;
  }>();

  /**
   * 打开弹窗并重置表单
   */
  function showModal() {
    setOpen(true);
    form.resetFields();
  }

  /**
   * 关闭弹窗
   */
  function handleCancel() {
    setOpen(false);
  }

  /**
   * 提交表单,并更新表格
   */
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
        initRows();
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
          // marginTop: 8,
          width: '100%',
        }}
        onClick={showModal}
      >
        <span style={{ marginLeft: 0 }}>
          {createType === MESSAGE_CONSTANT ? '创建消息' : '创建信号'}
        </span>
      </Button>

      <Modal
        width={500}
        style={{ maxHeight: '50vh' }}
        title={
          <Typography style={{ color: defaultData.colorPrimary }}>
            <EditOutlined />
            &nbsp;
            {createType === MESSAGE_CONSTANT ? '编辑消息' : '编辑信号'}
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
