import React, { useEffect, useState } from 'react';
import { Space, Typography, Table } from 'antd';

import { Collapse } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import CreateSignalMessage from '@/bpmn/panel/signal-message/create/CreateSignalMessage';

const { Panel } = Collapse;

interface IProps {
  element: any;
  modeling: any;
  moddle: any;
  rootElements: any[];
}

export default function SignalMessage(props: IProps) {
  // props属性
  const { element, modeling, moddle, rootElements } = props;

  // setState属性
  const [businessObject, setBusinessObject] = useState<any>();
  const [signalRows, setSignalRows] = useState<Array<any>>([]);
  const [messageRows, setMessageRows] = useState<Array<any>>([]);

  useEffect(() => {
    // 初始化业务对象
    setBusinessObject(element?.businessObject);
  }, [JSON.stringify(element?.businessObject)]);

  useEffect(() => {
    initRows();
  }, [rootElements.toString()]);

  /**
   * 初始化行数据
   */
  function initRows() {
    let signalRows: any[] = [],
      messageRows: any[] = [];

    rootElements?.map((e, i) => {
      if (e.$type === 'bpmn:Message') {
        messageRows.push({
          key: messageRows.length,
          id: e.id,
          name: e.name,
        });
      } else if (e.$type === 'bpmn:Signal') {
        signalRows.push({
          key: signalRows.length,
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
      <Collapse bordered={false} expandIconPosition={'right'}>
        <Panel
          header={
            <Typography style={{ color: '#1890ff', fontWeight: 'bold' }}>
              <MessageOutlined />
              &nbsp;消息与信号
            </Typography>
          }
          key="1"
          style={{ backgroundColor: '#FFF' }}
          showArrow={true}
        >
          <Space direction="vertical" size={4} style={{ display: 'flex' }}>
            <CreateSignalMessage
              createType={'message'}
              rootElements={rootElements}
              moddle={moddle}
              modeling={modeling}
              reInitRows={initRows}
            />
            <Table
              columns={messageColumns}
              dataSource={messageRows}
              pagination={false}
              bordered
              size={'small'}
            />

            <CreateSignalMessage
              createType={'signal'}
              rootElements={rootElements}
              moddle={moddle}
              modeling={modeling}
              reInitRows={initRows}
            />
            <Table
              columns={signalColumns}
              dataSource={signalRows}
              pagination={false}
              bordered
              size={'small'}
            />
          </Space>
        </Panel>
      </Collapse>
    </>
  );
}
