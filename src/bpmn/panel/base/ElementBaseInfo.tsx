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
  function updateId(value: string) {
    return modeling.updateProperties(element, {
      id: value,
    });
  }

  /**
   * 更新name
   */
  function updateName(value: string) {
    return modeling.updateProperties(element, {
      name: value,
    });
  }

  /**
   * 更新versionTag
   */
  function updateVersionTag(value: string) {
    return modeling.updateProperties(element, {
      versionTag: value,
    });
  }

  /**
   * 更新isExecutable
   */
  function updateIsExecutable(value: boolean) {
    return modeling.updateProperties(element, {
      isExecutable: value,
    });
  }

  /**
   * 渲染process独有元素
   */
  function renderProcessElement() {
    if (element?.type === 'bpmn:Process') {
      return (
        <>
          <Input
            size="small"
            placeholder="版本标签"
            style={{ marginTop: 4 }}
            key={businessObject?.versionTag}
            defaultValue={businessObject?.versionTag}
            onCompositionEnd={(event) => {
              updateVersionTag(event.currentTarget.value);
            }}
          />
          <Typography style={{ marginTop: 10 }}>
            可执行&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              key={businessObject?.isExecutable}
              defaultChecked={businessObject?.isExecutable}
              onChange={(checked) => {
                updateIsExecutable(checked);
              }}
            />
          </Typography>
        </>
      );
    }
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
            readOnly={businessObject?.$type === 'bpmn:Process'}
            onCompositionEnd={(event) => {
              updateId(event.currentTarget.value);
            }}
          />
          <Input
            size="small"
            placeholder="名称"
            style={{ marginTop: 4 }}
            key={businessObject?.name}
            defaultValue={businessObject?.name}
            onCompositionEnd={(event) => {
              updateName(event.currentTarget.value);
            }}
          />
          {renderProcessElement()}
        </Panel>
        {/*<Panel header="测试" key="2">*/}
        {/*  <p>测试数据</p>*/}
        {/*</Panel>*/}
      </Collapse>
    </>
  );
}
