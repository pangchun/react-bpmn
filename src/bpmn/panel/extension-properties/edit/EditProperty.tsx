import React, { Ref, useImperativeHandle, useState } from 'react';
import { Form, Input, Modal, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';

// todo 设置默认前缀，后面设置多moddle时可从配置获取
const prefix: string = 'flowable';

interface IProps {
  onRef: Ref<any>;
  rowsData: Array<any>;
  otherExtensionList: any[];
  reFreshParent: (rowsData: any[]) => any;
}

export default function EditProperty(props: IProps) {
  // props属性
  const { onRef, rowsData, otherExtensionList, reFreshParent } = props;

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
    setCurrentRowKey(rowObj?.key || rowsData.length + 1);
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
        const properties = window.bpmnInstance.moddle?.create(
          `${prefix}:Properties`,
          {
            values: getPropertiesList(
              values.propertyName,
              values.propertyValue,
            ),
          },
        );
        // 新建扩展属性字段
        const extensionElements = window.bpmnInstance.moddle?.create(
          `bpmn:ExtensionElements`,
          {
            values: otherExtensionList.concat(properties),
          },
        );
        // 执行更新
        window.bpmnInstance.modeling?.updateProperties(
          window.bpmnInstance.element,
          {
            extensionElements: extensionElements,
          },
        );
        // 更新父组件表格数据
        reFreshParent(rowsData);
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
    let propertiesList: any[];
    let rowObj: any = {
      key: currentRowKey,
      name: propertyName,
      value: propertyValue,
    };
    rowsData.splice(currentRowKey - 1, 1, rowObj);
    propertiesList = rowsData.map((e) => {
      return window.bpmnInstance.moddle?.create(`${prefix}:Property`, {
        name: e.name,
        value: e.value,
      });
    });
    debugger;
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
        <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
          <Form.Item
            label="属性名"
            name="propertyName"
            rules={[{ required: true, message: '属性名不能为空哦!' }]}
          >
            <Input placeholder={'请输入'} />
          </Form.Item>
          <Form.Item
            label="属性值"
            name="propertyValue"
            rules={[{ required: true, message: '属性值不能为空哦!' }]}
          >
            <Input placeholder={'请输入'} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
