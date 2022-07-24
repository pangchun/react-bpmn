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
  field_type_options,
  listener_type_options,
  task_event_type_options,
} from '@/bpmn/panel/element-listener/data-self';
import { AppstoreOutlined } from '@ant-design/icons';
import EditField from '@/bpmn/panel/element-listener/edit/EditField';
import {
  form_field_type,
  form_field_type_options,
} from '@/bpmn/panel/form/data-self';
import EditConstraint from '@/bpmn/panel/form/edit/EditConstraint';
import EditProperty from '@/bpmn/panel/form/edit/EditProperty';

const { Option } = Select;

interface IProps {
  onRef: Ref<any>;
  reFreshParent: (options: any) => any;
}

export default function EditFormField(props: IProps) {
  // props属性
  const { onRef, reFreshParent } = props;

  // setState属性
  const [visible, setVisible] = useState(false);
  const [rows, setRows] = useState<Array<any>>([]);

  // ref
  const editConstraintRef = useRef<any>();
  const editPropertyRef = useRef<any>();

  // 其它属性
  const [form] = Form.useForm<{
    id: string;
    label: string;
    type: string;
    customType: string;
    defaultValue: string;
  }>();

  const type = Form.useWatch('type', form);

  useImperativeHandle(onRef, () => ({
    showEditDrawer: (rowObj: any) => showDrawer(rowObj),
  }));

  function showDrawer(rowObj: any) {
    initPageData(rowObj);
    setVisible(true);
  }

  function closeDrawer() {
    form.resetFields();
    setVisible(false);
  }

  function initPageData(rowObj: any) {
    form.setFieldsValue({
      id: rowObj?.id || '',
      label: rowObj?.label || '',
      type: rowObj?.type || undefined,
      customType: rowObj?.customType || '',
      defaultValue: rowObj?.defaultValue || '',
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
      return row;
    });
    setRows(rows);
  }

  function handleOK() {
    form
      .validateFields()
      .then((values) => {
        console.log(values);
        // 更新父组件表格数据
        // reFreshParent({
        //   rowKey: form.getFieldValue('key'),
        //   ...values,
        //   fields: [...rows],
        // });
        // closeDrawer();
      })
      .catch((info) => {
        console.log('表单校验失败: ', info);
      });
  }

  const constraintColumns = [
    {
      title: '序号',
      width: 40,
      dataIndex: 'key',
      key: 'key',
      render: (text: any) => <a>{text}</a>,
    },
    {
      title: '名称',
      width: 80,
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '配置',
      width: 80,
      dataIndex: 'config',
      key: 'config',
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
              editPropertyRef.current.showEditModal(record);
            }}
          >
            {'编辑'}
          </Button>
          <Button
            danger
            type="text"
            size={'small'}
            // onClick={() => removeField(record.key)}
          >
            {'删除'}
          </Button>
        </Space>
      ),
    },
  ];

  function renderConstraintTable() {
    return (
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography style={{ fontWeight: 'bold' }}>
            <AppstoreOutlined />
            &nbsp;约束条件
          </Typography>
          <Button
            type="primary"
            size={'small'}
            onClick={() => {
              editConstraintRef.current.showEditModal();
            }}
          >
            <span>新增约束</span>
          </Button>
        </div>
        <Table
          columns={constraintColumns}
          dataSource={rows}
          pagination={false}
          bordered
          size={'small'}
        />
      </Space>
    );
  }

  const propertyColumns = [
    {
      title: '序号',
      width: 40,
      dataIndex: 'key',
      key: 'key',
      render: (text: any) => <a>{text}</a>,
    },
    {
      title: '编号|ID',
      width: 80,
      dataIndex: 'id',
      key: 'id',
      ellipsis: true,
    },
    {
      title: '值',
      width: 80,
      dataIndex: 'value',
      key: 'value',
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
              editPropertyRef.current.showEditModal(record);
            }}
          >
            {'编辑'}
          </Button>
          <Button
            danger
            type="text"
            size={'small'}
            // onClick={() => removeField(record.key)}
          >
            {'删除'}
          </Button>
        </Space>
      ),
    },
  ];

  function renderPropertyTable() {
    return (
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography style={{ fontWeight: 'bold' }}>
            <AppstoreOutlined />
            &nbsp;字段属性
          </Typography>
          <Button
            type="primary"
            size={'small'}
            onClick={() => {
              editPropertyRef.current.showEditModal();
            }}
          >
            <span>新增属性</span>
          </Button>
        </div>
        <Table
          columns={propertyColumns}
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
        title="表单字段配置"
        placement="right"
        onClose={closeDrawer}
        visible={visible}
      >
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} form={form}>
          <Form.Item label="字段ID" name="id" rules={[{ required: true }]}>
            <Input placeholder={'请输入'} />
          </Form.Item>
          <Form.Item label="字段名称" name="label" rules={[{ required: true }]}>
            <Input placeholder={'请输入'} />
          </Form.Item>
          <Form.Item label="类型" name="type" rules={[{ required: true }]}>
            <Select placeholder={'请选择'}>
              {form_field_type_options.map((e) => {
                return (
                  <Option key={e.value} value={e.value}>
                    {e.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          {type === form_field_type.custom && (
            <Form.Item
              label="类型名称"
              name="customType"
              rules={[{ required: true }]}
            >
              <Input placeholder={'请输入'} />
            </Form.Item>
          )}
          <Form.Item
            label="默认值"
            name="defaultValue"
            rules={[{ required: true }]}
          >
            <Input placeholder={'请输入'} />
          </Form.Item>
          <Divider />
          {renderConstraintTable()}
          <Divider />
          {renderPropertyTable()}
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

      <EditConstraint onRef={editConstraintRef} reFreshParent={() => {}} />
      <EditProperty onRef={editPropertyRef} reFreshParent={() => {}} />
    </>
  );
}
