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
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

// todo 设置默认前缀，后面设置多moddle时可从配置获取
const prefix: string = 'flowable';

interface IProps {
  onRef: Ref<any>;
  rowsData: Array<any>;
  // 新增时传null，编辑时必传
  currentRow: any;
  moddle: any;
  modeling: any;
  element: any;
}

export default function EditProperty(props: IProps) {
  // props属性
  const { rowsData, currentRow, onRef, moddle, modeling, element } = props;

  // setState属性
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [propertyName, setPropertyName] = useState<string>();
  const [propertyValue, setPropertyValue] = useState<string>();

  useEffect(() => {
    // 初始化默认值 这里之所以依赖rowsData，因为currentRow可以为null
    setPropertyName(currentRow?.name);
    setPropertyValue(currentRow?.value);
    console.log(currentRow);
  }, [currentRow, rowsData]);

  /**
   * 暴露给父组件的方法或变量
   */
  useImperativeHandle(onRef, () => ({
    showEditModal: (param: any) => showModal(param),
  }));

  function showModal(param: any) {
    setIsModalVisible(true);
  }

  function handleCancel() {
    setIsModalVisible(false);
  }

  function handleOK() {
    // 新建属性字段集合，用于保存属性字段
    const properties = moddle?.create(`${prefix}:Properties`, {
      values: getPropertiesList(),
    });
    // 新建扩展属性字段
    const extensionElements = moddle?.create(`bpmn:ExtensionElements`, {
      values: [properties],
    });
    // 执行更新
    modeling?.updateProperties(element, {
      extensionElements: extensionElements,
    });
    message.success('【扩展属性】已更新').then((r) => {});
    setIsModalVisible(false);
  }

  /**
   * 更新属性名
   */
  function updateName(value: string) {
    setPropertyName(value);
  }

  /**
   * 更新属性值
   */
  function updateValue(value: string) {
    setPropertyValue(value);
  }

  /**
   * 获取属性列表
   */
  function getPropertiesList() {
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
          currentRow ? (
            <Typography style={{ color: '#1890ff' }}>
              <EditOutlined />
              &nbsp;编辑属性
            </Typography>
          ) : (
            <Typography style={{ color: '#1890ff' }}>
              <EditOutlined />
              &nbsp;新增属性
            </Typography>
          )
        }
        visible={isModalVisible}
        okText={'确认'}
        cancelText={'取消'}
        onOk={handleOK}
        onCancel={handleCancel}
      >
        <Input
          size="middle"
          addonBefore={'属性名'}
          placeholder={'属性名'}
          value={propertyName}
          onChange={(event) => {
            updateName(event.currentTarget.value);
          }}
        />
        <Input
          size="middle"
          addonBefore={'属性值'}
          placeholder={'属性值'}
          style={{ marginTop: 4 }}
          value={propertyValue}
          onChange={(event) => {
            updateValue(event.currentTarget.value);
          }}
        />
      </Modal>
    </>
  );
}
