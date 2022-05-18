import React, { Ref, useImperativeHandle, useState } from 'react';
import { Modal, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

// todo 设置默认前缀，后面设置多moddle时可从配置获取
const prefix: string = 'flowable';

interface IProps {
  onRef: Ref<any>;
  otherExtensionList: any[];
  rowsData: Array<any>;
  moddle: any;
  modeling: any;
  element: any;
  reFreshParent: () => any;
}

export default function DeleteProperty(props: IProps) {
  // props属性
  const {
    rowsData,
    onRef,
    moddle,
    modeling,
    element,
    otherExtensionList,
    reFreshParent,
  } = props;

  // setState属性
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<any>();

  useImperativeHandle(onRef, () => ({
    showDeleteModal: (rowObj: any) => showModal(rowObj),
  }));

  function showModal(rowObj: any) {
    setCurrentRow(rowObj);
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
      rowsData.map((e) => {
        if (e.key !== currentRow?.key) {
          const newProperty = moddle?.create(`${prefix}:Property`, {
            name: e.name,
            value: e.value,
          });
          propertiesList.push(newProperty);
        }
      });
    }
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
            color: '#ff1818',
          }}
        >
          {currentRow?.key} - {currentRow?.name} - {currentRow?.value}
        </span>
        {'】'}
      </Modal>
    </>
  );
}
