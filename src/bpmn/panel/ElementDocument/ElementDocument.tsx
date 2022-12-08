import React, { useEffect } from 'react';
import { Form, Input } from 'antd';

const { TextArea } = Input;

interface IProps {
  businessObject: any;
}

/**
 * 元素文档 组件
 *
 * @param props
 * @constructor
 */
export default function ElementDocument(props: IProps) {
  // props
  const { businessObject } = props;
  // form
  const [form] = Form.useForm<{
    documentation: string;
  }>();

  /**
   * 初始化
   */
  useEffect(() => {
    if (businessObject) {
      initPageData();
    }
  }, [businessObject?.id]);

  /**
   * 初始化页面数据
   */
  function initPageData() {
    form.setFieldsValue({
      documentation: businessObject?.documentation?.at(0).text,
    });
  }

  /**
   * 更新元素文档
   *
   * @param value
   */
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
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: '100%' }}>
        <Form.Item name="documentation">
          <TextArea
            rows={6}
            placeholder={'请输入'}
            onChange={(event) => {
              updateDocumentation(event.currentTarget.value);
            }}
          />
        </Form.Item>
      </Form>
    </>
  );
}
