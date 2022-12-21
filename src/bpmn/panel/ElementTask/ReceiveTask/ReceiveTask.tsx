import React, { useEffect, useState } from 'react';
import { Divider, Form, Input, Modal, Select, Space, Typography } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { defaultData } from '@/pages/globalTheme';
import { useAppSelector } from '@/redux/hook/hooks';

const defaultOptions = {
  name: '无',
  value: '-1',
};

interface IProps {
  businessObject: any;
}

/**
 * 接收任务 组件
 *
 * @param props
 * @constructor
 */
export default function ReceiveTask(props: IProps) {
  // props
  const { businessObject } = props;
  // state
  const [open, setOpen] = useState(false);
  const [messageRefOptions, setMessageRefOptions] = useState<Array<any>>([
    defaultOptions,
  ]);
  // redux
  const colorPrimary = useAppSelector((state) => state.theme.colorPrimary);
  // form
  const [form] = Form.useForm<{
    messageId: string;
    id: string;
    name: string;
  }>();

  // 初始化
  useEffect(() => {
    if (businessObject) {
      initPageData();
    }
  }, [businessObject?.id]);

  /**
   * 初始化页面数据
   */
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

  /**
   * 提交表单
   */
  function handleOK() {
    form
      .validateFields()
      .then((values) => {
        // 新增消息实例并设置消息实例
        const messageConfig: any = window.bpmnInstance.moddle.create(
          'bpmn:Message',
          { id: values['id'], name: values['name'] },
        );
        window.bpmnInstance?.modeler
          .getDefinitions()
          .rootElements.push(messageConfig);
        updateReceiveMessage(values['id']);
        // 刷新界面
        initPageData();
        setOpen(false);
      })
      .catch((info) => {
        console.log('表单校验失败: ', info);
      });
  }

  /**
   * 更新接收任务组件
   *
   * @param messageId
   */
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
          messageRef: window.bpmnInstance.modeler
            .getDefinitions()
            .rootElements.filter((el: any) => el.$type === 'bpmn:Message')
            .find((el: any) => el.id === messageId),
        },
      );
    }
  }

  /**
   * 弹窗组件
   *
   * @constructor
   */
  function CreateNewMessage() {
    /**
     * 校验id
     *
     * @param value
     */
    function validateId(value: string) {
      if (!value) {
        return {
          status: false,
          message: '请输入消息ID',
        };
      }
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
        message: 'ok',
      };
    }

    return (
      <>
        <Typography.Link
          onClick={() => setOpen(true)}
          style={{ whiteSpace: 'nowrap', color: colorPrimary }}
        >
          <PlusOutlined /> {'创建新消息'}
        </Typography.Link>
        <Modal
          width={500}
          style={{ maxHeight: '50vh' }}
          title={
            <Typography style={{ color: colorPrimary }}>
              {'创建消息实例'}
            </Typography>
          }
          open={open}
          okText={'确认'}
          cancelText={'取消'}
          onOk={handleOK}
          onCancel={() => setOpen(false)}
        >
          <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
            <Form.Item
              name="id"
              label={'消息ID'}
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
              label={'消息名称'}
              required
              rules={[{ required: true, message: '请输入消息名称' }]}
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
