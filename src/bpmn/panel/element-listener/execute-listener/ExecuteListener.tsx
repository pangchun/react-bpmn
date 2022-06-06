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
  businessObject: any;
}

export default function ExecuteListener(props: IProps) {
  // props属性
  const { businessObject } = props;

  // setState属性
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
    initRows();
    initOtherExtensionList();
  }, [businessObject?.id]);

  /**
   * 初始化行数据
   */
  function initRows() {
    if (!businessObject) {
      return;
    }

    let rows: any[];
    let listeners: any[] =
      businessObject?.extensionElements?.values?.filter(
        (e: any) => e.$type === `${FLOWABLE_PREFIX}:ExecutionListener`,
      ) ?? [];
    setListenerExtensionList(listeners);
    rows = listeners?.map((e, i) => {
      let listener = encapsulateListener(e);
      return {
        key: i + 1,
        eventType: listener.eventType.name,
        listenerType: listener.listenerType.name,
        protoListener: listener,
      };
    });
    setRows(rows);
  }

  /**
   * 初始化其他扩展属性
   */
  function initOtherExtensionList() {
    let otherExtensionList: any[] = [];
    businessObject?.extensionElements?.values?.filter((e: any) => {
      if (e.$type !== `${FLOWABLE_PREFIX}:ExecutionListener`) {
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
              editRef.current.showEditDrawer(record);
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
      <EditListener onRef={editRef} rowsData={rows} />
      {/*<DeleteProperty*/}
      {/*  onRef={deleteRef}*/}
      {/*  otherExtensionList={otherExtensionList}*/}
      {/*  currentRow={currentRow}*/}
      {/*  rowsData={rows}*/}
      {/*  moddle={moddle}*/}
      {/*  modeling={modeling}*/}
      {/*  element={element}*/}
      {/*/>*/}
    </>
  );
}
