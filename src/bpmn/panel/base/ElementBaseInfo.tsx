import React, { useEffect } from 'react';
import { Form, Input, Switch, Typography } from 'antd';
import { Collapse } from 'antd';
import { PushpinTwoTone } from '@ant-design/icons';

const { Panel } = Collapse;

interface IProps {
  element: any;
  modeling: any;
}

export default function ElementBaseInfo(props: IProps) {
  // props属性
  const { element, modeling } = props;

  // 其它属性
  const [form] = Form.useForm<{
    id: string;
    name: string;
    isExecutable: boolean;
    versionTag: string;
  }>();

  useEffect(() => {
    initPageData();
  }, [element]);

  function initPageData() {
    form.setFieldsValue({
      id: element?.businessObject?.id || '',
      name: element?.businessObject?.name || '',
      isExecutable: element?.businessObject?.isExecutable || '',
      versionTag: element?.businessObject?.versionTag || '',
    });
  }

  function updateId(value: string) {
    if (!value) {
      return;
    }
    modeling.updateProperties(element, {
      id: value,
    });
  }

  function updateName(value: string) {
    modeling.updateProperties(element, {
      name: value || undefined,
    });
  }

  function updateVersionTag(value: string) {
    modeling.updateProperties(element, {
      versionTag: value || undefined,
    });
  }

  function updateIsExecutable(value: boolean) {
    modeling.updateProperties(element, {
      isExecutable: value,
    });
  }

  /**
   * 渲染process扩展元素
   */
  function renderProcessExtension() {
    if (element?.type === 'bpmn:Process') {
      return (
        <>
          <Form.Item label="版本标签" name="versionTag">
            <Input
              onChange={(event) => {
                updateVersionTag(event.currentTarget.value);
              }}
            />
          </Form.Item>
          <Form.Item label="可执行" name="isExecutable" valuePropName="checked">
            <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              onChange={(checked) => {
                updateIsExecutable(checked);
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
                readOnly={element?.businessObject?.$type === 'bpmn:Process'}
                onChange={(event) => {
                  updateId(event.currentTarget.value);
                }}
              />
            </Form.Item>
            <Form.Item label="名称" name="name">
              <Input
                onChange={(event) => {
                  updateName(event.currentTarget.value);
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
