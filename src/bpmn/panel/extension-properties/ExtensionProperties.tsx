import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Form,
  Input,
  message,
  Space,
  Switch,
  Typography,
  Table,
  Tag,
} from 'antd';
import Title from 'antd/lib/typography/Title';

const { Text, Link } = Typography;

import { Collapse } from 'antd';
import {
  PaperClipOutlined,
  PlusOutlined,
  PlusSquareTwoTone,
  PushpinTwoTone,
  RightCircleTwoTone,
} from '@ant-design/icons';
import EditProperty from '@/bpmn/panel/extension-properties/edit/EditProperty';

const { Panel } = Collapse;

const { TextArea } = Input;

interface IProps {
  element: any;
  modeling: any;
  bpmnFactory: any;
}

export default function ExtensionProperties(props: IProps) {
  // props属性
  const { element, modeling, bpmnFactory } = props;

  // setState属性
  const [businessObject, setBusinessObject] = useState<any>();

  // ref
  const editRef = useRef<any>();

  useEffect(() => {
    setBusinessObject(element?.businessObject);
    console.log('element in other \n', element);
  }, [element]);

  const data = [
    // 此处的key不能省略，否则控制台报错
    {
      key: '1',
      name: '属性名A',
      value: '属性值A',
    },
    {
      key: '2',
      name: '属性名B',
      value: '属性值B',
    },
  ];

  const columns = [
    {
      title: '序号',
      width: 40,
      dataIndex: 'key',
      key: 'key',
      render: (text: any) => <a>{text}</a>,
    },
    {
      title: '属性名',
      width: 110,
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '属性值',
      width: 110,
      dataIndex: 'value',
      key: 'value',
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
              editRef.current.showEditModal();
            }}
          >
            {'编辑'}
          </Button>
          <Button
            danger
            type="text"
            size={'small'}
            onClick={() => {
              console.log('');
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
              <PlusSquareTwoTone />
              &nbsp;扩展属性
            </Typography>
          }
          key="1"
          style={{ backgroundColor: '#FFF' }}
          showArrow={true}
        >
          <Table
            columns={columns}
            dataSource={data}
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
              editRef.current.showEditModal();
            }}
          >
            <PlusOutlined />
            <span style={{ marginLeft: 0 }}>添加属性</span>
          </Button>
        </Panel>
      </Collapse>

      {/* 弹窗组件 */}
      <EditProperty onRef={editRef} />
    </>
  );
}
