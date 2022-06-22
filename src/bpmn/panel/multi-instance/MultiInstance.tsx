import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  Form,
  Input,
  message,
  Select,
  Space,
  Switch,
  Typography,
} from 'antd';
import { Collapse } from 'antd';
import { PushpinTwoTone } from '@ant-design/icons';
import { useInterval } from 'ahooks';
import { useWatch } from 'antd/es/form/Form';
import UserTask from '@/bpmn/panel/task/task-components/UserTask';
import ReceiveTask from '@/bpmn/panel/task/task-components/ReceiveTask';
import ScriptTask from '@/bpmn/panel/task/task-components/ScriptTask';
import { assignee_mock } from '@/bpmn/panel/task/mock-data';
import {
  loop_characteristics_type,
  loop_characteristics_type_options,
} from '@/bpmn/panel/multi-instance/data-self';

const { Panel } = Collapse;

interface IProps {
  businessObject: any;
}

export default function MultiInstance(props: IProps) {
  // props属性
  const { businessObject } = props;

  // 其它属性
  const [form] = Form.useForm<{
    loopCharacteristics: string;
    loopCardinality: string;
    collection: string;
    elementVariable: string;
    completionCondition: string;
    // asyncBefore: boolean;
    // asyncAfter: boolean;
    // exclusive: boolean;
    // timeCycle: string;
  }>();
  const [form2] = Form.useForm<{
    asyncBefore: boolean;
    asyncAfter: boolean;
    exclusive: boolean;
    // timeCycle: string;
  }>();
  const [form3] = Form.useForm<{
    timeCycle: string;
  }>();

  // 字段监听
  const loopCharacteristics = Form.useWatch('loopCharacteristics', form);
  const asyncBefore = Form.useWatch('asyncBefore', form2);
  const asyncAfter = Form.useWatch('asyncAfter', form2);

  useEffect(() => {
    initPageData();
  }, [businessObject?.id]);

  function initPageData() {
    form.setFieldsValue({
      loopCharacteristics: undefined,
      loopCardinality: undefined,
      collection: undefined,
      elementVariable: undefined,
      completionCondition: undefined,
      // asyncBefore: false,
      // asyncAfter: false,
      // exclusive: false,
      // timeCycle: undefined,
    });
    form2.setFieldsValue({
      asyncBefore: false,
      asyncAfter: false,
      exclusive: false,
      // timeCycle: undefined,
    });
    form3.setFieldsValue({
      timeCycle: undefined,
    });
  }

  function updateTaskAsync() {}

  function renderMultiInstanceForm() {
    return (
      <>
        <Form.Item name="loopCardinality" label="循环基数">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item name="collection" label="集合">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item name="elementVariable" label="元素变量">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item name="completionCondition" label="完成条件">
          <Input placeholder="请输入" />
        </Form.Item>
      </>
    );
  }

  function renderAsyncStatusForm() {
    return (
      <>
        <Form form={form2} layout="inline">
          <Form.Item
            label={'异步状态'}
            name="asyncBefore"
            valuePropName="checked"
            style={{ marginLeft: 22, marginBottom: 20 }}
          >
            <Checkbox style={{ marginLeft: 5 }} onChange={updateTaskAsync}>
              异步前
            </Checkbox>
          </Form.Item>
          <Form.Item name="asyncAfter" valuePropName="checked">
            <Checkbox onChange={updateTaskAsync}>异步后</Checkbox>
          </Form.Item>
          {(asyncBefore || asyncAfter) && (
            <Form.Item name="exclusive" valuePropName="checked">
              <Checkbox onChange={updateTaskAsync}>是否排除</Checkbox>
            </Form.Item>
          )}
        </Form>
        {(asyncBefore || asyncAfter) && (
          <Form form={form3} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
            <Form.Item name="timeCycle" label="重试周期">
              <Input placeholder="请输入" />
            </Form.Item>
          </Form>
        )}
      </>
    );
  }

  return (
    <>
      <Collapse bordered={false} expandIconPosition={'right'}>
        <Panel
          header={
            <Typography style={{ color: '#1890ff', fontWeight: 'bold' }}>
              <PushpinTwoTone />
              &nbsp;多实例
            </Typography>
          }
          key="1"
          style={{ backgroundColor: '#FFF' }}
          showArrow={true}
        >
          <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
            <Form.Item name="loopCharacteristics" label="回路特性">
              <Select
                placeholder={'请选择'}
                onChange={(value, option) => {
                  console.log(value);
                }}
              >
                {loop_characteristics_type_options.map((e) => {
                  return (
                    <Select.Option key={e.value} value={e.value}>
                      {e.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            {(loopCharacteristics ===
              loop_characteristics_type.parallelMultiInstance ||
              loopCharacteristics ===
                loop_characteristics_type.sequentialMultiInstance) &&
              renderMultiInstanceForm()}
          </Form>
          {(loopCharacteristics ===
            loop_characteristics_type.parallelMultiInstance ||
            loopCharacteristics ===
              loop_characteristics_type.sequentialMultiInstance) &&
            renderAsyncStatusForm()}
        </Panel>
      </Collapse>
    </>
  );
}
