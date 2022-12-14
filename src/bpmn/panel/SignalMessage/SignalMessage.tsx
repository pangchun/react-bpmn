import React, { useEffect, useState } from 'react';
import { Empty, Space, Table } from 'antd';

import CreateSignalMessage from '@/bpmn/panel/SignalMessage/CreateSignalMessage/CreateSignalMessage';
interface IProps {
  businessObject: any;
}

/**
 * 消息与信号 组件
 *
 * @param props
 * @constructor
 */
export default function SignalMessage(props: IProps) {
  // props
  const { businessObject } = props;
  // state
  const [signalRows, setSignalRows] = useState<Array<any>>([]);
  const [messageRows, setMessageRows] = useState<Array<any>>([]);

  /**
   * 初始化
   */
  useEffect(() => {
    if (businessObject) {
      initRows();
    }
  }, [businessObject?.id]);

  /**
   * 初始化行数据
   */
  function initRows() {
    let signalRows: any[] = [],
      messageRows: any[] = [];
    window.bpmnInstance?.rootElements?.map((e) => {
      if (e.$type === 'bpmn:Message') {
        messageRows.push({
          key: messageRows.length + 1,
          id: e.id,
          name: e.name,
        });
      } else if (e.$type === 'bpmn:Signal') {
        signalRows.push({
          key: signalRows.length + 1,
          id: e.id,
          name: e.name,
        });
      }
    });
    setSignalRows(signalRows);
    setMessageRows(messageRows);
  }

  // 列
  const signalColumns = [
    {
      title: '序号',
      width: 40,
      dataIndex: 'key',
      key: 'key',
      render: (text: any) => text,
    },
    {
      title: '信号ID',
      width: 110,
      dataIndex: 'id',
      key: 'id',
      ellipsis: true,
    },
    {
      title: '信号名称',
      width: 110,
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
  ];

  const messageColumns = [
    {
      title: '序号',
      width: 40,
      dataIndex: 'key',
      key: 'key',
      render: (text: any) => text,
    },
    {
      title: '消息ID',
      width: 110,
      dataIndex: 'id',
      key: 'id',
      ellipsis: true,
    },
    {
      title: '消息名称',
      width: 110,
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
  ];

  return (
    <>
      <Space direction="vertical" size={4} style={{ display: 'flex' }}>
        <Table
          columns={messageColumns}
          dataSource={messageRows}
          pagination={false}
          bordered
          size={'small'}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={'暂无数据'}
              />
            ),
          }}
        />
        <CreateSignalMessage createType={'message'} initRows={initRows} />
        <Table
          columns={signalColumns}
          dataSource={signalRows}
          pagination={false}
          bordered
          style={{ marginTop: 30 }}
          size={'small'}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={'暂无数据'}
              />
            ),
          }}
        />
        <CreateSignalMessage createType={'signal'} initRows={initRows} />
      </Space>
    </>
  );
}
