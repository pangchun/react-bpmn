import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Empty,
  Form,
  Input,
  notification,
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
    let fields: Array<any> = encapsulateFormFields(formData);
    setFormFields(fields);
    // 构造业务标识下拉项
    createBusinessKeySelectOptions(fields);

    /**
     * 封装表单字段
     */
    function encapsulateFormFields(formData: any) {
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
   * @param option [key, value, children]
   */
  function updateBusinessKey(option: any) {
    let { key, value } = option;
    if (key === 'no') {
      // 如果选择无，则默认没有业务标识
      value = '';
    }
    window.bpmnInstance.modeling.updateModdleProperties(
      window.bpmnInstance.element,
      formData,
      {
        businessKey: value,
      },
    );
  }

  /**
   * 构造业务标识下拉项
   *
   * @param fields
   */
  function createBusinessKeySelectOptions(fields: Array<any>) {
    let businessKeyOptions: Array<any> =
      fields?.map((e) => {
        return {
          name: e.label,
          value: e.id,
        };
      }) || [];
    setBusinessKeyOptions(businessKeyOptions);
  }

  /**
   * 新增或修改表单字段
   *
   * @param options
   */
  function createOrUpdateFormFields(options: any) {
    const {
      key,
      id,
      label,
      type,
      datePattern,
      defaultValue,
      enumValues,
      // properties 是特殊变量，重命名使不警告
      properties: properties,
      constraints,
    } = options;

    // 更新业务标识 (如果当前是修改操作，一旦字段id更改了，正好是业务标识时，则需要更新业务标识)
    if (key > 0) {
      let businessKey: string = form.getFieldValue('businessKey');
      let field: any = formFields.at(key - 1);
      if (businessKey === field.id) {
        updateBusinessKey({ value: id });
        form.setFieldValue('businessKey', id);
      }
    }

    // 更新表格
    let newFormFields: Array<any> = [...formFields];
    let fieldObj: any = Object.create({
      key: key,
      id: id,
      label: label,
      type: type,
      datePattern: datePattern,
      defaultValue: defaultValue,
      enumValues: enumValues,
      properties: properties,
      constraints: constraints,
    });
    if (key === -1) {
      fieldObj.key = newFormFields.length + 1;
      newFormFields.push(fieldObj);
    } else {
      newFormFields.splice(key - 1, 1, fieldObj);
    }
    setFormFields(newFormFields);

    // 更新FormData
    let fieldConfigObj = createFieldConfigObj();
    if (key === -1) {
      formData.fields.push(fieldConfigObj);
    } else {
      formData.fields.splice(key - 1, 1, fieldConfigObj);
    }

    // 更新业务标识下拉项
    createBusinessKeySelectOptions(newFormFields);

    /**
     * 创建表单字段
     */
    function createFieldConfigObj() {
      const field = window.bpmnInstance.moddle.create(
        `${bpmnPrefix}:FormField`,
        {
          id,
          type,
          label,
        },
      );
      defaultValue && (field.defaultValue = defaultValue);
      // 设置枚举值
      if (enumValues && enumValues.length) {
        field.values = enumValues.map((e: any, i: number) => {
          return window.bpmnInstance.moddle.create(`${bpmnPrefix}:Value`, {
            name: e.name,
            id: e.id,
          });
        });
      }
      // 设置属性
      if (properties && properties.length) {
        const propertiesConfig: Array<any> = properties.map(
          (e: any, i: number) => {
            return window.bpmnInstance.moddle.create(`${bpmnPrefix}:Property`, {
              id: e.id,
              value: e.value,
            });
          },
        );
        field.properties = window.bpmnInstance.moddle.create(
          `${bpmnPrefix}:Properties`,
          {
            values: propertiesConfig,
          },
        );
      }
      // 设置约束
      if (constraints && constraints.length) {
        const validationConfig: Array<any> = constraints.map(
          (e: any, i: number) => {
            return window.bpmnInstance.moddle.create(
              `${bpmnPrefix}:Constraint`,
              {
                name: e.name,
                config: e.config,
              },
            );
          },
        );
        field.validation = window.bpmnInstance.moddle.create(
          `${bpmnPrefix}:Validation`,
          {
            constraints: validationConfig,
          },
        );
      }
      return field;
    }
  }

  /**
   * 删除表单字段
   *
   * @param key
   */
  function removeFormField(key: number) {
    // 删除表格中的字段
    let newFormFields: Array<any> = [...formFields];
    newFormFields.splice(key - 1, 1);
    newFormFields = newFormFields.map((el, index) => {
      el.key = index + 1;
      return el;
    });
    setFormFields(newFormFields);
    //  删除FormData中的字段
    formData.fields.splice(key - 1, 1);
    // 重构业务标识下拉项
    createBusinessKeySelectOptions(newFormFields);
    // 提示通知
    notification.open({
      message: <span style={{ color: 'red' }}>{'删除字段'}</span>,
      placement: 'top',
      duration: 2,
      description: `已删除序号为 ${key} 的表单字段`,
    });
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
        checkIsCustomType(text) ? text : getFormFieldNameByType(text)?.name,
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
            onClick={() => removeFormField(record.key)}
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
            onChange={(value, option) => updateBusinessKey(option)}
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
