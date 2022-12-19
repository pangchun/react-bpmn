import React, { useEffect } from 'react';
import { Form, Input, Select } from 'antd';
import {
  condition_type,
  condition_type_options,
  flow_type,
  flow_type_options,
  script_type,
  script_type_options,
} from '@/bpmn/panel/FlowCondition/dataSelf';
import { useWatch } from 'antd/es/form/Form';

interface IProps {
  businessObject: any;
}

/**
 * 流转条件 组件
 *
 * @param props
 * @constructor
 */
export default function FlowCondition(props: IProps) {
  // props
  const { businessObject } = props;
  // form
  const [form] = Form.useForm<{
    flowType: string;
    conditionType: string;
    expression: string;
    language: string;
    scriptType: string;
    script: string;
    resource: string;
  }>();
  // watch
  let flowType = useWatch('flowType', form);
  let conditionType = useWatch('conditionType', form);
  let scriptType = useWatch('scriptType', form);

  /**
   * 初始化
   */
  useEffect(() => {
    if (businessObject) {
      initPageData();
    }
  }, [businessObject?.id, businessObject?.conditionExpression]);

  /**
   * 初始化页面数据
   */
  function initPageData() {
    let element = window.bpmnInstance.element;
    let elementSourceRef = element.businessObject.sourceRef;
    // 获取流转类型
    let flowConditionForm: any = Object.create(null);
    if (
      elementSourceRef &&
      elementSourceRef.default &&
      elementSourceRef.default.id === element.id
    ) {
      // 默认
      flowConditionForm.type = flow_type.defaultFlow;
    } else if (!element.businessObject.conditionExpression) {
      // 普通
      flowConditionForm.type = flow_type.normalFlow;
    } else {
      // 条件
      const conditionExpression = element.businessObject.conditionExpression;
      flowConditionForm = {
        ...conditionExpression,
        type: flow_type.conditionalFlow,
      };
      if (flowConditionForm.resource) {
        flowConditionForm.conditionType = condition_type.script;
        flowConditionForm.scriptType = script_type.externalResource;
      } else if (conditionExpression.language) {
        flowConditionForm.conditionType = condition_type.script;
        flowConditionForm.scriptType = script_type.inlineScript;
      } else {
        flowConditionForm.conditionType = condition_type.expression;
      }
    }
    // 初始化表单数据
    form.setFieldsValue({
      flowType: flowConditionForm?.type,
      conditionType: flowConditionForm?.conditionType,
      expression: flowConditionForm?.body,
      language: flowConditionForm?.language,
      scriptType: flowConditionForm?.scriptType,
      script: flowConditionForm?.body,
      resource: flowConditionForm?.resource,
    });
  }

  /**
   * 更新流转类型
   *
   * @param value
   */
  function updateFlowType(value: string) {
    let element = window.bpmnInstance.element;
    let elementSource = element.source;
    let elementSourceRef = element.businessObject.sourceRef;
    // 默认流转路径
    if (value === flow_type.defaultFlow) {
      window.bpmnInstance.modeling.updateProperties(element, {
        conditionExpression: undefined,
      });
      window.bpmnInstance.modeling.updateProperties(elementSource, {
        default: element,
      });
      return;
    }
    // 条件流转路径
    if (value === flow_type.conditionalFlow) {
      let flowConditionRef = window.bpmnInstance.moddle.create(
        'bpmn:FormalExpression',
      );
      window.bpmnInstance.modeling.updateProperties(element, {
        conditionExpression: flowConditionRef,
      });
      return;
    }
    // 普通流转路径
    if (value === flow_type.normalFlow) {
      // 正常路径，如果来源节点的默认路径是当前连线时，清除父元素的默认路径配置
      if (
        elementSourceRef.default &&
        elementSourceRef.default.id === element.id
      ) {
        window.bpmnInstance.modeling.updateProperties(elementSource, {
          default: null,
        });
      }
      window.bpmnInstance.modeling.updateProperties(element, {
        conditionExpression: undefined,
      });
    }
  }

  /**
   * 更新流转条件
   */
  function updateFlowCondition() {
    // 获取表单字段
    let fieldsValue = form.getFieldsValue([
      'flowType',
      'conditionType',
      'expression',
      'language',
      'scriptType',
      'script',
      'resource',
    ]);
    // 更新流转条件
    let condition;
    if (fieldsValue.conditionType === condition_type.expression) {
      condition = window.bpmnInstance.moddle.create('bpmn:FormalExpression', {
        body: fieldsValue.expression,
      });
    } else {
      if (fieldsValue.scriptType === script_type.inlineScript) {
        condition = window.bpmnInstance.moddle.create('bpmn:FormalExpression', {
          body: fieldsValue.script,
          language: fieldsValue.language,
        });
      } else {
        condition = window.bpmnInstance.moddle.create('bpmn:FormalExpression', {
          resource: fieldsValue.resource,
          language: fieldsValue.language,
        });
      }
    }
    // 开始更新
    let element = window.bpmnInstance.element;
    window.bpmnInstance.modeling.updateProperties(element, {
      conditionExpression: condition,
    });
  }

  /**
   * 渲染Process节点独有组件 (版本标签、是否可执行)
   */
  function renderConditionFlowForm() {
    if (flowType === flow_type.conditionalFlow) {
      return (
        <>
          <Form.Item name="conditionType" label="条件格式">
            <Select placeholder={'请选择'} onChange={updateFlowCondition}>
              {condition_type_options.map((e) => {
                return (
                  <Select.Option key={e.value} value={e.value}>
                    {e.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          {conditionType === condition_type.expression && (
            <Form.Item label="表达式" name="expression">
              <Input placeholder={'请输入'} onChange={updateFlowCondition} />
            </Form.Item>
          )}
          {conditionType === condition_type.script && (
            <>
              <Form.Item label="脚本语言" name="language">
                <Input placeholder={'请输入'} onChange={updateFlowCondition} />
              </Form.Item>
              <Form.Item name="scriptType" label="脚本类型">
                <Select placeholder={'请选择'} onChange={updateFlowCondition}>
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
                <Form.Item label="脚本" name="script">
                  <Input
                    placeholder={'请输入'}
                    onChange={updateFlowCondition}
                  />
                </Form.Item>
              )}
              {scriptType === script_type.externalResource && (
                <Form.Item label="资源地址" name="resource">
                  <Input
                    placeholder={'请输入'}
                    onChange={updateFlowCondition}
                  />
                </Form.Item>
              )}
            </>
          )}
        </>
      );
    }
  }

  return (
    <>
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
        <Form.Item name="flowType" label="流转类型">
          <Select
            placeholder={'请选择'}
            onChange={(value) => {
              updateFlowType(value);
            }}
          >
            {flow_type_options.map((e) => {
              return (
                <Select.Option key={e.value} value={e.value}>
                  {e.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        {renderConditionFlowForm()}
      </Form>
    </>
  );
}
