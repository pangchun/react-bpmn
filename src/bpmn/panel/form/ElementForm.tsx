import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Select, Space, Table, Typography } from 'antd';
import { Collapse } from 'antd';
import { PlusOutlined, PushpinTwoTone } from '@ant-design/icons';
import EditFormField from '@/bpmn/panel/form/edit/EditFormField';

const { Panel } = Collapse;

interface IProps {
  businessObject: any;
}

export default function ElementForm(props: IProps) {
  // props属性
  const { businessObject } = props;

  // setState属性
  const [rows, setRows] = useState<Array<any>>([]);

  // ref
  const editFormFieldRef = useRef<any>();

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
      formKey: undefined,
      businessKey: undefined,
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

  const columns = [
    {
      title: '序号',
      width: 40,
      dataIndex: 'key',
      key: 'key',
      render: (text: any) => <a>{text}</a>,
    },
    {
      title: '字段名称',
      width: 80,
      dataIndex: 'eventType',
      key: 'eventType',
      ellipsis: true,
    },
    {
      title: '字段类型',
      width: 80,
      dataIndex: 'eventId',
      key: 'eventId',
      ellipsis: true,
    },
    {
      title: '默认值',
      width: 80,
      dataIndex: 'listenerType',
      key: 'listenerType',
      ellipsis: true,
    },
    {
      title: '操作',
      width: 90,
      key: 'action',
      render: (text: string, record: any) => (
        <Space size="small">
          <Button
            type="text"
            size={'small'}
            style={{ color: '#1890ff' }}
            onClick={() => {
              editFormFieldRef.current.showEditDrawer(record);
            }}
          >
            {'编辑'}
          </Button>
          <Button
            danger
            type="text"
            size={'small'}
            // onClick={() => remove(record.key)}
          >
            {'删除'}
          </Button>
        </Space>
      ),
    },
  ];

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
          <Typography.Paragraph
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: '1rem',
            }}
          >
            {
              '-------------------------------- 表单字段 --------------------------------'
            }
          </Typography.Paragraph>
          <Table
            columns={columns}
            dataSource={rows}
            pagination={false}
            bordered
            size={'small'}
          />
          <Button
            type="primary"
            // size={"small"}
            style={{
              width: '100%',
              marginTop: 8,
            }}
            onClick={() => {
              editFormFieldRef.current.showEditDrawer();
            }}
          >
            <PlusOutlined />
            <span style={{ marginLeft: 0 }}>添加属性</span>
          </Button>
        </Panel>
      </Collapse>
      <EditFormField
        onRef={editFormFieldRef}
        reFreshParent={() => {
          console.log('111');
        }}
      />
    </>
  );
}
