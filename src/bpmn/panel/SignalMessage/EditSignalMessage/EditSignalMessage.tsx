import React, { useState } from 'react';
import { Modal, Button, Input, Typography, Form } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { defaultData } from '@/pages/globalTheme';

const MESSAGE_CONSTANT: string = 'message';

interface IProps {
  createType: 'message' | 'signal';
  initRows: () => any;
  rowIds: string[];
}

/**
 * 编辑消息与信号 组件
 *
 * @param props
 * @constructor
 */
export default function EditSignalMessage(props: IProps) {
  // props
  const { createType, initRows, rowIds } = props;
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
   * 校验id
   *
   * @param value
   */
  function validateId(value: string) {
    if (!value) {
      return {
        status: false,
        message: '请输入ID',
      };
    }
    if (rowIds.length > 0 && rowIds.includes(value)) {
      return {
        status: false,
        message: '此编号已经存在，请重新输入',
      };
    }
    if (value.includes(' ')) {
      return {
        status: false,
        message: '编号中不能包含空格',
      };
    }
    return {
      status: true,
      message: 'ok',
    };
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
        window.bpmnInstance.modeler.getDefinitions().rootElements.push(element);
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
            required
            rules={[
              {
                validator: (_, value) => {
                  const validateId$1 = validateId(value);
                  return validateId$1.status
                    ? Promise.resolve()
                    : Promise.reject(new Error(validateId$1.message));
                },
              },
            ]}
          >
            <Input placeholder={'请输入'} />
          </Form.Item>
          <Form.Item
            name="name"
            label={createType === MESSAGE_CONSTANT ? '消息名称' : '信号名称'}
            required
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder={'请输入'} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
