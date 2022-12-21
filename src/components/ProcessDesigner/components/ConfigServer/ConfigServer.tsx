import React, { useEffect, useState } from 'react';
import { Button, Drawer, FloatButton, Form, message, Radio, Space } from 'antd';
import { SketchPicker } from 'react-color';
import {
  EditOutlined,
  QuestionOutlined,
  SettingOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import {
  ACTIVITI_PREFIX,
  CAMUNDA_PREFIX,
  FLOWABLE_PREFIX,
} from '@/bpmn/constant/constants';
import { useAppDispatch, useAppSelector } from '@/redux/hook/hooks';
import { handlePrefix } from '@/redux/slice/bpmnSlice';
import { handleColorPrimary } from '@/redux/slice/themeSlice';
import { useWatch } from 'antd/es/form/Form';

interface IProps {}

/**
 * 配置中心
 * @param props
 * @constructor
 */
export default function ConfigServer(props: IProps) {
  // state
  const [open, setOpen] = useState(false);
  // redux
  const bpmnPrefix = useAppSelector((state) => state.bpmn.prefix);
  const colorPrimary = useAppSelector((state) => state.theme.colorPrimary);
  const borderRadius = useAppSelector((state) => state.theme.borderRadius);
  const dispatch = useAppDispatch();
  // form
  const [form] = Form.useForm<{
    engineType: string;
    primaryColorObj: any;
  }>();
  // watch
  const primaryColorObj: any = useWatch('primaryColorObj', form);

  useEffect(() => {
    form.setFieldsValue({
      engineType: 'flowable',
      primaryColorObj: {
        hex: colorPrimary,
      },
    });
  }, []);

  function showDrawer() {
    setOpen(true);
  }

  function onClose() {
    setOpen(false);
  }

  function changeEngineType(value: string) {
    dispatch(handlePrefix(value));
    message.info('流程引擎已切换为 ' + value).then(() => {});
  }

  return (
    <>
      <FloatButton.Group icon={<ToolOutlined />} type="primary" trigger="hover">
        <FloatButton icon={<SettingOutlined />} onClick={showDrawer} />
        <FloatButton
          icon={<QuestionOutlined />}
          onClick={() => message.info('暂未开发')}
        />
      </FloatButton.Group>
      <Drawer
        title="配置中心"
        placement={'left'}
        closable={false}
        onClose={onClose}
        open={open}
        key={'left'}
        forceRender={true}
        destroyOnClose
        width={'25%'}
        extra={
          <Space>
            <Button onClick={onClose}>收起</Button>
          </Space>
        }
      >
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 20 }} form={form}>
          <Form.Item label="流程引擎" name="engineType">
            <Radio.Group onChange={(e) => changeEngineType(e.target.value)}>
              <Radio.Button
                value={`${CAMUNDA_PREFIX}`}
              >{`${CAMUNDA_PREFIX}`}</Radio.Button>
              <Radio.Button
                value={`${FLOWABLE_PREFIX}`}
              >{`${FLOWABLE_PREFIX}`}</Radio.Button>
              <Radio.Button
                value={`${ACTIVITI_PREFIX}`}
              >{`${ACTIVITI_PREFIX}`}</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            valuePropName="color"
            name="primaryColorObj"
            label="主题换肤"
          >
            <SketchPicker
              onChange={(color: any) => {
                let newColor: string = color?.hex;
                dispatch(handleColorPrimary(newColor));
                document.body.style.setProperty('--primary-color', newColor);
              }}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
