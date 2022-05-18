import React, {
  Ref,
  RefObject,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Modal,
  Button,
  message,
  Input,
  Typography,
  Form,
  Checkbox,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';

// todo 设置默认前缀，后面设置多moddle时可从配置获取
const prefix: string = 'flowable';

interface IProps {
  onRef: Ref<any>;
  otherExtensionList: any[];
  rowsData: Array<any>;
  // 新增时传null，编辑时必传
  currentRow: any;
  moddle: any;
  modeling: any;
  element: any;
  reFreshParent: () => any;
}

export default function EditProperty(props: IProps) {
  // props属性
  const {
    rowsData,
    currentRow,
    onRef,
    moddle,
    modeling,
    element,
    otherExtensionList,
    reFreshParent,
  } = props;

  // setState属性
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 其它属性
  const [form] = Form.useForm<{
    propertyName: string;
    propertyValue: string;
  }>();

  useEffect(() => {
    // 初始化默认值 这里之所以依赖rowsData，因为currentRow可以为null
    initPageData();
  }, [currentRow, rowsData]);

  function initPageData() {
    if (!currentRow) {
      return;
    }
    form.setFieldsValue({
      propertyName: currentRow.name || '',
      propertyValue: currentRow.value || '',
    });
  }

  useImperativeHandle(onRef, () => ({
    showEditModal: (param: any) => showModal(param),
  }));

  function showModal(param: any) {
    if (!currentRow) {
      form.resetFields();
    }
    setIsModalVisible(true);
  }

  function handleCancel() {
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
        message.success('【扩展属性】已更新').then((r) => {});
        reFreshParent();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });

    // form.resetFields();
    setIsModalVisible(false);
  }

  /**
   * 获取属性列表
   */
  function getPropertiesList(propertyName: string, propertyValue: string) {
    let propertiesList: any[] = [];

    // 保存原有的全部属性，如果当前为编辑模式，则当前记录对应的属性名和属性值，使用当前输入框的值
    if (rowsData) {
      rowsData.map((e, i) => {
        const newProperty = moddle?.create(`${prefix}:Property`, {
          name: e.key === currentRow?.key ? propertyName : e.name,
          value: e.key === currentRow?.key ? propertyValue : e.value,
        });
        propertiesList.push(newProperty);
      });
    }

    // 保存新增的属性到数组末尾
    if (!currentRow) {
      const newProperty = moddle?.create(`${prefix}:Property`, {
        name: propertyName,
        value: propertyValue,
      });
      propertiesList.push(newProperty);
    }

    // 返回属性列表
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
