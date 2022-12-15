import React, { useEffect } from 'react';
import { DatePicker, Form, Input, Select } from 'antd';
import {
  assignee_mock,
  candidateGroups_mock,
  candidateUsers_mock,
} from '@/bpmn/panel/ElementTask/mockData';
import moment from 'moment';

const keyOptions = {
  assignee: 'assignee',
  candidateUsers: 'candidateUsers',
  candidateGroups: 'candidateGroups',
  dueDate: 'dueDate',
  followUpDate: 'followUpDate',
  priority: 'priority',
};

interface IProps {
  businessObject: any;
}

/**
 * 用户任务 组件
 *
 * @param props
 * @constructor
 */
export default function UserTask(props: IProps) {
  // props
  const { businessObject } = props;
  // form
  const [form] = Form.useForm<{
    assignee: string;
    candidateUsers: string[];
    candidateGroups: string[];
    dueDate: moment.Moment;
    followUpDate: moment.Moment;
    priority: number;
  }>();

  // 初始化
  useEffect(() => {
    if (businessObject) {
      initPageData();
    }
  }, [businessObject?.id]);

  /**
   * 初始化页面数据
   */
  function initPageData() {
    form.setFieldsValue({
      assignee: businessObject?.assignee,
      candidateUsers: businessObject?.candidateUsers
        ? [businessObject.candidateUsers]
        : [],
      candidateGroups: businessObject?.candidateGroups
        ? [businessObject.candidateGroups]
        : [],
      dueDate: businessObject?.dueDate && moment(businessObject.dueDate, true),
      followUpDate:
        businessObject?.followUpDate &&
        moment(businessObject.followUpDate, true),
      priority: businessObject?.priority,
    });
  }

  /**
   * 更新用户任务
   *
   * @param key
   */
  function updateUserTask(key: string) {
    let values: any = form.getFieldsValue();
    const taskAttr = Object.create(null);
    if (
      key === keyOptions.candidateUsers ||
      key === keyOptions.candidateGroups
    ) {
      taskAttr[key] = values[key]?.join();
    } else if (key === keyOptions.dueDate || key === keyOptions.followUpDate) {
      taskAttr[key] = values[key]?.toISOString(true);
    } else {
      taskAttr[key] = values[key];
    }
    window.bpmnInstance.modeling.updateProperties(
      window.bpmnInstance.element,
      taskAttr,
    );
  }

  return (
    <>
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
        <Form.Item name="assignee" label="处理用户">
          <Select
            placeholder={'请选择'}
            onChange={() => updateUserTask(keyOptions.assignee)}
          >
            {assignee_mock.map((e) => {
              return (
                <Select.Option key={e.value} value={e.value}>
                  {e.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="candidateUsers" label="获选用户">
          <Select
            mode="multiple"
            placeholder={'请选择'}
            onChange={() => updateUserTask(keyOptions.candidateUsers)}
          >
            {candidateUsers_mock.map((e) => {
              return (
                <Select.Option key={e.value} value={e.value}>
                  {e.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="candidateGroups" label="获选分组">
          <Select
            mode="multiple"
            placeholder={'请选择'}
            onChange={() => updateUserTask(keyOptions.candidateGroups)}
          >
            {candidateGroups_mock.map((e) => {
              return (
                <Select.Option key={e.value} value={e.value}>
                  {e.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="dueDate" label="到期时间">
          <DatePicker
            placeholder={'请选择'}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placement={'topLeft'}
            style={{ width: '100%' }}
            onChange={() => updateUserTask(keyOptions.dueDate)}
          />
        </Form.Item>
        <Form.Item name="followUpDate" label="跟踪时间">
          <DatePicker
            placeholder={'请选择'}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placement={'topLeft'}
            style={{ width: '100%' }}
            onChange={() => updateUserTask(keyOptions.followUpDate)}
          />
        </Form.Item>
        <Form.Item name="priority" label="优先级">
          <Input
            placeholder={'数字越大，优先级越高'}
            maxLength={5}
            onChange={() => updateUserTask(keyOptions.priority)}
          />
        </Form.Item>
      </Form>
    </>
  );
}
