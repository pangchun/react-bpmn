import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Empty,
  Form,
  Input,
  Select,
  Space,
  Table,
  Typography,
} from 'antd';
import { AlignRightOutlined, PlusOutlined } from '@ant-design/icons';
import EditFormField from '@/bpmn/panel/ElementForm/EditFormField/EditFormField';
import {
  checkIsCustomType,
  getFormFieldNameByType,
} from '@/bpmn/panel/ElementForm/dataSelf';
import { useAppSelector } from '@/redux/hook/hooks';
import { extractFormData } from '@/bpmn/util/panelUtil';

interface IProps {
  businessObject: any;
}

/**
 * 表单 组件
 *
 * @param props
 * @constructor
 */
export default function ElementForm(props: IProps) {
  // props
  const { businessObject } = props;
  // state
  const [formData, setFormData] = useState<any>();
  const [formFields, setFormFields] = useState<Array<any>>([]);
  const [businessKeyOptions, setBusinessKeyOptions] = useState<Array<any>>([]);
  // ref
  const editFormFieldRef = useRef<any>();
  // form
  const [form] = Form.useForm<{
    formKey: string;
    businessKey: string;
  }>();
  // redux
  const bpmnPrefix = useAppSelector((state) => state.bpmn.prefix);

  /**
   * 初始化
   */
  useEffect(() => {
    if (businessObject) {
      initPageData();
    }
  }, [businessObject?.id]);

  /**
   * 初始化页面数据
   */
  function initPageData() {
    let businessObject: any =
      window.bpmnInstance?.element?.businessObject || props.businessObject;
    // 获取FormData
    let formData: any = extractFormData(bpmnPrefix);
    setFormData(formData);
    // 获取表单标识和业务标识
    form.setFieldsValue({
      formKey: businessObject?.formKey,
      businessKey: formData?.businessKey,
    });
    // 获取表单字段
    let fields: Array<any> = encapsulateFormFields();
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

    /**
     * 封装表单字段
     */
    function encapsulateFormFields() {
      // 获取FormData
      let formData: any = extractFormData(bpmnPrefix);
      // 获取表单字段
      let fields: Array<any> = JSON.parse(
        JSON.stringify(formData?.fields || []),
      );
      fields = fields?.map((e, i) => {
        // 获取枚举值列表
        let enumValues: Array<any> = e.values;
        enumValues = enumValues?.map((e, i) => {
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
        let constraints: Array<any> = e.validation?.constraints;
        constraints = constraints?.map((e, i) => {
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
          isCustomType: checkIsCustomType(e.type),
          datePattern: e.datePattern,
          defaultValue: e.defaultValue,
          enumValues,
          properties,
          constraints,
        };
      });
      return fields;
    }
  }

  /**
   * 更新表单标识
   *
   * @param value
   */
  function updateFormKey(value: any) {
    window.bpmnInstance.modeling.updateProperties(window.bpmnInstance.element, {
      formKey: value,
    });
  }

  /**
   * 更新业务标识
   *
   * @param value
   */
  function updateBusinessKey(value: any) {
    window.bpmnInstance.modeling.updateModdleProperties(
      window.bpmnInstance.element,
      formData,
      {
        businessKey: value,
      },
    );
  }

  /**
   * 新增或修改表单字段
   *
   * @param options
   */
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
    const Field = window.bpmnInstance.moddle.create(`${bpmnPrefix}:FormField`, {
      id,
      type,
      label,
    });
    defaultValue && (Field.defaultValue = defaultValue);
    // 设置枚举值
    if (values && values.length) {
      Field.values = values.map((e: any, i: number) => {
        return window.bpmnInstance.moddle.create(`${bpmnPrefix}:Value`, {
          name: e.name,
          id: e.id,
        });
      });
    }
    // 设置字段属性
    if (properties && properties.length) {
      const propertiesConfig: Array<any> = properties.map(
        (e: any, i: number) => {
          return window.bpmnInstance.moddle.create(`${bpmnPrefix}:Property`, {
            id: e.id,
            value: e.value,
          });
        },
      );
      Field.properties = window.bpmnInstance.moddle.create(
        `${bpmnPrefix}:Properties`,
        {
          values: propertiesConfig,
        },
      );
    }
    // 设置字段约束
    if (validation && validation.length) {
      const validationConfig: Array<any> = validation.map(
        (e: any, i: number) => {
          return window.bpmnInstance.moddle.create(`${bpmnPrefix}:Constraint`, {
            name: e.name,
            config: e.config,
          });
        },
      );
      Field.properties = window.bpmnInstance.moddle.create(
        `${bpmnPrefix}:Validation`,
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

  // 列
  const columns = [
    {
      title: '序号',
      width: 40,
      dataIndex: 'key',
      key: 'key',
      render: (text: any) => text,
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
      render: (text: any) =>
        checkIsCustomType(text) ? getFormFieldNameByType(text)?.name : text,
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
        {'----------------------------- '}
        <AlignRightOutlined />
        {' 表单字段 -----------------------------'}
      </Typography.Paragraph>
      <Table
        columns={columns}
        dataSource={formFields}
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
