import React, { useEffect, useState } from 'react';
import {
  Button,
  Drawer,
  FloatButton,
  Form,
  message,
  Radio,
  Space,
  Switch,
} from 'antd';
import { SketchPicker } from 'react-color';
import {
  BulbFilled,
  BulbOutlined,
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
import { handleColorPrimary, handleDarkMode } from '@/redux/slice/themeSlice';
import { defaultThemeData } from '@/pages/globalTheme';

/**
 * 配置中心
 *
 * @constructor
 */
export default function ConfigServer() {
  // state
  const [open, setOpen] = useState(false);
  // redux
  const colorPrimary = useAppSelector((state) => state.theme.colorPrimary);
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const dispatch = useAppDispatch();
  // form
  const [form] = Form.useForm<{
    engineType: string;
    primaryColorObj: any;
    isDarkMode: boolean;
  }>();

  useEffect(() => {
    form.setFieldsValue({
      engineType: 'flowable',
      primaryColorObj: {
        hex: colorPrimary,
      },
      isDarkMode: darkMode,
    });
  }, []);

  function showDrawer() {
    setOpen(true);
  }

  function onClose() {
    setOpen(false);
  }

  function handleDark() {
    if (darkMode) {
      // 设置白天模式
      dispatch(handleDarkMode(false));
      form.setFieldValue('isDarkMode', false);
      document.body.style.setProperty(
        '--djs-palette-bg-color',
        defaultThemeData.lightPaletteBgColor,
      );
      document.body.style.setProperty(
        '--canvas-bg-color',
        defaultThemeData.lightCanvasBgColor,
      );
      message.info('已开启明亮模式').then(() => {});
    } else {
      dispatch(handleDarkMode(true));
      form.setFieldValue('isDarkMode', true);
      document.body.style.setProperty(
        '--djs-palette-bg-color',
        defaultThemeData.darkPaletteBgColor,
      );
      document.body.style.setProperty(
        '--canvas-bg-color',
        defaultThemeData.darkCanvasBgColor,
      );
      message.info('已开启黑夜模式').then(() => {});
    }
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
          icon={
            darkMode ? (
              <BulbFilled style={{ color: '#ffe700' }} />
            ) : (
              <BulbOutlined />
            )
          }
          onClick={handleDark}
        />
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
          <Form.Item label="黑夜模式" name="isDarkMode" valuePropName="checked">
            <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              onChange={() => {
                handleDark();
              }}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
