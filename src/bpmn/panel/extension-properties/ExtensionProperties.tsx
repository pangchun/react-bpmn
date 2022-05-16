import React, { useEffect, useRef, useState } from 'react';
import { Button, Space, Typography, Table } from 'antd';
import { Collapse } from 'antd';
import { PlusOutlined, PlusSquareTwoTone } from '@ant-design/icons';
import EditProperty from '@/bpmn/panel/extension-properties/edit/EditProperty';
import DeleteProperty from '@/bpmn/panel/extension-properties/delete/DeleteProperty';
import { FLOWABLE_PREFIX } from '@/bpmn/constant/moddle-constant';

const { Panel } = Collapse;
const initialRows: any[] = [
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

interface IProps {
  element: any;
  modeling: any;
  bpmnFactory: any;
  moddle: any;
}

export default function ExtensionProperties(props: IProps) {
  // props属性
  const { element, modeling, bpmnFactory, moddle } = props;

  // setState属性
  const [businessObject, setBusinessObject] = useState<any>();
  const [rows, setRows] = useState(initialRows);
  const [currentRow, setCurrentRow] = useState<any>();
  const [otherExtensionList, setOtherExtensionList] = useState<Array<any>>([]);

  // ref
  const editRef = useRef<any>();
  const deleteRef = useRef<any>();

  useEffect(() => {
    // 初始化业务对象
    setBusinessObject(element?.businessObject);
    initRows();
    initOtherExtensionList();
  }, [JSON.stringify(element?.businessObject)]);

  /**
   * 初始化行数据
   */
  function initRows() {
    if (!element) {
      return [];
    }

    let initialRows: any[] = [];

    let properties: any[] =
      // element.businessObject?.extensionElements?.values?.at(0)?.values;
      element.businessObject?.extensionElements?.values?.find(
        (e: any) => e.$type === `${FLOWABLE_PREFIX}:Properties`,
      )?.values;
    properties?.map((e, i) => {
      initialRows.push({
        key: i,
        name: e.name,
        value: e.value,
      });
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
              setCurrentRow(record);
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
              editRef.current.showEditModal(123);
            }}
          >
            <PlusOutlined />
            <span style={{ marginLeft: 0 }}>添加属性</span>
          </Button>
        </Panel>
      </Collapse>

      {/* 弹窗组件 */}
      <EditProperty
        onRef={editRef}
        otherExtensionList={otherExtensionList}
        currentRow={currentRow}
        rowsData={rows}
        moddle={moddle}
        modeling={modeling}
        element={element}
        reFreshParent={() => initRows()}
      />
      <DeleteProperty
        onRef={deleteRef}
        otherExtensionList={otherExtensionList}
        currentRow={currentRow}
        rowsData={rows}
        moddle={moddle}
        modeling={modeling}
        element={element}
        reFreshParent={() => initRows()}
      />
    </>
  );
}
