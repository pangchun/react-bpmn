import React, { useEffect } from 'react';
import { DatePicker, Form, Input, Select } from 'antd';
import {
  assignee_mock,
  candidateGroups_mock,
  candidateUsers_mock,
} from '@/bpmn/panel/task/mock-data';
import moment from 'moment';
import {
  script_type,
  script_type_options,
} from '@/bpmn/panel/element-listener/data-self';

const keyOptions = {
  scriptFormat: '',
  scriptType: '',
  scriptValue: '',
  resource: '',
  resultVariable: '',
};

interface IProps {
  businessObject: any;
}

export default function ScriptTask(props: IProps) {
  // props属性
  const { businessObject } = props;

  // 其它属性
  const [form] = Form.useForm<{
    scriptFormat: string;
    scriptType: string;
    scriptValue: string;
    resource: string;
    resultVariable: string;
  }>();

  // watch
  const scriptType = Form.useWatch('scriptType', form);

  useEffect(() => {
    initPageData();
  }, [businessObject?.id]);

  function initPageData() {
    form.setFieldsValue({
      scriptFormat: businessObject?.scriptFormat,
      scriptType: businessObject?.script
        ? script_type.inlineScript
        : script_type.externalResource,
      scriptValue: businessObject?.script,
      resource: businessObject?.resource,
    });
  }

  function updateScriptTask(key: string) {
    let values: any = form.getFieldsValue();
    let taskAttr = Object.create(null);
    if (key === keyOptions.scriptValue || key === keyOptions.resource) {
      // 先重置再设置值
      taskAttr[keyOptions.scriptValue] = null;
      taskAttr[keyOptions.resource] = null;
      taskAttr[key] = values[key];
    } else if (
      key === keyOptions.scriptFormat ||
      key === keyOptions.resultVariable
    ) {
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
        <Form.Item name="scriptFormat" label="脚本格式">
          <Input
            placeholder="请输入"
            onChange={() => updateScriptTask(keyOptions.scriptFormat)}
          />
        </Form.Item>
        <Form.Item name="scriptType" label="脚本类型">
          <Select>
            {script_type_options.map((e) => {
              return (
                <Select.Option key={e.value} value={e.value}>
                  {e.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        {scriptType === script_type.inlineScript && (
          <Form.Item name="scriptValue" label="脚本内容">
            <Input.TextArea
              placeholder="请输入"
              onChange={() => updateScriptTask(keyOptions.scriptValue)}
            />
          </Form.Item>
        )}
        {scriptType === script_type.externalResource && (
          <Form.Item name="resource" label="资源地址">
            <Input
              placeholder="请输入"
              onChange={() => updateScriptTask(keyOptions.resource)}
            />
          </Form.Item>
        )}
        <Form.Item name="resultVariable" label="结果变量">
          <Input
            placeholder="请输入"
            onChange={() => updateScriptTask(keyOptions.resultVariable)}
          />
        </Form.Item>
      </Form>
    </>
  );
}
