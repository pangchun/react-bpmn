import React, { useEffect, useState } from 'react';
import { Button, Input, Space, Switch, Typography } from 'antd';
import Title from 'antd/lib/typography/Title';

const { Text, Link } = Typography;

import { Collapse } from 'antd';
import { PushpinTwoTone, RightCircleTwoTone } from '@ant-design/icons';

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
            addonBefore={'版本标签'}
            placeholder="版本标签"
            style={{ marginTop: 4 }}
            key={businessObject?.versionTag}
            defaultValue={businessObject?.versionTag}
            onPressEnter={(event) => {
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
      <Collapse
        bordered={false}
        expandIconPosition={'right'}
        defaultActiveKey={['1']}
      >
        <Panel
          header={
            <Typography style={{ color: '#1890ff' }}>
              <PushpinTwoTone />
              &nbsp;常规
            </Typography>
          }
          key="1"
          style={{ backgroundColor: '#FFF' }}
          showArrow={true}
        >
          <Input
            size="small"
            addonBefore={'编号'}
            placeholder="编号"
            key={businessObject?.id}
            defaultValue={businessObject?.id}
            readOnly={businessObject?.$type === 'bpmn:Process'}
            onPressEnter={(event) => {
              updateId(event.currentTarget.value);
            }}
          />
          <Input
            size="small"
            addonBefore={'名称'}
            placeholder="名称"
            style={{ marginTop: 4 }}
            key={businessObject?.name}
            defaultValue={businessObject?.name}
            onPressEnter={(event) => {
              updateName(event.currentTarget.value);
            }}
            // onChange={(event) => {
            //   updateName(event.currentTarget.value);
            // }}
          />
          {renderProcessElement()}
        </Panel>
      </Collapse>
    </>
  );
}
