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
  Empty,
} from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';
import {
  form_field_type,
  form_field_type_options,
  getFormFieldNameByType,
} from '@/bpmn/panel/ElementForm/dataSelf';
import EditConstraint from '@/bpmn/panel/ElementForm/EditFormField/EditConstraint/EditConstraint';
import EditProperty from '@/bpmn/panel/ElementForm/EditFormField/EditProperty/EditProperty';
import EditEnumValues from '@/bpmn/panel/ElementForm/EditFormField/EditEnumValues/EditEnumValues';

const { Option } = Select;

interface IProps {
  onRef: Ref<any>;
  reFreshParent: (options: any) => any;
}

/**
 * 编辑表单字段 组件
 *
 * @param props
 * @constructor
 */
export default function EditFormField(props: IProps) {
  // props
  const { onRef, reFreshParent } = props;
  // state
  const [open, setOpen] = useState(false);
  const [enumValueRows, setEnumValueRows] = useState<Array<any>>([]);
  const [constraintRows, setConstraintRows] = useState<Array<any>>([]);
  const [propertyRows, setPropertyRows] = useState<Array<any>>([]);
  // ref
  const editEnumValuesRef = useRef<any>();
  const editConstraintRef = useRef<any>();
  const editPropertyRef = useRef<any>();
  // form
  const [form] = Form.useForm<{
    key: number;
    id: string;
    label: string;
    type: string;
    customType: string;
    datePattern: string;
    defaultValue: string;
  }>();
  // watch
  const type = Form.useWatch('type', form);

  // 暴露给父组件的方法
  useImperativeHandle(onRef, () => ({
    // 打开弹窗
    showEditDrawer: (rowObj: any) => showDrawer(rowObj),
  }));

  /**
   * 打开弹窗并初始化页面数据
   *
   * @param rowObj
   */
  function showDrawer(rowObj: any) {
    initPageData(rowObj);
    setOpen(true);
  }

  /**
   * 关闭弹窗并重置表单数据
   */
  function closeDrawer() {
    form.resetFields();
    setOpen(false);
  }

  /**
   * 初始化页面数据
   *
   * @param rowObj
   */
  function initPageData(rowObj: any) {
    // 设置表单初始值
    form.setFieldsValue({
      // -1表示当前是新增
      key: rowObj?.key || -1,
      id: rowObj?.id,
      label: rowObj?.label,
      type: rowObj?.key && getFormFieldNameByType(rowObj?.type)?.value,
      customType: rowObj?.type,
      datePattern: rowObj?.datePattern,
      defaultValue: rowObj?.defaultValue,
    });
    setEnumValueRows(rowObj?.enumValues || []);
    setPropertyRows(rowObj?.properties || []);
    setConstraintRows(rowObj?.constraints || []);
  }

  /**
   * 提交表单
   */
  function handleOK() {
    form
      .validateFields()
      .then((values) => {
        // 更新父组件表格数据
        reFreshParent({
          key: form.getFieldValue('key'),
          id: form.getFieldValue('id'),
          label: form.getFieldValue('label'),
          type: form.getFieldValue('type'),
          customType: form.getFieldValue('customType'),
          defaultValue: form.getFieldValue('defaultValue'),
          values: enumValueRows,
          properties: propertyRows,
          validation: constraintRows,
        });
        closeDrawer();
      })
      .catch((info) => {
        console.log('表单校验失败: ', info);
      });
  }

  /**
   * 渲染 枚举列表组件
   */
  function renderEnumValuesTable() {
    /**
     * 新建或修改枚举值
     * @param rowObj [key, name, config]
     */
    function createOrUpdateEnumValues(rowObj: any) {
      const { key } = rowObj;
      let newRows: Array<any> = [...enumValueRows];
      rowObj.key = key > 0 ? key : enumValueRows.length + 1;
      newRows.splice(rowObj.key - 1, 1, rowObj);
      setEnumValueRows(newRows);
    }

    /**
     * 删除枚举值
     * @param key
     */
    function removeEnumValues(key: number) {
      let newRows: Array<any> = [...enumValueRows];
      newRows.splice(key - 1, 1);
      newRows = newRows.map((el, index) => {
        if (el.key !== key) {
          el.key = index + 1;
          return el;
        }
      });
      setEnumValueRows(newRows);
      // 提示通知
      notification.open({
        message: <span style={{ color: 'red' }}>枚举值已删除</span>,
        placement: 'top',
        duration: 2,
        description: `已删除序号为 ${key} 的约束条件`,
      });
    }

    // 枚举列
    const enumValuesColumns = [
      {
        title: '序号',
        width: 40,
        dataIndex: 'key',
        key: 'key',
        render: (text: any) => text,
      },
      {
        title: 'ID',
        width: 80,
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
      },
      {
        title: '名称',
        width: 80,
        dataIndex: 'name',
        key: 'name',
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
                editEnumValuesRef.current.showEditModal(record);
              }}
            >
              {'编辑'}
            </Button>
            <Button
              danger
              type="text"
              size={'small'}
              onClick={() => removeEnumValues(record.key)}
            >
              {'删除'}
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography style={{ fontWeight: 'bold' }}>
            <AppstoreOutlined />
            &nbsp;枚举值
          </Typography>
          <Button
            type="primary"
            size={'small'}
            onClick={() => {
              editEnumValuesRef.current.showEditModal();
            }}
          >
            <span>新增枚举</span>
          </Button>
        </div>
        <Table
          columns={enumValuesColumns}
          dataSource={enumValueRows}
          pagination={false}
          bordered
          size={'small'}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={'暂无数据'}
              />
            ),
          }}
        />
        {/* 编辑枚举列表组件*/}
        <EditEnumValues
          onRef={editEnumValuesRef}
          reFreshParent={createOrUpdateEnumValues}
        />
      </Space>
    );
  }

  /**
   * 渲染 约束条件列表组件
   */
  function renderConstraintTable() {
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

    // 约束条件列
    const constraintColumns = [
      {
        title: '序号',
        width: 40,
        dataIndex: 'key',
        key: 'key',
        render: (text: any) => text,
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
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={'暂无数据'}
              />
            ),
          }}
        />
        {/* 编辑约束条件 */}
        <EditConstraint
          onRef={editConstraintRef}
          reFreshParent={createOrUpdateConstraint}
        />
      </Space>
    );
  }

  /**
   * 渲染 字段属性列表组件
   */
  function renderPropertyTable() {
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

    // 字段属性列
    const propertyColumns = [
      {
        title: '序号',
        width: 40,
        dataIndex: 'key',
        key: 'key',
        render: (text: any) => text,
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
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={'暂无数据'}
              />
            ),
          }}
        />
        {/* 编辑字段属性组件 */}
        <EditProperty
          onRef={editPropertyRef}
          reFreshParent={createOrUpdateProperty}
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
        open={open}
        closable={false}
      >
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} form={form}>
          <Form.Item label="字段ID" name="id" rules={[{ required: true }]}>
            <Input placeholder={'请输入'} />
          </Form.Item>
          <Form.Item label="字段名称" name="label" rules={[{ required: true }]}>
            <Input placeholder={'请输入'} />
          </Form.Item>
          <Form.Item label="字段类型" name="type" rules={[{ required: true }]}>
            <Select placeholder={'请选择'}>
              {form_field_type_options.map((e: any) => {
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
          {type === form_field_type.date && (
            <Form.Item
              label="日期格式"
              name="datePattern"
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
          {type === form_field_type.enum && renderEnumValuesTable()}
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
    </>
  );
}
