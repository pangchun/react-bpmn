import React, { useEffect } from 'react';
import { Form, Input } from 'antd';

const { TextArea } = Input;

interface IProps {
  businessObject: any;
}

export default function ElementOtherInfo(props: IProps) {
  // props属性
  const { businessObject } = props;
  // form表单属性
  const [form] = Form.useForm<{
    documentation: string;
  }>();

  useEffect(() => {
    initPageData();
  }, [businessObject?.id]);

  function initPageData() {
    form.setFieldsValue({
      documentation: businessObject?.documentation?.at(0).text,
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
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
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
    </>
  );
}
