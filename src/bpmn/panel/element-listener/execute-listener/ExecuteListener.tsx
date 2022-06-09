import React, { useEffect, useRef, useState } from 'react';
import { Button, Collapse, notification, Space, Table, Typography } from 'antd';
import { BellOutlined, PlusOutlined } from '@ant-design/icons';
import { FLOWABLE_PREFIX } from '@/bpmn/constant/moddle-constant';
import { encapsulateListener } from '@/bpmn/panel/element-listener/data-self';
import EditListener from '@/bpmn/panel/element-listener/execute-listener/edit/EditListener';
import { createListenerObject } from '@/bpmn/panel/element-listener/listener-util';
import { updateElementExtensions } from '@/bpmn/panel/utils/panel-util';

const { Panel } = Collapse;

interface IProps {
  businessObject: any;
}

export default function ExecuteListener(props: IProps) {
  // props属性
  const { businessObject } = props;

  // setState属性
  const [rows, setRows] = useState<Array<any>>([]);
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
    let businessObject: any =
      window.bpmnInstance?.element?.businessObject || props.businessObject;
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

  function createOrUpdate(options: any) {
    console.log(options);

    // 创建监听器对象
    let listener: any = Object.create(null);
    listener.id = null; // 只有任务监听器才需要设置id
    listener.event = options.eventType;
    listener.listenerType = options.listenerType;
    listener.expression = options.expression;
    listener.delegateExpression = options.delegateExpression;
    listener.class = options.javaClass;

    // 创建注入字段对象
    let fields: Array<any> = options.fields;
    if (fields && fields.length > 0) {
      fields = fields.map((el) => {
        return {
          name: el.fieldName,
          fieldType: el.fieldTypeValue,
          string: el.fieldValue,
          expression: el.fieldValue,
        };
      });
    }

    // 设置注入字段属性
    listener.fields = fields;
    // 设置脚本属性
    listener.scriptType = options.scriptType;
    listener.scriptFormat = options.scriptFormat;
    listener.value = options.scriptValue;
    listener.resource = options.resource;

    // 创建监听器实例
    let listenerObject = createListenerObject(listener, false, FLOWABLE_PREFIX);
    console.log(listenerObject);

    // 将监听器实例绑定到bpmn
    let newListenerExtensionList: Array<any> = [...listenerExtensionList];
    newListenerExtensionList.splice(
      options.key > 0 ? options.key - 1 : listenerExtensionList.length,
      1,
      listenerObject,
    );
    updateElementExtensions(
      window.bpmnInstance?.element,
      otherExtensionList.concat(newListenerExtensionList),
    );

    // 刷新表格
    initRows();
  }

  /**
   * 移除监听器
   * @param key
   */
  function remove(key: number) {
    // 将监听器实例绑定到bpmn
    let newListenerExtensionList: Array<any> = [...listenerExtensionList];
    newListenerExtensionList.splice(key - 1, 1);
    updateElementExtensions(
      window.bpmnInstance?.element,
      otherExtensionList.concat(newListenerExtensionList),
    );

    // 刷新表格
    initRows();

    // 提示通知
    notification.open({
      message: <span style={{ color: 'red' }}>监听器已删除</span>,
      placement: 'top',
      duration: 2,
      description: `已删除编号为 ${key} 的监听器`,
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
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
              editRef.current.showEditDrawer(record);
            }}
          >
            {'编辑'}
          </Button>
          <Button
            danger
            type="text"
            size={'small'}
            onClick={() => remove(record.key)}
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
              editRef.current.showEditDrawer();
            }}
          >
            <PlusOutlined />
            <span style={{ marginLeft: 0 }}>添加属性</span>
          </Button>
        </Panel>
      </Collapse>

      {/* 弹窗组件 */}
      <EditListener onRef={editRef} reFreshParent={createOrUpdate} />
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
