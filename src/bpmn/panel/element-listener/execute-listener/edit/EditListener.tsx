import React, { Ref, useImperativeHandle, useRef, useState } from 'react';
import {
  Drawer,
  Button,
  Select,
  Space,
  Input,
  Divider,
  Form,
  Table,
  Typography,
  notification,
} from 'antd';
import {
  encapsulateField,
  execute_event_type_options,
  listener_type,
  listener_type_options,
  script_type,
  script_type_options,
} from '@/bpmn/panel/element-listener/data-self';
import { AppstoreOutlined } from '@ant-design/icons';
import EditField from '@/bpmn/panel/element-listener/execute-listener/edit/EditField';

const { Option } = Select;

interface IProps {
  onRef: Ref<any>;
  reFreshParent: (options: any) => any;
}

export default function EditListener(props: IProps) {
  // props属性
  const { onRef, reFreshParent } = props;

  // setState属性
  const [visible, setVisible] = useState(false);
  const [rows, setRows] = useState<Array<any>>([]);

  // ref
  const editRef = useRef<any>();

  // 其它属性
  const [form] = Form.useForm<{
    key: number;
    eventType: string;
    listenerType: string;
    javaClass: string;
    expression: string;
    delegateExpression: string;
    scriptType: string;
    scriptFormat: string;
    scriptValue: string;
    resource: string;
  }>();

  const eventType = Form.useWatch('eventType', form);
  const listenerType = Form.useWatch('listenerType', form);
  const scriptType = Form.useWatch('scriptType', form);

  useImperativeHandle(onRef, () => ({
    showEditDrawer: (rowObj: any) => showDrawer(rowObj),
  }));

  function showDrawer(rowObj: any) {
    console.log(rowObj);
    initPageData(rowObj);
    setVisible(true);
  }

  function closeDrawer() {
    form.resetFields();
    setVisible(false);
  }

  function initPageData(rowObj: any) {
    form.setFieldsValue({
      key: rowObj?.key || -1,
      eventType: rowObj?.protoListener?.eventType.value || '',
      listenerType: rowObj?.protoListener?.listenerType.value || '',
      javaClass: rowObj?.protoListener?.class || '',
      expression: rowObj?.protoListener?.expression || '',
      delegateExpression: rowObj?.protoListener?.delegateExpression || '',
      scriptType: rowObj?.protoListener?.scriptType?.value || '',
      scriptFormat: rowObj?.protoListener?.script?.scriptFormat || '',
      scriptValue: rowObj?.protoListener?.script?.value || '',
      resource: rowObj?.protoListener?.script?.resource || '',
    });
    // 初始化rows
    let fields: Array<any> = rowObj?.protoListener?.fields || [];
    let rows: Array<any> = fields.map((el, index) => {
      let field: any = encapsulateField(el);
      let row: any = Object.create(null);
      row.key = index + 1;
      row.fieldName = field.name;
      row.fieldType = field.fieldType.name;
      row.fieldTypeValue = field.fieldType.value;
      row.fieldValue = field.string || field.expression;
      console.log(row);
      return row;
    });
    setRows(rows);
  }

  function handleOK() {
    form
      .validateFields()
      .then((values) => {
        // 更新父组件表格数据
        reFreshParent({
          rowKey: form.getFieldValue('key'),
          ...values,
          fields: [...rows],
        });
        closeDrawer();
      })
      .catch((info) => {
        console.log('表单校验失败: ', info);
      });
  }

  function createOrUpdateField(rowObj: any) {
    const { key, fieldName, fieldType, fieldTypeValue, fieldValue } = rowObj;
    let newRows: Array<any> = [...rows];
    rowObj.key = key > 0 ? key : rows.length + 1;
    newRows.splice(rowObj.key - 1, 1, rowObj);
    setRows(newRows);
  }

  function removeField(key: number) {
    let newRows: Array<any> = [...rows];
    newRows.splice(key - 1, 1);
    newRows = newRows.map((el, index) => {
      if (el.key !== key) {
        el.key = index + 1;
        return el;
      }
    });
    setRows(newRows);
    // 提示通知
    notification.open({
      message: <span style={{ color: 'red' }}>字段已删除</span>,
      placement: 'top',
      duration: 2,
      description: `已删除编号为 ${key} 的字段`,
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  }

  function renderListenerForm() {
    switch (listenerType) {
      case listener_type.class:
        return (
          <Form.Item
            name="javaClass"
            label="Java类"
            rules={[{ required: true }]}
          >
            <Input
              placeholder="请输入"
              onChange={(event) => {
                console.log(event.target.value);
              }}
            />
          </Form.Item>
        );
      case listener_type.expression:
        return (
          <Form.Item
            name="expression"
            label="表达式"
            rules={[{ required: true }]}
          >
            <Input
              placeholder="请输入"
              onChange={(event) => {
                console.log(event.target.value);
              }}
            />
          </Form.Item>
        );
      case listener_type.delegateExpression:
        return (
          <Form.Item
            name="delegateExpression"
            label="代理表达式"
            rules={[{ required: true }]}
          >
            <Input
              placeholder="请输入"
              onChange={(event) => {
                console.log(event.target.value);
              }}
            />
          </Form.Item>
        );
      case listener_type.script:
        return (
          <>
            <Form.Item
              name="scriptFormat"
              label="脚本格式"
              rules={[{ required: true }]}
            >
              <Input
                placeholder="请输入"
                onChange={(event) => {
                  console.log(event.target.value);
                }}
              />
            </Form.Item>
            <Form.Item
              name="scriptType"
              label="脚本类型"
              rules={[{ required: true }]}
            >
              <Select value={scriptType}>
                {script_type_options.map((e) => {
                  return (
                    <Option key={e.value} value={e.value}>
                      {e.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            {scriptType === script_type.inlineScript && (
              <Form.Item
                name="scriptValue"
                label="脚本内容"
                rules={[{ required: true }]}
              >
                <Input
                  placeholder="请输入"
                  onChange={(event) => {
                    console.log(event.target.value);
                  }}
                />
              </Form.Item>
            )}
            {scriptType === script_type.externalResource && (
              <Form.Item
                name="resource"
                label="资源地址"
                rules={[{ required: true }]}
              >
                <Input
                  placeholder="请输入"
                  onChange={(event) => {
                    console.log(event.target.value);
                  }}
                />
              </Form.Item>
            )}
          </>
        );
    }
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
      dataIndex: 'fieldName',
      key: 'fieldName',
      ellipsis: true,
    },
    {
      title: '字段类型',
      width: 80,
      dataIndex: 'fieldType',
      key: 'fieldType',
      ellipsis: true,
    },
    {
      title: '字段值/表达式',
      width: 100,
      dataIndex: 'fieldValue',
      key: 'fieldValue',
      ellipsis: true,
    },
    {
      title: '操作',
      width: 80,
      key: 'action',
      render: (text: string, record: any) => (
        <Space size={0}>
          <Button
            type="text"
            size={'small'}
            style={{ color: '#1890ff' }}
            onClick={() => {
              editRef.current.showEditModal(record);
            }}
          >
            {'编辑'}
          </Button>
          <Button
            danger
            type="text"
            size={'small'}
            onClick={() => removeField(record.key)}
          >
            {'删除'}
          </Button>
        </Space>
      ),
    },
  ];

  function renderTable() {
    return (
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography style={{ fontWeight: 'bold' }}>
            <AppstoreOutlined />
            &nbsp;注入字段
          </Typography>
          <Button
            type="primary"
            size={'small'}
            onClick={() => {
              editRef.current.showEditModal();
            }}
          >
            <span>新增字段</span>
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={rows}
          pagination={false}
          bordered
          size={'small'}
        />
      </Space>
    );
  }

  return (
    <>
      <Drawer
        width={495}
        title="属性配置"
        placement="right"
        onClose={closeDrawer}
        visible={visible}
      >
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} form={form}>
          <Form.Item
            name="eventType"
            label="事件类型"
            rules={[{ required: true }]}
          >
            <Select>
              {execute_event_type_options.map((e) => {
                return (
                  <Option key={e.value} value={e.value}>
                    {e.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="listenerType"
            label="监听器类型"
            rules={[{ required: true }]}
          >
            <Select>
              {listener_type_options.map((e) => {
                return (
                  <Option key={e.value} value={e.value}>
                    {e.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          {renderListenerForm()}

          <Divider />
          {renderTable()}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 8,
              width: '100%',
            }}
          >
            <Button style={{ width: '49%' }} onClick={closeDrawer}>
              {'取消'}
            </Button>
            <Button style={{ width: '49%' }} type="primary" onClick={handleOK}>
              {'确定'}
            </Button>
          </div>
        </Form>
      </Drawer>

      <EditField onRef={editRef} reFreshParent={createOrUpdateField} />
    </>
  );
}
