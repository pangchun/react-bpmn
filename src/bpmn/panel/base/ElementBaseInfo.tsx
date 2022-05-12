import React, { useEffect, useState } from 'react';
import { Input, message, Switch, Typography } from 'antd';
import { Collapse } from 'antd';
import { PushpinTwoTone } from '@ant-design/icons';

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
  }, [element]);

  /**
   * 更新id
   */
  function updateId(value: string) {
    // 如果新值与旧值相同，则不更新
    const oldValue: string = element?.businessObject?.id || '';
    if (oldValue === value) {
      return;
    }
    modeling.updateProperties(element, {
      id: value,
    });
    message.success('【编号】已修改').then((r) => {});
  }

  /**
   * 更新name
   */
  function updateName(value: string) {
    // 如果新值与旧值相同，则不更新
    const oldValue: string = element?.businessObject?.name || '';
    if (oldValue === value) {
      return;
    }
    modeling.updateProperties(element, {
      name: value,
    });
    message.success('【名称】已修改').then((r) => {});
  }

  /**
   * 更新versionTag
   */
  function updateVersionTag(value: string) {
    // 如果新值与旧值相同，则不更新
    const oldValue: string = element?.businessObject?.versionTag || '';
    if (oldValue === value) {
      return;
    }
    modeling.updateProperties(element, {
      versionTag: value,
    });
    message.success('【版本标签】已修改').then((r) => {});
  }

  /**
   * 更新isExecutable
   */
  function updateIsExecutable(value: boolean) {
    modeling.updateProperties(element, {
      isExecutable: value,
    });
    message.success('【可执行状态】已切换').then((r) => {});
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
            value={businessObject?.versionTag}
            onPressEnter={(event) => {
              updateVersionTag(event.currentTarget.value);
            }}
            onBlur={(event) => {
              updateVersionTag(event.currentTarget.value);
            }}
            onChange={(event) => {
              setBusinessObject({
                ...businessObject,
                versionTag: event.target.value,
              });
            }}
          />
          <Typography style={{ marginTop: 10 }}>
            可执行&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              checked={businessObject?.isExecutable}
              onChange={(checked) => {
                setBusinessObject({ ...businessObject, isExecutable: checked });
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
            <Typography style={{ color: '#1890ff', fontWeight: 'bold' }}>
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
            value={businessObject?.id}
            readOnly={businessObject?.$type === 'bpmn:Process'}
            onPressEnter={(event) => {
              updateId(event.currentTarget.value);
            }}
            onBlur={(event) => {
              updateId(event.currentTarget.value);
            }}
            onChange={(event) => {
              setBusinessObject({ ...businessObject, id: event.target.value });
            }}
          />
          <Input
            size="small"
            addonBefore={'名称'}
            placeholder="名称"
            style={{ marginTop: 4 }}
            value={businessObject?.name}
            onPressEnter={(event) => {
              updateName(event.currentTarget.value);
            }}
            onBlur={(event) => {
              updateName(event.currentTarget.value);
            }}
            onChange={(event) => {
              setBusinessObject({
                ...businessObject,
                name: event.target.value,
              });
            }}
          />
          {renderProcessElement()}
        </Panel>
      </Collapse>
    </>
  );
}
