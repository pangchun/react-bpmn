import React, { useEffect } from 'react';
import { Checkbox, Form, Input, Select } from 'antd';
import {
  loop_characteristics_type,
  loop_characteristics_type_options,
} from '@/bpmn/panel/MultiInstance/dataSelf';
import { FLOWABLE_PREFIX } from '@/bpmn/constant/constants';

const keyOptions = {
  collection: 'collection',
  elementVariable: 'elementVariable',
  asyncBefore: 'asyncBefore',
  asyncAfter: 'asyncAfter',
};

interface IProps {
  businessObject: any;
}

/**
 * 多实例 组件
 *
 * @param props
 * @constructor
 */
export default function MultiInstance(props: IProps) {
  // props
  const { businessObject } = props;
  // form
  const [multiInstanceForm] = Form.useForm<{
    loopCharacteristics: string;
    loopCardinality: string;
    collection: string;
    elementVariable: string;
    completionCondition: string;
  }>();
  const [asyncStatusForm] = Form.useForm<{
    asyncBefore: boolean;
    asyncAfter: boolean;
    exclusive: boolean;
  }>();
  const [timeCycleForm] = Form.useForm<{
    timeCycle: string;
  }>();
  // 字段监听
  const loopCharacteristics = Form.useWatch(
    'loopCharacteristics',
    multiInstanceForm,
  );
  const asyncBefore = Form.useWatch('asyncBefore', asyncStatusForm);
  const asyncAfter = Form.useWatch('asyncAfter', asyncStatusForm);

  /**
   * 初始化
   */
  useEffect(() => {
    if (businessObject) {
      initPageData();
    }
  }, [businessObject?.id]);

  /**
   * 初始化页面数据
   */
  function initPageData() {
    /**
     * 初始化回路特性
     */
    function initLoopCharacteristics() {
      if (!businessObject?.loopCharacteristics) {
        return undefined;
      } else if (
        businessObject?.loopCharacteristics?.$type ===
        'bpmn:StandardLoopCharacteristics'
      ) {
        return loop_characteristics_type.standardLoop;
      } else if (businessObject?.loopCharacteristics?.isSequential) {
        return loop_characteristics_type.sequentialMultiInstance;
      } else {
        return loop_characteristics_type.parallelMultiInstance;
      }
    }

    multiInstanceForm.setFieldsValue({
      loopCharacteristics: initLoopCharacteristics(),
      loopCardinality:
        businessObject?.loopCharacteristics?.loopCardinality?.body,
      collection: businessObject?.loopCharacteristics?.collection,
      elementVariable: businessObject?.loopCharacteristics?.elementVariable,
      completionCondition:
        businessObject?.loopCharacteristics?.completionCondition?.body,
    });
    asyncStatusForm.setFieldsValue({
      asyncBefore: businessObject?.loopCharacteristics?.asyncBefore,
      asyncAfter: businessObject?.loopCharacteristics?.asyncAfter,
      exclusive: businessObject?.loopCharacteristics?.exclusive,
    });
    if (
      asyncStatusForm.getFieldValue('asyncBefore') ||
      asyncStatusForm.getFieldValue('asyncAfter')
    ) {
      timeCycleForm.setFieldsValue({
        timeCycle:
          businessObject?.loopCharacteristics?.extensionElements?.values[0]
            ?.body,
      });
    }
  }

  /**
   * 更新回路特性
   *
   * @param value
   */
  function updateLoopCharacteristics(value: string) {
    // 重置表单
    multiInstanceForm.resetFields([
      'loopCardinality',
      'collection',
      'elementVariable',
      'completionCondition',
    ]);
    asyncStatusForm.resetFields();
    (asyncBefore || asyncAfter) && timeCycleForm.resetFields();
    // 取消多实例配置
    if (value === '-1') {
      window.bpmnInstance.modeling.updateProperties(
        window.bpmnInstance.element,
        { loopCharacteristics: undefined },
      );
      return;
    }
    // 配置循环事件
    if (value === loop_characteristics_type.standardLoop) {
      const loopCharacteristicsObject = window.bpmnInstance.moddle.create(
        'bpmn:StandardLoopCharacteristics',
      );
      window.bpmnInstance.modeling.updateProperties(
        window.bpmnInstance.element,
        {
          loopCharacteristics: loopCharacteristicsObject,
        },
      );
      return;
    }
    // 配置时序多重事件
    if (value === loop_characteristics_type.sequentialMultiInstance) {
      const loopCharacteristicsObject = window.bpmnInstance.moddle.create(
        'bpmn:MultiInstanceLoopCharacteristics',
        {
          isSequential: true,
        },
      );
      window.bpmnInstance.modeling.updateProperties(
        window.bpmnInstance.element,
        {
          loopCharacteristics: loopCharacteristicsObject,
        },
      );
      return;
    } else {
      // 配置并行多重事件
      const loopCharacteristicsObject = window.bpmnInstance.moddle.create(
        'bpmn:MultiInstanceLoopCharacteristics',
      );
      window.bpmnInstance.modeling.updateProperties(
        window.bpmnInstance.element,
        {
          loopCharacteristics: loopCharacteristicsObject,
        },
      );
    }
  }

  /**
   * 更新循环基数
   *
   * @param value
   */
  function updateLoopCardinality(value: string) {
    let loopCardinality = null;
    if (value && value.length) {
      loopCardinality = window.bpmnInstance.moddle.create(
        'bpmn:FormalExpression',
        { body: value },
      );
    }
    window.bpmnInstance.modeling.updateModdleProperties(
      window.bpmnInstance.element,
      window.bpmnInstance.element.businessObject.loopCharacteristics,
      {
        loopCardinality,
      },
    );
  }

  /**
   * 更新完成条件
   *
   * @param value
   */
  function updateLoopCondition(value: string) {
    let completionCondition = null;
    if (value && value.length) {
      completionCondition = window.bpmnInstance.moddle.create(
        'bpmn:FormalExpression',
        { body: value },
      );
    }
    window.bpmnInstance.modeling.updateModdleProperties(
      window.bpmnInstance.element,
      window.bpmnInstance.element.businessObject.loopCharacteristics,
      {
        completionCondition,
      },
    );
  }

  /**
   * 更新重试周期
   *
   * @param value
   */
  function updateLoopTimeCycle(value: string) {
    const extensionElements = window.bpmnInstance.moddle.create(
      'bpmn:ExtensionElements',
      {
        values: [
          window.bpmnInstance.moddle.create(
            `${FLOWABLE_PREFIX}:FailedJobRetryTimeCycle`,
            {
              body: value,
            },
          ),
        ],
      },
    );
    window.bpmnInstance.modeling.updateModdleProperties(
      window.bpmnInstance.element,
      window.bpmnInstance.element.businessObject.loopCharacteristics,
      {
        extensionElements,
      },
    );
  }

  /**
   * 更新集合与元素变量
   */
  function updateLoopBase() {
    window.bpmnInstance.modeling.updateModdleProperties(
      window.bpmnInstance.element,
      window.bpmnInstance.element.businessObject.loopCharacteristics,
      {
        collection: multiInstanceForm.getFieldValue(keyOptions.collection),
        elementVariable: multiInstanceForm.getFieldValue(
          keyOptions.elementVariable,
        ),
      },
    );
  }

  /**
   * 更新异步状态
   */
  function updateLoopAsync() {
    let asyncAttr: any;
    let asyncBefore: boolean = asyncStatusForm.getFieldValue('asyncBefore');
    let asyncAfter: boolean = asyncStatusForm.getFieldValue('asyncAfter');
    let exclusive: boolean = asyncStatusForm.getFieldValue('exclusive');
    if (!asyncBefore && !asyncAfter) {
      asyncAttr = {
        asyncBefore,
        asyncAfter,
        exclusive: false,
        extensionElements: undefined,
      };
    } else {
      asyncAttr = { asyncBefore, asyncAfter, exclusive };
    }
    window.bpmnInstance.modeling.updateModdleProperties(
      window.bpmnInstance.element,
      window.bpmnInstance.element.businessObject.loopCharacteristics,
      asyncAttr,
    );
  }

  /**
   * 渲染 多实例表单
   */
  function renderMultiInstanceForm() {
    return (
      <>
        <Form.Item name="loopCardinality" label="循环基数">
          <Input
            placeholder="请输入"
            onChange={(event) => {
              updateLoopCardinality(event.target.value);
            }}
          />
        </Form.Item>
        <Form.Item name="collection" label="集合">
          <Input placeholder="请输入" onChange={updateLoopBase} />
        </Form.Item>
        <Form.Item name="elementVariable" label="元素变量">
          <Input placeholder="请输入" onChange={updateLoopBase} />
        </Form.Item>
        <Form.Item name="completionCondition" label="完成条件">
          <Input
            placeholder="请输入"
            onChange={(event) => {
              updateLoopCondition(event.target.value);
            }}
          />
        </Form.Item>
      </>
    );
  }

  /**
   * 渲染 异步状态表单
   */
  function renderAsyncStatusForm() {
    return (
      <>
        <Form form={asyncStatusForm} layout="inline">
          <Form.Item
            label={'异步状态'}
            name="asyncBefore"
            valuePropName="checked"
            style={{ marginLeft: 22, marginBottom: 20 }}
          >
            <Checkbox style={{ marginLeft: 5 }} onChange={updateLoopAsync}>
              异步前
            </Checkbox>
          </Form.Item>
          <Form.Item name="asyncAfter" valuePropName="checked">
            <Checkbox onChange={updateLoopAsync}>异步后</Checkbox>
          </Form.Item>
          {(asyncBefore || asyncAfter) && (
            <Form.Item name="exclusive" valuePropName="checked">
              <Checkbox onChange={updateLoopAsync}>是否排除</Checkbox>
            </Form.Item>
          )}
        </Form>
        {(asyncBefore || asyncAfter) && renderTimeCycleForm()}
      </>
    );
  }

  /**
   * 渲染 重试周期表单
   */
  function renderTimeCycleForm() {
    return (
      <>
        <Form
          form={timeCycleForm}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item name="timeCycle" label="重试周期">
            <Input
              placeholder="请输入"
              onChange={(event) => {
                updateLoopTimeCycle(event.target.value);
              }}
            />
          </Form.Item>
        </Form>
      </>
    );
  }

  return (
    <>
      <Form
        form={multiInstanceForm}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
      >
        <Form.Item name="loopCharacteristics" label="回路特性">
          <Select
            placeholder={'请选择'}
            onChange={(value) => {
              updateLoopCharacteristics(value);
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
    </>
  );
}
