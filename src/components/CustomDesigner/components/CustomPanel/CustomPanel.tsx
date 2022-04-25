import React, { useEffect, useState } from 'react';
import { Button, Input, Space, Typography } from 'antd';
import Title from 'antd/lib/typography/Title';

/**
 * 接口检查
 */
interface IProps {
  name?: 'CustomPanel';
  modeler: any;
}

export default function CustomPanel(props: IProps) {
  const { name, modeler } = props;

  const [selectedElements, setSelectedElements] = useState([]);
  const [element, setElement] = useState<any>();

  let modeling: any = null;

  useEffect(() => {
    init();
    if (modeler !== undefined) {
      modeling = modeler.get('modeling', true);
    }
  }, [modeler]);

  function init() {
    modeler?.on('selection.changed', (e: any) => {
      setSelectedElements(e.newSelection);
      setElement(e.newSelection[0]);
    });
  }

  function setValue(value: any) {
    modeling = modeler.get('modeling', true);
    return modeling.updateProperties(element, {
      id: value,
      name: '这是我的自定义name',
      customAttr: '这是我的自定义属性',
    });
  }

  return (
    <>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Title level={1}>{element?.type || '属性面板'}</Title>
        <Input
          size="large"
          placeholder="请输入id"
          onChange={() => {
            setValue('自定义的id');
          }}
        />
        <Button>{'打印当前节点信息'}</Button>
      </Space>
    </>
  );
}
