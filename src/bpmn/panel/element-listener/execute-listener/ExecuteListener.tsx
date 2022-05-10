import React, { useEffect, useRef, useState } from 'react';
import { Button, Space, Typography, Table } from 'antd';
import { Collapse } from 'antd';
import {
  BellOutlined,
  PlusOutlined,
  PlusSquareTwoTone,
} from '@ant-design/icons';
import EditProperty from '@/bpmn/panel/extension-properties/edit/EditProperty';
import DeleteProperty from '@/bpmn/panel/extension-properties/delete/DeleteProperty';
import { FLOWABLE_PREFIX } from '@/bpmn/constant/moddle-constant';
import { encapsulateListener } from '@/bpmn/panel/element-listener/data-self';
import EditListener from '@/bpmn/panel/element-listener/execute-listener/edit/EditListener';

const { Panel } = Collapse;

interface IProps {
  element: any;
  modeling: any;
  bpmnFactory: any;
  moddle: any;
}

export default function ExecuteListener(props: IProps) {
  // props属性
  const { element, modeling, bpmnFactory, moddle } = props;

  // setState属性
  const [businessObject, setBusinessObject] = useState<any>();
  const [rows, setRows] = useState<Array<any>>([]);
  const [currentRow, setCurrentRow] = useState<any>();
  const [otherExtensionList, setOtherExtensionList] = useState<Array<any>>([]);
  const [listenerExtensionList, setListenerExtensionList] = useState<
    Array<any>
  >([]);

  // ref
  const editRef = useRef<any>();
  const deleteRef = useRef<any>();

  useEffect(() => {
    // 初始化业务对象
    setBusinessObject(element?.businessObject);
    initRows();
    initOtherExtensionList();
    console.log('element in ExtensionProperties \n', element);
  }, [JSON.stringify(element?.businessObject)]);

  /**
   * 初始化行数据
   */
  function initRows() {
    if (!element) {
      return [];
    }

    let initialRows: any[];

    let listeners: any[] =
      element.businessObject?.extensionElements?.values?.filter(
        (e: any) => e.$type === `${FLOWABLE_PREFIX}:ExecutionListener`,
      ) ?? [];

    setListenerExtensionList(listeners);

    initialRows = listeners?.map((e, i) => {
      let listener = encapsulateListener(e);
      return {
        key: i,
        eventType: listener.event,
        listenerType: listener.listenerType.name,
        protoListener: listener,
      };
    });
    setRows(initialRows);
  }

  /**
   * 初始化其他非扩展属性元素
   */
  function initOtherExtensionList() {
    let otherExtensionList: any[] = [];
    element?.businessObject?.extensionElements?.values?.filter((e: any) => {
      if (e.$type !== `${FLOWABLE_PREFIX}:Properties`) {
        otherExtensionList.push(e);
      }
    });
    setOtherExtensionList(otherExtensionList);
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
      title: '事件类型',
      width: 110,
      dataIndex: 'eventType',
      key: 'eventType',
      ellipsis: true,
    },
    {
      title: '监听器类型',
      width: 110,
      dataIndex: 'listenerType',
      key: 'listenerType',
      ellipsis: true,
    },
    {
      title: '操作',
      width: 80,
      key: 'action',
      render: (text: string, record: any) => (
        <Space size="small">
          <Button
            type="text"
            size={'small'}
            style={{ color: '#1890ff' }}
            onClick={() => {
              setCurrentRow(record);
              editRef.current.showEditDrawer();
            }}
          >
            {'编辑'}
          </Button>
          <Button
            danger
            type="text"
            size={'small'}
            onClick={() => {
              setCurrentRow(record);
              deleteRef.current.showDeleteModal();
            }}
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
              <BellOutlined />
              &nbsp;执行监听器
            </Typography>
          }
          key="1"
          style={{ backgroundColor: '#FFF' }}
          showArrow={true}
        >
          <Table
            columns={columns}
            dataSource={rows}
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
              // 新增时，设置当前行对象为空
              setCurrentRow(null);
              editRef.current.showEditDrawer();
            }}
          >
            <PlusOutlined />
            <span style={{ marginLeft: 0 }}>添加属性</span>
          </Button>
        </Panel>
      </Collapse>

      {/* 弹窗组件 */}
      <EditListener
        onRef={editRef}
        otherExtensionList={otherExtensionList}
        currentRow={currentRow}
        rowsData={rows}
        moddle={moddle}
        modeling={modeling}
        element={element}
      />
      <DeleteProperty
        onRef={deleteRef}
        otherExtensionList={otherExtensionList}
        currentRow={currentRow}
        rowsData={rows}
        moddle={moddle}
        modeling={modeling}
        element={element}
      />
    </>
  );
}
