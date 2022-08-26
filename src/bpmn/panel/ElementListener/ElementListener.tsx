import React, { useEffect, useRef, useState } from 'react';
import { Button, Collapse, notification, Space, Table, Typography } from 'antd';
import { BellOutlined, PlusOutlined } from '@ant-design/icons';
import { FLOWABLE_PREFIX } from '@/bpmn/constant/constants';
import { encapsulateListener } from '@/bpmn/panel/ElementListener/data-self';
import EditListener from '@/bpmn/panel/ElementListener/EditListener/EditListener';
import { createListenerObject } from '@/bpmn/panel/ElementListener/listener-util';
import { updateElementExtensions } from '@/bpmn/util/panelUtil';

const { Panel } = Collapse;

interface IProps {
  businessObject: any;
  isTask: boolean;
}

export default function ElementListener(props: IProps) {
  // props属性
  const { businessObject, isTask } = props;

  // setState属性
  const [rows, setRows] = useState<Array<any>>([]);
  const [listenerExtensionList, setListenerExtensionList] = useState<
    Array<any>
  >([]);

  // ref
  const editRef = useRef<any>();

  useEffect(() => {
    initRows();
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
    // 获取监听器
    let rows: any[];
    let listeners: any[] =
      businessObject.extensionElements?.values?.filter((e: any) => {
        return (
          e.$type ===
          `${FLOWABLE_PREFIX}:${isTask ? 'TaskListener' : 'ExecutionListener'}`
        );
      }) || [];
    setListenerExtensionList(listeners);
    // 初始化行数据源
    rows = listeners?.map((e, i) => {
      let listener = encapsulateListener(e);
      return {
        key: i + 1,
        eventType: listener.eventType.name,
        eventId: listener.id,
        listenerType: listener.listenerType.name,
        protoListener: listener,
      };
    });
    setRows(rows);
  }

  /**
   * 获取其它类型扩展元素
   */
  function getOtherExtensionList() {
    let otherExtensionList: Array<any> =
      window.bpmnInstance?.element?.businessObject?.extensionElements?.values?.filter(
        (e: any) => {
          return (
            e.$type !==
            `${FLOWABLE_PREFIX}:${
              isTask ? 'TaskListener' : 'ExecutionListener'
            }`
          );
        },
      ) || [];
    return otherExtensionList;
  }

  function createOrUpdate(options: any) {
    // 创建监听器对象
    let listener: any = Object.create(null);
    listener.id = options.eventId; // 只有任务监听器才需要设置事件id
    listener.event = options.eventType;
    listener.listenerType = options.listenerType;
    listener.expression = options.expression;
    listener.delegateExpression = options.delegateExpression;
    listener.class = options.javaClass;
    // 设置定时器属性
    listener.timerType = options.timerType;
    listener.timerValue = options.timerValue;
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
    let listenerObject = createListenerObject(
      listener,
      isTask,
      FLOWABLE_PREFIX,
    );
    // 将监听器实例绑定到bpmn
    let newListenerExtensionList: Array<any> = [...listenerExtensionList];
    newListenerExtensionList.splice(
      options.rowKey > 0 ? options.rowKey - 1 : listenerExtensionList.length,
      1,
      listenerObject,
    );
    updateElementExtensions(
      getOtherExtensionList().concat(newListenerExtensionList),
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
      getOtherExtensionList().concat(newListenerExtensionList),
    );
    // 刷新表格
    initRows();
    // 提示通知
    notification.open({
      message: <span style={{ color: 'red' }}>监听器已删除</span>,
      placement: 'top',
      duration: 2,
      description: `已删除编号为 ${key} 的监听器`,
    });
  }

  // todo 需要把这个数组优化，太过于臃肿
  const columns = isTask
    ? [
        {
          title: '序号',
          width: 40,
          dataIndex: 'key',
          key: 'key',
          render: (text: any) => <a>{text}</a>,
        },
        {
          title: '事件类型',
          width: 80,
          dataIndex: 'eventType',
          key: 'eventType',
          ellipsis: true,
        },
        {
          title: '事件id',
          width: 80,
          dataIndex: 'eventId',
          key: 'eventId',
          ellipsis: true,
        },
        {
          title: '监听器类型',
          width: 80,
          dataIndex: 'listenerType',
          key: 'listenerType',
          ellipsis: true,
        },
        {
          title: '操作',
          width: 90,
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
      ]
    : [
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

      {/* 弹窗组件 */}
      <EditListener
        onRef={editRef}
        isTask={isTask}
        reFreshParent={createOrUpdate}
      />
    </>
  );
}
