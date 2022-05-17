import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Form,
  Input,
  message,
  Switch,
  Typography,
} from 'antd';
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

  // setState属性
  const [businessObject, setBusinessObject] = useState<any>();

  // 其它属性
  const [form] = Form.useForm<{
    id: string;
    name: string;
    isExecutable: boolean;
    versionTag: string;
  }>();
  // const nameValue = Form.useWatch('name', form);

  useEffect(() => {
    setBusinessObject(element?.businessObject);
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

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  function updateId(value: string) {
    // 如果新值与旧值相同，则不更新
    const oldValue: string = element?.businessObject?.id || '';
    if (oldValue === value) {
      return;
    }
    modeling.updateProperties(element, {
      id: value,
    });
    message.success('【编号】已修改').then((r) => {});
  }

  function updateName(value: string) {
    if (!value) {
      return;
    }
    modeling.updateProperties(element, {
      name: value,
    });
    message.success('【名称】已修改').then((r) => {});
  }

  function updateVersionTag(value: string) {
    // 如果新值与旧值相同，则不更新
    const oldValue: string = element?.businessObject?.versionTag || '';
    if (oldValue === value) {
      return;
    }
    modeling.updateProperties(element, {
      versionTag: value,
    });
    message.success('【版本标签】已修改').then((r) => {});
  }

  function updateIsExecutable(value: boolean) {
    modeling.updateProperties(element, {
      isExecutable: value,
    });
    message.success('【可执行状态】已切换').then((r) => {});
  }

  /**
   * 渲染process独有元素
   */
  function renderProcessElement() {
    if (element?.type === 'bpmn:Process') {
      return (
        <>
          <Input
            size="small"
            addonBefore={'版本标签'}
            placeholder="版本标签"
            style={{ marginTop: 4 }}
            value={businessObject?.versionTag}
            onPressEnter={(event) => {
              updateVersionTag(event.currentTarget.value);
            }}
            onBlur={(event) => {
              updateVersionTag(event.currentTarget.value);
            }}
            onChange={(event) => {
              setBusinessObject({
                ...businessObject,
                versionTag: event.target.value,
              });
            }}
          />
          <Typography style={{ marginTop: 10 }}>
            可执行&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              checked={businessObject?.isExecutable}
              onChange={(checked) => {
                setBusinessObject({ ...businessObject, isExecutable: checked });
                updateIsExecutable(checked);
              }}
            />
          </Typography>
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
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 17 }}
            // initialValues={{ remember: businessObject?.isExecutable }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            onValuesChange={(changedValues, allValues) => {
              console.log(changedValues);
              console.log(allValues);
            }}
          >
            <Form.Item
              label="编号"
              name="id"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input
                onChange={(event) => {
                  updateId(event.currentTarget.value);
                }}
              />
            </Form.Item>
            <Form.Item
              label="名称"
              name="name"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input
                onChange={(event) => {
                  updateName(event.currentTarget.value);
                }}
              />
            </Form.Item>
            <Form.Item
              label="版本标签"
              name="versionTag"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input
                onChange={(event) => {
                  updateVersionTag(event.currentTarget.value);
                }}
              />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 10, span: 16 }}
            >
              <Checkbox
                onChange={(event) => {
                  updateIsExecutable(event.target.checked);
                }}
              >
                可执行
              </Checkbox>
            </Form.Item>
          </Form>
          <Input
            size="small"
            addonBefore={'编号'}
            placeholder="编号"
            value={businessObject?.id}
            readOnly={businessObject?.$type === 'bpmn:Process'}
            onPressEnter={(event) => {
              updateId(event.currentTarget.value);
            }}
            onBlur={(event) => {
              updateId(event.currentTarget.value);
            }}
            onChange={(event) => {
              setBusinessObject({ ...businessObject, id: event.target.value });
            }}
          />
          <Input
            size="small"
            addonBefore={'名称'}
            placeholder="名称"
            style={{ marginTop: 4 }}
            value={businessObject?.name}
            onPressEnter={(event) => {
              updateName(event.currentTarget.value);
            }}
            onBlur={(event) => {
              updateName(event.currentTarget.value);
            }}
            onChange={(event) => {
              setBusinessObject({
                ...businessObject,
                name: event.target.value,
              });
            }}
          />
          {renderProcessElement()}
        </Panel>
      </Collapse>
    </>
  );
}
