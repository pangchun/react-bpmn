import React, { useEffect } from 'react';
import { Form, Input, Switch, Typography } from 'antd';
import { Collapse } from 'antd';
import { PushpinTwoTone } from '@ant-design/icons';

const { Panel } = Collapse;

interface IProps {
  businessObject: any;
}

const keyOptions = {
  id: 'id',
  name: 'name',
  isExecutable: 'isExecutable',
  versionTag: 'versionTag',
};

export default function ElementBaseInfo(props: IProps) {
  // props属性
  const { businessObject } = props;

  // 其它属性
  const [form] = Form.useForm<{
    id: string;
    name: string;
    isExecutable: boolean;
    versionTag: string;
  }>();

  useEffect(() => {
    initPageData();
  }, [businessObject?.id]);

  function initPageData() {
    form.setFieldsValue({
      id: businessObject?.id || '',
      name: businessObject?.name || '',
      isExecutable: businessObject?.isExecutable || false,
      versionTag: businessObject?.versionTag || '',
    });
  }

  function updateElementAttr(key: string, value: any) {
    if (key === keyOptions.id) {
      if (!value) {
        return;
      }
      window.bpmnInstance.modeling.updateProperties(
        window.bpmnInstance.element,
        {
          id: value,
          di: { id: `${businessObject[key]}_di` },
        },
      );
      return;
    }
    window.bpmnInstance.modeling.updateProperties(window.bpmnInstance.element, {
      [key]: value || undefined,
    });
  }

  function renderProcessExtension() {
    if (businessObject?.$type === 'bpmn:Process') {
      return (
        <>
          <Form.Item label="版本标签" name="versionTag">
            <Input
              onChange={(event) => {
                updateElementAttr(
                  keyOptions.versionTag,
                  event.currentTarget.value,
                );
              }}
            />
          </Form.Item>
          <Form.Item label="可执行" name="isExecutable" valuePropName="checked">
            <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              onChange={(checked) => {
                updateElementAttr(keyOptions.isExecutable, checked);
              }}
            />
          </Form.Item>
        </>
      );
    }
  }

  return (
    <>
      <Collapse
        bordered={false}
        expandIconPosition={'right'}
        defaultActiveKey={['1']}
      >
        <Panel
          header={
            <Typography style={{ color: '#1890ff', fontWeight: 'bold' }}>
              <PushpinTwoTone />
              &nbsp;常规
            </Typography>
          }
          key="1"
          style={{ backgroundColor: '#FFF' }}
          showArrow={true}
        >
          <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 19 }}>
            <Form.Item
              label="编号"
              name="id"
              rules={[{ required: true, message: '编号不能为空哦!' }]}
            >
              <Input
                readOnly={businessObject?.$type === 'bpmn:Process'}
                onChange={(event) => {
                  updateElementAttr(keyOptions.id, event.currentTarget.value);
                }}
              />
            </Form.Item>
            <Form.Item label="名称" name="name">
              <Input
                onChange={(event) => {
                  updateElementAttr(keyOptions.name, event.currentTarget.value);
                }}
              />
            </Form.Item>
            {renderProcessExtension()}
          </Form>
        </Panel>
      </Collapse>
    </>
  );
}
