import React, { useEffect } from 'react';
import { Form, Input, Typography } from 'antd';
import { Collapse } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';

const { Panel } = Collapse;

const { TextArea } = Input;

interface IProps {
  element: any;
  modeling: any;
  bpmnFactory: any;
}

export default function ElementOtherInfo(props: IProps) {
  // props属性
  const { element, modeling, bpmnFactory } = props;

  // 其它属性
  const [form] = Form.useForm<{
    documentation: string;
  }>();

  useEffect(() => {
    initPageData();
  }, [element]);

  function initPageData() {
    // todo 处理空时的默认值
    if (!element?.businessObject?.documentation) {
      return;
    }
    form.setFieldsValue({
      documentation: element.businessObject.documentation.at(0).text || '',
    });
  }

  function updateDocumentation(value: string) {
    const documentation = bpmnFactory?.create('bpmn:Documentation', {
      text: value,
    });
    modeling.updateProperties(element, {
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
