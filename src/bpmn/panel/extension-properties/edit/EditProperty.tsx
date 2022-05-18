import React, { Ref, useImperativeHandle, useState } from 'react';
import { Modal, Input, Typography, Form } from 'antd';
import { EditOutlined } from '@ant-design/icons';

// todo 设置默认前缀，后面设置多moddle时可从配置获取
const prefix: string = 'flowable';

interface IProps {
  onRef: Ref<any>;
  otherExtensionList: any[];
  rowsData: Array<any>;
  // 新增时传null，编辑时必传
  // currentRow: any;
  moddle: any;
  modeling: any;
  element: any;
  reFreshParent: () => any;
}

export default function EditProperty(props: IProps) {
  // props属性
  const {
    rowsData,
    // currentRow,
    onRef,
    moddle,
    modeling,
    element,
    otherExtensionList,
    reFreshParent,
  } = props;

  // setState属性
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRowKey, setCurrentRowKey] = useState<any>();

  // 其它属性
  const [form] = Form.useForm<{
    propertyName: string;
    propertyValue: string;
  }>();

  useImperativeHandle(onRef, () => ({
    showEditModal: (rowObj: any) => showModal(rowObj),
  }));

  function showModal(rowObj: any) {
    // 通过传入的当前行对象初始化表单默认值
    form.setFieldsValue({
      propertyName: rowObj?.name || '',
      propertyValue: rowObj?.value || '',
    });
    setCurrentRowKey(rowObj?.key || rowsData.length);
    setIsModalVisible(true);
  }

  function handleCancel() {
    form.resetFields();
    setIsModalVisible(false);
  }

  function handleOK() {
    form
      .validateFields()
      .then((values) => {
        // 新建属性字段集合，用于保存属性字段
        const properties = moddle?.create(`${prefix}:Properties`, {
          values: getPropertiesList(values.propertyName, values.propertyValue),
        });
        // 新建扩展属性字段
        const extensionElements = moddle?.create(`bpmn:ExtensionElements`, {
          values: otherExtensionList.concat(properties),
        });
        // 执行更新
        modeling?.updateProperties(element, {
          extensionElements: extensionElements,
        });
        reFreshParent();
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log('表单校验失败: ', info);
      });
  }

  /**
   * 获取属性列表
   */
  function getPropertiesList(propertyName: string, propertyValue: string) {
    let propertiesList: any[] = [];
    let rowObj: any = {
      key: currentRowKey,
      name: propertyName,
      value: propertyValue,
    };
    rowsData.splice(currentRowKey, 1, rowObj);
    rowsData.map((e) => {
      const newProperty = moddle?.create(`${prefix}:Property`, {
        name: e.name,
        value: e.value,
      });
      propertiesList.push(newProperty);
    });
    return propertiesList;
  }

  return (
    <>
      <Modal
        width={500}
        style={{ maxHeight: '50vh' }}
        title={
          <Typography style={{ color: '#1890ff' }}>
            <EditOutlined />
            &nbsp;编辑属性
          </Typography>
        }
        visible={isModalVisible}
        okText={'确认'}
        cancelText={'取消'}
        onOk={handleOK}
        onCancel={handleCancel}
      >
        <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 19 }}>
          <Form.Item
            label="属性名"
            name="propertyName"
            rules={[{ required: true, message: '属性名不能为空哦!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="属性值"
            name="propertyValue"
            rules={[{ required: true, message: '属性值不能为空哦!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
