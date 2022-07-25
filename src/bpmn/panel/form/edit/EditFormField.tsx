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
import { encapsulateField } from '@/bpmn/panel/element-listener/data-self';
import { AppstoreOutlined } from '@ant-design/icons';
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
  const [constraintRows, setConstraintRows] = useState<Array<any>>([]);
  const [propertyRows, setPropertyRows] = useState<Array<any>>([]);

  // ref
  const editConstraintRef = useRef<any>();
  const editPropertyRef = useRef<any>();

  // 其它属性
  const [form] = Form.useForm<{
    key: number;
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
      // -1表示当前是新增
      key: rowObj?.key || -1,
      id: rowObj?.id || undefined,
      label: rowObj?.label || undefined,
      type: rowObj?.type || undefined,
      customType: rowObj?.customType || undefined,
      defaultValue: rowObj?.defaultValue || undefined,
    });
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

  /**
   * 新建或修改约束条件
   * @param rowObj [key, name, config]
   */
  function createOrUpdateConstraint(rowObj: any) {
    const { key } = rowObj;
    let newRows: Array<any> = [...constraintRows];
    rowObj.key = key > 0 ? key : constraintRows.length + 1;
    newRows.splice(rowObj.key - 1, 1, rowObj);
    setConstraintRows(newRows);
  }

  /**
   * 删除约束条件
   * @param key
   */
  function removeConstraint(key: number) {
    let newRows: Array<any> = [...constraintRows];
    newRows.splice(key - 1, 1);
    newRows = newRows.map((el, index) => {
      if (el.key !== key) {
        el.key = index + 1;
        return el;
      }
    });
    setConstraintRows(newRows);
    // 提示通知
    notification.open({
      message: <span style={{ color: 'red' }}>约束条件已删除</span>,
      placement: 'top',
      duration: 2,
      description: `已删除序号为 ${key} 的约束条件`,
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
              editConstraintRef.current.showEditModal(record);
            }}
          >
            {'编辑'}
          </Button>
          <Button
            danger
            type="text"
            size={'small'}
            onClick={() => removeConstraint(record.key)}
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
          dataSource={constraintRows}
          pagination={false}
          bordered
          size={'small'}
        />
      </Space>
    );
  }

  /**
   * 新建或修改字段属性
   * @param rowObj [key, id, value]
   */
  function createOrUpdateProperty(rowObj: any) {
    const { key } = rowObj;
    let newRows: Array<any> = [...propertyRows];
    rowObj.key = key > 0 ? key : propertyRows.length + 1;
    newRows.splice(rowObj.key - 1, 1, rowObj);
    setPropertyRows(newRows);
  }

  /**
   * 删除字段属性
   * @param key
   */
  function removeProperty(key: number) {
    let newRows: Array<any> = [...propertyRows];
    newRows.splice(key - 1, 1);
    newRows = newRows.map((el, index) => {
      if (el.key !== key) {
        el.key = index + 1;
        return el;
      }
    });
    setPropertyRows(newRows);
    // 提示通知
    notification.open({
      message: <span style={{ color: 'red' }}>约束条件已删除</span>,
      placement: 'top',
      duration: 2,
      description: `已删除序号为 ${key} 的约束条件`,
    });
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
            onClick={() => removeProperty(record.key)}
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
          dataSource={propertyRows}
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

      <EditConstraint
        onRef={editConstraintRef}
        reFreshParent={createOrUpdateConstraint}
      />
      <EditProperty
        onRef={editPropertyRef}
        reFreshParent={createOrUpdateProperty}
      />
    </>
  );
}
