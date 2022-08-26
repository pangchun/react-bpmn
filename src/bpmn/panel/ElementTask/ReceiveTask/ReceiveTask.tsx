import React, { useEffect, useState } from 'react';
import { Divider, Form, Input, Modal, Select, Space, Typography } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

interface IProps {
  businessObject: any;
}

const defaultOptions = {
  name: '无',
  value: '-1',
};

// 注意：直接在xml中定义消息id全为数字时，会导致无法回显
export default function ReceiveTask(props: IProps) {
  // props属性
  const { businessObject } = props;

  // state属性
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messageRefOptions, setMessageRefOptions] = useState<Array<any>>([
    defaultOptions,
  ]);

  // 其它属性
  const [form] = Form.useForm<{
    messageId: string;
    id: string;
    name: string;
  }>();

  useEffect(() => {
    initPageData();
  }, [businessObject?.id]);

  function initPageData() {
    // 初始化下拉项
    const rootElements: Array<any> =
      window.bpmnInstance?.modeler.getDefinitions().rootElements || [];
    let options: Array<any> = rootElements
      .filter((el) => el.$type === 'bpmn:Message')
      .map((m) => {
        return {
          name: m.name,
          value: m.id,
        };
      });
    setMessageRefOptions([defaultOptions, ...options]);
    // 初始化form初始值
    form.setFieldsValue({
      messageId:
        window.bpmnInstance?.element.businessObject?.messageRef?.id || '-1',
      id: undefined,
      name: undefined,
    });
  }

  function handleOK() {
    form
      .validateFields()
      .then((values) => {
        // 新增消息实例并设置消息实例
        const messageConfig: any = window.bpmnInstance.moddle.create(
          'bpmn:Message',
          { id: values['id'], name: values['name'] },
        );
        window.bpmnInstance.rootElements.push(messageConfig);
        updateReceiveMessage(values['id']);
        // 刷新界面
        initPageData();
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log('表单校验失败: ', info);
      });
  }

  function updateReceiveMessage(messageId: string) {
    if (messageId === '-1') {
      window.bpmnInstance.modeling.updateProperties(
        window.bpmnInstance.element,
        {
          messageRef: undefined,
        },
      );
    } else {
      window.bpmnInstance.modeling.updateProperties(
        window.bpmnInstance.element,
        {
          messageRef: window.bpmnInstance.rootElements
            .filter((el) => el.$type === 'bpmn:Message')
            .find((el) => el.id === messageId),
        },
      );
    }
  }

  function validateId(value: string) {
    // 校验 消息id已存在
    if (messageRefOptions.find((el) => el.value === value)) {
      return {
        status: false,
        message: '消息ID已存在，请重新输入',
      };
    }
    if (value.includes(' ')) {
      return {
        status: false,
        message: '消息ID中不能包含空格',
      };
    }
    return {
      status: true,
    };
  }

  function validateName(value: string) {
    // 校验 消息name已存在
    if (messageRefOptions.find((el) => el.name === value)) {
      return {
        status: false,
        message: '消息名称已存在，请重新输入',
      };
    }
    if (value.includes(' ')) {
      return {
        status: false,
        message: '消息名称中不能包含空格',
      };
    }
    return {
      status: true,
    };
  }

  function CreateNewMessage() {
    return (
      <>
        <Typography.Link
          onClick={() => setIsModalVisible(true)}
          style={{ whiteSpace: 'nowrap' }}
        >
          <PlusOutlined /> {'创建新消息'}
        </Typography.Link>
        <Modal
          width={500}
          style={{ maxHeight: '50vh' }}
          title={
            <Typography style={{ color: '#1890ff' }}>
              <EditOutlined />
              &nbsp;
              {'创建消息实例'}
            </Typography>
          }
          visible={isModalVisible}
          okText={'确认'}
          cancelText={'取消'}
          onOk={handleOK}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
            <Form.Item
              name="id"
              label={'消息ID'}
              rules={[
                { required: true, message: 'ID不能为空哦!' },
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
              label={'消息名称'}
              rules={[
                { required: true, message: '名称不能为空哦!' },
                {
                  validator: (_, value) => {
                    const validateName$1 = validateName(value);
                    return validateName$1.status
                      ? Promise.resolve()
                      : Promise.reject(new Error(validateName$1.message));
                  },
                },
              ]}
            >
              <Input placeholder={'请输入'} />
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }

  return (
    <>
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
        <Form.Item name="messageId" label="消息实例">
          <Select
            placeholder={'请选择'}
            style={{ width: 300 }}
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <Space
                  align="end"
                  direction={'vertical'}
                  style={{ padding: '0 8px 4px' }}
                >
                  <CreateNewMessage />
                </Space>
              </>
            )}
            onChange={(value, option) => updateReceiveMessage(value)}
          >
            {messageRefOptions.map((e) => {
              return (
                <Select.Option key={e.value} value={e.value}>
                  {e.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </>
  );
}
