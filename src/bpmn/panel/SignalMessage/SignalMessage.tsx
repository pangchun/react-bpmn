import React, { useEffect, useState } from 'react';
import { Space, Typography, Table } from 'antd';

import { Collapse } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import CreateSignalMessage from '@/bpmn/panel/SignalMessage/CreateSignalMessage/CreateSignalMessage';

const { Panel } = Collapse;

interface IProps {
  businessObject: any;
}

export default function SignalMessage(props: IProps) {
  // props属性
  const { businessObject } = props;

  // setState属性
  const [signalRows, setSignalRows] = useState<Array<any>>([]);
  const [messageRows, setMessageRows] = useState<Array<any>>([]);

  useEffect(() => {
    initRows();
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

  const signalColumns = [
    {
      title: '序号',
      width: 40,
      dataIndex: 'key',
      key: 'key',
      render: (text: any) => <a>{text}</a>,
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
      render: (text: any) => <a>{text}</a>,
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
        <CreateSignalMessage createType={'message'} reInitRows={initRows} />
        <Table
          columns={messageColumns}
          dataSource={messageRows}
          pagination={false}
          bordered
          size={'small'}
        />

        <CreateSignalMessage createType={'signal'} reInitRows={initRows} />
        <Table
          columns={signalColumns}
          dataSource={signalRows}
          pagination={false}
          bordered
          size={'small'}
        />
      </Space>
    </>
  );
}
