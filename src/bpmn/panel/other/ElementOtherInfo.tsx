import React, { useEffect } from 'react';
import { Form, Input, Typography } from 'antd';
import { Collapse } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';

const { Panel } = Collapse;

const { TextArea } = Input;

interface IProps {
  businessObject: any;
}

export default function ElementOtherInfo(props: IProps) {
  // props属性
  const { businessObject } = props;

  // 其它属性
  const [form] = Form.useForm<{
    documentation: string;
  }>();

  /**
   * 只监听id的原因：
   * 1、只有切换当前节点才重新执行初始化操作
   * 2、当前节点属性变化时，不需要重新初始化操作
   * 3、因为每个节点的id是必不相同的，所以可以用作依赖项
   */
  useEffect(() => {
    initPageData();
  }, [businessObject?.id]);

  function initPageData() {
    // todo 首次调用 resetFields 报错 Instance created by `useForm` is not connected to any Form element. Forget to pass `form` prop? 目前尚未找到解决办法，后面再处理
    form.resetFields();
    if (!businessObject?.documentation) {
      return;
    }
    form.setFieldsValue({
      documentation: businessObject.documentation.at(0).text || '',
    });
  }

  function updateDocumentation(value: string) {
    const documentation = window.bpmnInstance.bpmnFactory?.create(
      'bpmn:Documentation',
      {
        text: value,
      },
    );
    window.bpmnInstance.modeling.updateProperties(window.bpmnInstance.element, {
      documentation: value ? [documentation] : undefined,
    });
  }

  return (
    <>
      <Collapse bordered={false} expandIconPosition={'right'}>
        <Panel
          header={
            <Typography style={{ color: '#1890ff', fontWeight: 'bold' }}>
              <QuestionCircleTwoTone />
              &nbsp;其它
            </Typography>
          }
          key="1"
          style={{ backgroundColor: '#FFF' }}
          showArrow={true}
        >
          <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 19 }}>
            <Form.Item label="元素文档" name="documentation">
              <TextArea
                rows={4}
                placeholder={'请输入'}
                onChange={(event) => {
                  updateDocumentation(event.currentTarget.value);
                }}
              />
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>
    </>
  );
}
