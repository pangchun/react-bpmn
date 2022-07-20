import React, { useEffect } from 'react';
import { Form, Input, Select, Typography } from 'antd';
import { Collapse } from 'antd';
import { PushpinTwoTone } from '@ant-design/icons';

const { Panel } = Collapse;

interface IProps {
  businessObject: any;
}

export default function ElementForm(props: IProps) {
  // props属性
  const { businessObject } = props;

  // 其它属性
  const [form] = Form.useForm<{
    formKey: string;
    businessKey: string;
  }>();

  // 字段监听
  const asyncBefore = Form.useWatch('asyncBefore', form);
  const asyncAfter = Form.useWatch('asyncAfter', form);

  useEffect(() => {
    initPageData();
  }, [businessObject?.id]);

  function initPageData() {
    form.setFieldsValue({
      formKey: '',
      businessKey: '',
    });
  }

  function updateFormKey(value: any) {
    window.bpmnInstance.modeling.updateProperties(window.bpmnInstance.element, {
      formKey: value,
    });
  }

  function updateBusinessKey(key: any) {
    console.log(key);
  }

  return (
    <>
      <Collapse bordered={false} expandIconPosition={'right'}>
        <Panel
          header={
            <Typography style={{ color: '#1890ff', fontWeight: 'bold' }}>
              <PushpinTwoTone />
              &nbsp;表单
            </Typography>
          }
          key="1"
          style={{ backgroundColor: '#FFF' }}
          showArrow={true}
        >
          <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
            <Form.Item label="表单标识" name="formKey">
              <Input
                placeholder={'请输入'}
                onChange={(event) => {
                  updateFormKey(event.currentTarget.value);
                }}
              />
            </Form.Item>
            <Form.Item name="businessKey" label="业务标识">
              <Select
                placeholder={'请选择'}
                onChange={(value, option) => updateBusinessKey(value)}
              >
                <Select.Option key={'no'} value={'no'}>
                  {'无'}
                </Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>
    </>
  );
}
