import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Select, Space, Table, Typography } from 'antd';
import { Collapse } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import EditFormField from '@/bpmn/panel/ElementForm/EditFormField/EditFormField';
import { FLOWABLE_PREFIX } from '@/bpmn/constant/constants';
import { getFormFieldNameByType } from '@/bpmn/panel/ElementForm/dataSelf';

const { Panel } = Collapse;

interface IProps {
  businessObject: any;
}

export default function ElementForm(props: IProps) {
  // props属性
  const { businessObject } = props;

  // setState属性
  const [formFields, setFormFields] = useState<Array<any>>([]);
  const [formData, setFormData] = useState<any>();
  const [businessKeyOptions, setBusinessKeyOptions] = useState<Array<any>>([]);

  // ref
  const editFormFieldRef = useRef<any>();

  // 其它属性
  const [form] = Form.useForm<{
    formKey: string;
    businessKey: string;
  }>();

  useEffect(() => {
    initPageData();
  }, [businessObject?.id]);

  function initPageData() {
    // 获取业务对象
    let businessObject: any =
      window.bpmnInstance?.element?.businessObject || props.businessObject;
    if (!businessObject) {
      return;
    }

    // 获取FormData
    let formData: any =
      businessObject.extensionElements?.values?.filter(
        (e: any) => e.$type === `${FLOWABLE_PREFIX}:FormData`,
      )?.[0] ||
      window.bpmnInstance.moddle.create(`${FLOWABLE_PREFIX}:FormData`, {
        fields: [],
      });
    setFormData(formData);

    // 获取表单字段，填充table表格
    let fields: Array<any> = JSON.parse(JSON.stringify(formData?.fields || []));
    fields = fields?.map((e, i) => {
      // 获取枚举值列表
      let values: Array<any> = e.values;
      values = values?.map((e, i) => {
        return {
          key: i + 1,
          id: e.id,
          name: e.name,
        };
      });
      // 获取字段属性
      let properties: Array<any> = e.properties?.values;
      properties = properties?.map((e, i) => {
        return {
          key: i + 1,
          id: e.id,
          value: e.value,
        };
      });
      // 获取字段约束
      let validation: Array<any> = e.validation?.constraints;
      validation = validation?.map((e, i) => {
        return {
          key: i + 1,
          name: e.name,
          config: e.config,
        };
      });
      // 获取其他属性并封装后返回
      return {
        key: i + 1,
        id: e.id,
        label: e.label,
        type: e.type,
        defaultValue: e.defaultValue,
        values,
        properties,
        validation,
      };
    });
    setFormFields(fields);

    // 获取表单字段id与名称，构造业务标识下拉项
    let businessKeyOptions: Array<any> =
      fields?.map((e) => {
        return {
          name: e.label,
          value: e.id,
        };
      }) || [];
    setBusinessKeyOptions(businessKeyOptions);
    // 设置表单初始值
    form.setFieldsValue({
      formKey: businessObject.formKey || undefined,
      businessKey: formData?.businessKey || undefined,
    });
  }

  function updateFormKey(value: any) {
    window.bpmnInstance.modeling.updateProperties(window.bpmnInstance.element, {
      formKey: value,
    });
  }

  function updateBusinessKey(value: any) {
    console.log(value);
    window.bpmnInstance.modeling.updateModdleProperties(
      window.bpmnInstance.element,
      formData,
      {
        businessKey: value,
      },
    );
  }

  function createOrUpdateFormFields(options: any) {
    console.log(options);
    // properties 是特殊变量，重命名使不警告
    const {
      key,
      id,
      label,
      type,
      customType,
      defaultValue,
      values,
      properties: properties,
      validation,
    } = options;

    // 创建或更新表单字段
    const Field = window.bpmnInstance.moddle.create(
      `${FLOWABLE_PREFIX}:FormField`,
      { id, type, label },
    );
    defaultValue && (Field.defaultValue = defaultValue);
    // 设置枚举值
    if (values && values.length) {
      Field.values = values.map((e: any, i: number) => {
        return window.bpmnInstance.moddle.create(`${FLOWABLE_PREFIX}:Value`, {
          name: e.name,
          id: e.id,
        });
      });
    }
    // 设置字段属性
    if (properties && properties.length) {
      const propertiesConfig: Array<any> = properties.map(
        (e: any, i: number) => {
          return window.bpmnInstance.moddle.create(
            `${FLOWABLE_PREFIX}:Property`,
            { id: e.id, value: e.value },
          );
        },
      );
      Field.properties = window.bpmnInstance.moddle.create(
        `${FLOWABLE_PREFIX}:Properties`,
        {
          values: propertiesConfig,
        },
      );
    }
    // 设置字段约束
    if (validation && validation.length) {
      const validationConfig: Array<any> = validation.map(
        (e: any, i: number) => {
          return window.bpmnInstance.moddle.create(
            `${FLOWABLE_PREFIX}:Constraint`,
            { name: e.name, config: e.config },
          );
        },
      );
      Field.properties = window.bpmnInstance.moddle.create(
        `${FLOWABLE_PREFIX}:Validation`,
        {
          constraints: validationConfig,
        },
      );
    }

    // 更新表格数据和FormData
    if (key === -1) {
      let newFormFields: Array<any> = [...formFields];
      options.key = formFields.length + 1;
      newFormFields.push(options);
      setFormFields(newFormFields);
    } else {
      let newFormFields: Array<any> = [...formFields];
      newFormFields.splice(key, 1, options);
      setFormFields(newFormFields);
    }

    // 修改字段后直接更新FormData
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
      dataIndex: 'label',
      key: 'label',
      ellipsis: true,
    },
    {
      title: '字段类型',
      width: 80,
      dataIndex: 'type',
      key: 'type',
      ellipsis: true,
      render: (text: any) => getFormFieldNameByType(text),
    },
    {
      title: '默认值',
      width: 80,
      dataIndex: 'defaultValue',
      key: 'defaultValue',
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
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
        <Form.Item name="formKey" label="表单标识">
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
            {businessKeyOptions?.map((e) => {
              return (
                <Select.Option key={e.value} value={e.value}>
                  {e.name}
                </Select.Option>
              );
            })}
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
        dataSource={formFields}
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
      <EditFormField
        onRef={editFormFieldRef}
        reFreshParent={createOrUpdateFormFields}
      />
    </>
  );
}
