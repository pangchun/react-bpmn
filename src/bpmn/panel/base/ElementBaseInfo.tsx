import React, { useEffect, useState } from 'react';
import { Button, Input, Space, Switch, Typography } from 'antd';
import Title from 'antd/lib/typography/Title';

const { Text, Link } = Typography;

import { Collapse } from 'antd';

const { Panel } = Collapse;

interface IProps {
  element: any;
  modeling: any;
}

export default function ElementBaseInfo(props: IProps) {
  // props属性
  const { element, modeling } = props;

  // setState属性
  const [businessObject, setBusinessObject] = useState<any>();

  useEffect(() => {
    setBusinessObject(element?.businessObject);
    console.log('element in base \n', element);
  }, [element]);

  /**
   * 更新id
   */
  function updateId(value: any) {
    return modeling.updateProperties(element, {
      id: value,
      name: '这是我的自定义name',
      customAttr: '这是我的自定义属性',
    });
  }

  /**
   * 更新组件值
   * @param value
   */
  function setValue(value: any) {
    // modeling = modeler.get('modeling', true);
    return modeling.updateProperties(element, {
      id: value,
      name: '这是我的自定义name',
      customAttr: '这是我的自定义属性',
    });
  }

  return (
    <>
      <Collapse bordered={false}>
        <Panel header="常规" key="1">
          <Input
            size="small"
            placeholder="编号"
            key={businessObject?.id}
            defaultValue={businessObject?.id}
            // onChange={(event) => {
            //   updateId(event.target.value)
            // }}
            onCompositionEnd={(event) => {
              console.log(event.currentTarget.value);
              updateId(event.currentTarget.value);
            }}
          />
          <Input
            size="small"
            placeholder="名称"
            style={{ marginTop: 4 }}
            key={businessObject?.name}
            defaultValue={businessObject?.name}
          />
          <Input
            size="small"
            placeholder="版本标签"
            style={{ marginTop: 4 }}
            key={businessObject?.versionTag}
            defaultValue={businessObject?.versionTag}
          />
          <Typography style={{ marginTop: 10 }}>
            可执行&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              key={businessObject?.isExecutable}
              defaultChecked={businessObject?.isExecutable}
              onChange={() => {}}
            />
          </Typography>
        </Panel>
        <Panel header="测试" key="2">
          <p>测试数据</p>
        </Panel>
      </Collapse>
    </>
  );
}