import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Select, Space, Table, Typography } from 'antd';
import { Collapse } from 'antd';
import { PlusOutlined, PushpinTwoTone } from '@ant-design/icons';
import EditFormField from '@/bpmn/panel/form/edit/EditFormField';
import { FLOWABLE_PREFIX } from '@/bpmn/constant/moddle-constant';
import { getFormFieldNameByType } from '@/bpmn/panel/form/data-self';
import {
  createProperties,
  createProperty,
  updateElementExtensions,
} from '@/bpmn/util/panel-util';

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
      rowKey,
      id,
      label,
      type,
      defaultValue,
      properties: properties,
      validation,
    } = options;
    // 创建或更新表单字段

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
        </Panel>
      </Collapse>
      <EditFormField
        onRef={editFormFieldRef}
        reFreshParent={createOrUpdateFormFields}
      />
    </>
  );
}
