import React, {
  Ref,
  RefObject,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Modal, Button, message, Input, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

// todo 设置默认前缀，后面设置多moddle时可从配置获取
const prefix: string = 'flowable';

interface IProps {
  onRef: Ref<any>;
  otherExtensionList: any[];
  rowsData: Array<any>;
  // 必传
  currentRow: any;
  moddle: any;
  modeling: any;
  element: any;
  reFreshParent: () => any;
}

export default function DeleteProperty(props: IProps) {
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

  useEffect(() => {}, [currentRow]);

  /**
   * 暴露给父组件的方法或变量
   */
  useImperativeHandle(onRef, () => ({
    showDeleteModal: () => showModal(),
  }));

  function showModal() {
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
      values: otherExtensionList.concat(properties),
    });
    // 执行更新
    modeling?.updateProperties(element, {
      extensionElements: extensionElements,
    });
    message.success('【扩展属性】已删除').then((r) => {});
    reFreshParent();
    handleCancel();
  }

  /**
   * 获取属性列表
   */
  function getPropertiesList() {
    let propertiesList: any[] = [];

    // 保存原有的全部属性，当前序号的属性不保存即可
    if (rowsData) {
      rowsData.map((e, i) => {
        if (e.key !== currentRow?.key) {
          const newProperty = moddle?.create(`${prefix}:Property`, {
            name: e.name,
            value: e.value,
          });
          propertiesList.push(newProperty);
        }
      });
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
          <Typography style={{ color: '#faad14' }}>
            <ExclamationCircleOutlined />
            &nbsp;删除属性
          </Typography>
        }
        visible={isModalVisible}
        okText={'确认'}
        cancelText={'取消'}
        onOk={handleOK}
        onCancel={handleCancel}
      >
        {'正在删除属性: 【'}
        <span
          style={{
            fontWeight: 'bold',
            // color: "#1890ff"
          }}
        >
          {currentRow?.key} - {currentRow?.name} - {currentRow?.value}
        </span>
        {'】'}
      </Modal>
    </>
  );
}
