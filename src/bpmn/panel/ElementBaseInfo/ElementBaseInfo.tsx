import React, { useEffect } from 'react';
import { Form, Input, message, Switch } from 'antd';

const keyOptions = {
  id: 'id',
  name: 'name',
  isExecutable: 'isExecutable',
  versionTag: 'versionTag',
};

interface IProps {
  businessObject: any;
}

export default function ElementBaseInfo(props: IProps) {
  // props属性
  const { businessObject } = props;
  // form表单属性
  const [form] = Form.useForm<{
    id: string;
    name: string;
    isExecutable: boolean;
    versionTag: string;
  }>();

  /**
   * 只监听id的原因：
   * 1、只有切换当前节点才重新执行初始化操作
   * 2、当前节点属性变化时，不需要重新初始化操作
   * 3、因为每个节点的id是必不相同的，所以可以用作依赖项
   */
  useEffect(() => {
    if (businessObject) {
      initPageData();
    }
  }, [businessObject?.id]);

  function initPageData() {
    console.log('123123', businessObject);
    form.setFieldsValue({
      id: businessObject?.id,
      name: businessObject?.name,
      isExecutable: businessObject?.isExecutable || false,
      versionTag: businessObject?.versionTag,
    });
  }

  function updateElementAttr(key: string, value: any) {
    if (key === keyOptions.id) {
      // id为空时，不执行更新 todo 并提示
      if (!value) {
        return;
      }
      // id不能相同
      try {
        window.bpmnInstance.elementRegistry._validateId(value);
      } catch (e: any) {
        message
          .error('编号名称已存在，请修改编号')
          .then(() => console.log(e.message));
        return;
      }
      // 更新id
      window.bpmnInstance.modeling.updateProperties(
        window.bpmnInstance.element,
        {
          id: value,
          di: { id: `${businessObject[key]}_di` },
        },
      );
      return;
    }
    // 更新其他属性
    window.bpmnInstance.modeling.updateProperties(window.bpmnInstance.element, {
      [key]: value || undefined,
    });
  }

  function validateId(value: string) {
    if (value.includes(' ')) {
      return {
        status: false,
        message: '编号中不能包含空格',
      };
    }
    return {
      status: true,
    };
  }

  /**
   * 渲染Process节点独有组件 (版本标签、是否可执行)
   */
  function renderProcessExtension() {
    if (businessObject?.$type === 'bpmn:Process') {
      return (
        <>
          <Form.Item label="版本标签" name="versionTag">
            <Input
              placeholder={'请输入'}
              onChange={(event) => {
                updateElementAttr(
                  keyOptions.versionTag,
                  event.currentTarget.value,
                );
              }}
            />
          </Form.Item>
          <Form.Item label="可执行" name="isExecutable" valuePropName="checked">
            <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              onChange={(checked) => {
                updateElementAttr(keyOptions.isExecutable, checked);
              }}
            />
          </Form.Item>
        </>
      );
    }
  }

  return (
    <>
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
        <Form.Item
          label="编号"
          name="id"
          rules={[
            { required: true, message: '编号不能为空哦!' },
            {
              validator: (_, value) => {
                const validateId$1 = validateId(value);
                return validateId$1.status
                  ? Promise.resolve()
                  : Promise.reject(new Error(validateId$1.message));
              },
            },
          ]}
        >
          <Input
            placeholder={'请输入'}
            // readOnly={businessObject?.$type === 'bpmn:Process'}
            onChange={(event) => {
              updateElementAttr(keyOptions.id, event.currentTarget.value);
            }}
          />
        </Form.Item>
        <Form.Item label="名称" name="name">
          <Input
            placeholder={'请输入'}
            onChange={(event) => {
              updateElementAttr(keyOptions.name, event.currentTarget.value);
            }}
          />
        </Form.Item>
        {renderProcessExtension()}
      </Form>
    </>
  );
}
