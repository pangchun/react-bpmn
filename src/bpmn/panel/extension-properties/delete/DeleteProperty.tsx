import React, { Ref, useImperativeHandle, useState } from 'react';
import { Modal, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

// todo 设置默认前缀，后面设置多moddle时可从配置获取
const prefix: string = 'flowable';

interface IProps {
  onRef: Ref<any>;
  rowsData: Array<any>;
  otherExtensionList: any[];
  reFreshParent: (rowsData: any[]) => any;
}

export default function DeleteProperty(props: IProps) {
  // props属性
  const { rowsData, onRef, otherExtensionList, reFreshParent } = props;

  // setState属性
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<any>();
  const [currentRowKey, setCurrentRowKey] = useState<any>();

  useImperativeHandle(onRef, () => ({
    showDeleteModal: (rowObj: any) => showModal(rowObj),
  }));

  function showModal(rowObj: any) {
    setCurrentRow(rowObj);
    setIsModalVisible(true);
    setCurrentRowKey(rowObj?.key || rowsData.length + 1);
  }

  function handleCancel() {
    setIsModalVisible(false);
  }

  function handleOK() {
    // 新建属性字段集合，用于保存属性字段
    const properties = window.bpmnInstance.moddle?.create(
      `${prefix}:Properties`,
      {
        values: getPropertiesList(),
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
    reFreshParent(rowsData);
    handleCancel();
  }

  /**
   * 获取属性列表
   */
  function getPropertiesList() {
    let propertiesList: any[];
    rowsData.splice(currentRowKey - 1, 1);
    propertiesList = rowsData.map((e) => {
      return window.bpmnInstance.moddle?.create(`${prefix}:Property`, {
        name: e.name,
        value: e.value,
      });
    });
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
        {'确认删除该属性?'}
      </Modal>
    </>
  );
}
