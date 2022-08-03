import React, { useEffect } from 'react';
import { Form, Input, Typography } from 'antd';
import { Collapse } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';

const { Panel } = Collapse;

const { TextArea } = Input;

interface IProps {
  businessObject: any;
}

export default function ElementOtherInfo(props: IProps) {
  // props属性
  const { businessObject } = props;

  // 其它属性
  const [form] = Form.useForm<{
    documentation: string;
  }>();

  /**
   * 只监听id的原因：
   * 1、只有切换当前节点才重新执行初始化操作
   * 2、当前节点属性变化时，不需要重新初始化操作
   * 3、因为每个节点的id是必不相同的，所以可以用作依赖项
   */
  useEffect(() => {
    initPageData();
  }, [businessObject?.id]);

  function initPageData() {
    // 首次调用 resetFields 报错 Instance created by `useForm` is not connected to any Form element. Forget to pass `form` prop? 目前尚未找到解决办法，后面再处理
    // 原因找到：手风琴状态设置为打开则不会报错,当初始时，手风琴如果为关闭状态默认是不会渲染手风琴内的组件，设置 forceRender={true} 即可
    form.resetFields();
    form.setFieldsValue({
      documentation: businessObject?.documentation?.at(0).text || '',
    });
  }

  function updateDocumentation(value: string) {
    const documentation = window.bpmnInstance.bpmnFactory?.create(
      'bpmn:Documentation',
      {
        text: value,
      },
    );
    window.bpmnInstance.modeling.updateProperties(window.bpmnInstance.element, {
      documentation: value ? [documentation] : undefined,
    });
  }

  return (
    <>
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
        <Form.Item label="元素文档" name="documentation">
          <TextArea
            rows={4}
            placeholder={'请输入'}
            onChange={(event) => {
              updateDocumentation(event.currentTarget.value);
            }}
          />
        </Form.Item>
      </Form>
    </>
  );
}
