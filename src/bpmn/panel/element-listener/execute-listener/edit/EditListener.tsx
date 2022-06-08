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
} from 'antd';
import {
  encapsulateField,
  execute_event_type_options,
  listener_event_type,
  listener_event_type_options,
  script_type,
  script_type_options,
} from '@/bpmn/panel/element-listener/data-self';
import {
  AppstoreOutlined,
  BellOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import EditField from '@/bpmn/panel/element-listener/execute-listener/edit/EditField';

const { Option } = Select;

interface IProps {
  onRef: Ref<any>;
  rowsData: Array<any>;
}

export default function EditListener(props: IProps) {
  // props属性
  const { rowsData, onRef } = props;

  // setState属性
  const [visible, setVisible] = useState(false);
  const [rows, setRows] = useState<Array<any>>([]);

  // ref
  const editRef = useRef<any>();
  const deleteRef = useRef<any>();

  // 其它属性
  const [form] = Form.useForm<{
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
    setVisible(false);
  }

  function initPageData(rowObj: any) {
    form.setFieldsValue({
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
    console.log('=========');
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

  function updateEventType(value: string) {
    // setEventType(value);
  }

  function updateListenerType(value: string) {
    // setListenerType(value);
  }

  function createOrUpdateField(rowObj: any) {
    const { key, fieldName, fieldType, fieldTypeValue, fieldValue } = rowObj;
    let newRows: Array<any> = [...rows];
    rowObj.key = key > 0 ? key : rows.length + 1;
    newRows.splice(rowObj.key - 1, 1, rowObj);
    setRows(newRows);
  }

  function renderListenerForm() {
    switch (listenerType) {
      case listener_event_type.class:
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
      case listener_event_type.expression:
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
      case listener_event_type.delegateExpression:
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
      case listener_event_type.script:
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
              <Select value={scriptType} onChange={updateEventType}>
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
            onClick={() => {
              // setCurrentRow(record);
              // deleteRef.current.showDeleteModal();
            }}
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
            &nbsp;执行监听器
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
            <Select value={eventType} onChange={updateEventType}>
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
            <Select value={listenerType} onChange={updateListenerType}>
              {listener_event_type_options.map((e) => {
                return (
                  <Option key={e.value} value={e.value}>
                    {e.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          {renderListenerForm()}
        </Form>
        <Divider />
        {renderTable()}
        <Divider />
      </Drawer>

      <EditField onRef={editRef} reFreshParent={createOrUpdateField} />
    </>
  );
}
