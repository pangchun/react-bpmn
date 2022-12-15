import React, { useEffect } from 'react';
import { Form, Input, message, Switch } from 'antd';
import { useAppDispatch } from '@/redux/hook/hooks';
import { handleProcessId, handleProcessName } from '@/redux/slice/bpmnSlice';

const keyOptions = {
  id: 'id',
  name: 'name',
  isExecutable: 'isExecutable',
  versionTag: 'versionTag',
};

interface IProps {
  businessObject: any;
}

/**
 * 常规信息 组件
 *
 * @param props
 * @constructor
 */
export default function ElementBaseInfo(props: IProps) {
  // props
  const { businessObject } = props;
  // form
  const [form] = Form.useForm<{
    id: string;
    name: string;
    isExecutable: boolean;
    versionTag: string;
  }>();
  // redux
  const dispatch = useAppDispatch();

  /**
   * 只监听id的原因:
   * 1、只有切换当前节点才重新执行初始化操作
   * 2、当前节点属性变化时,不需要重新初始化操作
   * 3、因为每个节点的id是必不相同的,所以可以用作依赖项
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
    form.setFieldsValue({
      id: businessObject?.id,
      name: businessObject?.name,
      isExecutable: businessObject?.isExecutable || false,
      versionTag: businessObject?.versionTag,
    });
  }

  /**
   * 更新常规信息
   *
   * @param key
   * @param value
   */
  function updateElementAttr(key: string, value: any) {
    if (key === keyOptions.id) {
      // id校验, 这里做一次校验是因为输入框监听的是change事件,输入框自带的校验无法拦截到,因此要在这里处理一下,防止将非法值更新到流程中
      const { status: validateFlag } = validateId(value);
      if (!validateFlag) {
        return;
      } else {
        try {
          window.bpmnInstance.elementRegistry._validateId(value);
        } catch (e: any) {
          message
            .error('编号已存在,当前修改未生效')
            .then(() => console.log(e.message));
          return;
        }
      }
      // 更新id
      window.bpmnInstance.modeling.updateProperties(
        window.bpmnInstance.element,
        {
          id: value,
          di: { id: `${businessObject[key]}_di` },
        },
      );
    } else {
      // 更新其他属性
      window.bpmnInstance.modeling.updateProperties(
        window.bpmnInstance.element,
        {
          [key]: value || undefined,
        },
      );
    }
    // 如果当前是process节点,则更新redux中的processId和processName
    if (businessObject.$type === 'bpmn:Process') {
      if (key === keyOptions.id) {
        dispatch(handleProcessId(value));
      } else if (key === keyOptions.name) {
        dispatch(handleProcessName(value));
      }
    }
  }

  /**
   * 校验id
   *
   * @param value
   */
  function validateId(value: string) {
    if (!value) {
      return {
        status: false,
        message: '编号为空',
      };
    } else if (value.includes(' ')) {
      return {
        status: false,
        message: '编号中包含空格',
      };
    } else {
      return {
        status: true,
        message: 'ok',
      };
    }
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
          required
          rules={[
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
