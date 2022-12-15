import React, { useEffect } from 'react';
import { Form, Input, Select } from 'antd';
import {
  script_type,
  script_type_options,
} from '@/bpmn/panel/ElementListener/dataSelf';

const keyOptions = {
  scriptFormat: 'scriptFormat',
  scriptType: 'scriptType',
  script: 'script',
  resource: 'resource',
  resultVariable: 'resultVariable',
};

interface IProps {
  businessObject: any;
}

/**
 * 脚本任务 组件
 *
 * @param props
 * @constructor
 */
export default function ScriptTask(props: IProps) {
  // props
  const { businessObject } = props;
  // form
  const [form] = Form.useForm<{
    scriptFormat: string;
    scriptType: string;
    script: string;
    resource: string;
    resultVariable: string;
  }>();
  // watch
  const scriptType = Form.useWatch('scriptType', form);

  //初始化
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
      scriptFormat: businessObject?.scriptFormat,
      scriptType: businessObject?.resource
        ? script_type.externalResource
        : script_type.inlineScript,
      script: businessObject?.script,
      resource: businessObject?.resource,
    });
  }

  /**
   * 更新脚本任务组件
   */
  function updateScriptTask() {
    let taskAttr = Object.create(null);
    if (
      form.getFieldValue(keyOptions.scriptType) === script_type.inlineScript
    ) {
      taskAttr[keyOptions.script] = form.getFieldValue(keyOptions.script);
      taskAttr[keyOptions.resource] = undefined;
    } else {
      taskAttr[keyOptions.resource] = form.getFieldValue(keyOptions.resource);
      taskAttr[keyOptions.script] = undefined;
    }
    taskAttr[keyOptions.scriptFormat] = form.getFieldValue(
      keyOptions.scriptFormat,
    );
    taskAttr[keyOptions.resultVariable] = form.getFieldValue(
      keyOptions.resultVariable,
    );
    window.bpmnInstance.modeling.updateProperties(
      window.bpmnInstance.element,
      taskAttr,
    );
  }

  return (
    <>
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
        <Form.Item name="scriptFormat" label="脚本格式">
          <Input placeholder="请输入" onChange={updateScriptTask} />
        </Form.Item>
        <Form.Item name="scriptType" label="脚本类型">
          <Select onChange={updateScriptTask}>
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
          <Form.Item name="script" label="脚本内容">
            <Input.TextArea placeholder="请输入" onChange={updateScriptTask} />
          </Form.Item>
        )}
        {scriptType === script_type.externalResource && (
          <Form.Item name="resource" label="资源地址">
            <Input placeholder="请输入" onChange={updateScriptTask} />
          </Form.Item>
        )}
        <Form.Item name="resultVariable" label="结果变量">
          <Input placeholder="请输入" onChange={updateScriptTask} />
        </Form.Item>
      </Form>
    </>
  );
}
