import React, { useEffect } from 'react';
import { Button, Input, Space, Switch, Typography } from 'antd';
import Title from 'antd/lib/typography/Title';

const { Text, Link } = Typography;

import { Collapse } from 'antd';

const { Panel } = Collapse;

function callback(key: any) {
  console.log(key);
}

interface IProps {
  element: any;
}
export default function ElementBaseInfo(props: IProps) {
  const { element } = props;

  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

  useEffect(() => {
    console.log('element in base \n', element);
  }, [element]);

  return (
    <>
      <Collapse bordered={false} defaultActiveKey={['1']} onChange={callback}>
        <Panel header="常规" key="1">
          <Input size="small" placeholder="编号" />
          <Input size="small" placeholder="名称" style={{ marginTop: 4 }} />
          <Input size="small" placeholder="版本标签" style={{ marginTop: 4 }} />
          <Typography style={{ marginTop: 10 }}>
            可执行{' '}
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              defaultChecked
            />
          </Typography>
        </Panel>
        <Panel header="测试" key="2">
          <p>{text}</p>
        </Panel>
      </Collapse>
    </>
  );
}
