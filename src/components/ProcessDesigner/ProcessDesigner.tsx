import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hook/hooks';

// 引入bpmn建模器
import BpmnModeler from 'bpmn-js/lib/Modeler';

// 引入属性解析文件和对应的解析器
import flowableDescriptor from '@/bpmn/descriptor/flowable.json';
import { flowableExtension } from '@/bpmn/moddle/flowable';
import camundaDescriptor from '@/bpmn/descriptor/camunda.json';
import { camundaExtension } from '@/bpmn/moddle/camunda';
import activitiDescriptor from '@/bpmn/descriptor/activiti.json';
import { activitiExtension } from '@/bpmn/moddle/activiti';

// 引入bpmn工作流绘图工具(bpmn-js)样式
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

// 引入属性面板(properties-panel)样式
import 'bpmn-js-properties-panel/dist/assets/element-templates.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';

// 引入翻译模块
import translationsCN from '@/bpmn/translate/zh.js';
import customTranslate from '@/bpmn/translate/customTranslate.js';

// 模拟流转流程
import TokenSimulationModule from 'bpmn-js-token-simulation';
import 'bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css';

// 引入流程图文件
import DefaultEmptyXML from '@/bpmn/constant/emptyXml';

// 引入当前组件样式
import {
  Button,
  Col,
  Dropdown,
  MenuProps,
  message,
  Modal,
  Row,
  Space,
  Tooltip,
} from 'antd';

// 组件引入
import PropertyPanel from '@/components/ProcessDesigner/components/PropertyPanel/PropertyPanel';
import Previewer from '@/components/ProcessDesigner/components/Previewer/Previewer';
import {
  AlignLeftOutlined,
  AlignRightOutlined,
  VerticalAlignBottomOutlined,
  AlignCenterOutlined,
  BugOutlined,
  CompressOutlined,
  DownloadOutlined,
  EyeOutlined,
  FolderOpenOutlined,
  RedoOutlined,
  SyncOutlined,
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignMiddleOutlined,
} from '@ant-design/icons';
import ConfigServer from '@/components/ProcessDesigner/components/ConfigServer/ConfigServer';

// 常量引入
import {
  ACTIVITI_PREFIX,
  CAMUNDA_PREFIX,
  FLOWABLE_PREFIX,
} from '@/bpmn/constant/constants';
import ButtonGroup from 'antd/es/button/button-group';
import { handleProcessId, handleProcessName } from '@/redux/slice/bpmnSlice';

export default function ProcessDesigner() {
  // state
  const [bpmnModeler, setBpmnModeler] = useState<any>();
  const [simulationStatus, setSimulationStatus] = useState<boolean>(false);
  const [zoomSize, setZoomSize] = useState<number>(1);
  const [revocable, setRevocable] = useState<boolean>(false);
  const [recoverable, setRecoverable] = useState<boolean>(false);
  // redux
  const bpmnPrefix = useAppSelector((state) => state.bpmn.prefix);
  const processId = useAppSelector((state) => state.bpmn.processId);
  const processName = useAppSelector((state) => state.bpmn.processName);
  const dispatch = useAppDispatch();
  // ref
  const refFile = React.useRef<any>();

  /**
   * 初始化建模器
   * 1、这一步在绘制流程图之前进行，且随流程前缀改变而改变；
   * 2、因为解析器和解析文件与流程引擎类型(也就是前缀)有关，因此这里依赖的变量是放在redux里的流程前缀名
   */
  useEffect(() => {
    // 重新加载前需要销毁之前的modeler，否则页面上会加载出多个建模器
    if (bpmnModeler) {
      bpmnModeler.destroy();
      setBpmnModeler(undefined);
    }
    (async () => {
      // 每次重新加载前需要先消除之前的流程信息
      dispatch(handleProcessId(undefined));
      await dispatch(handleProcessName(undefined));
      initBpmnModeler();
    })();
  }, [bpmnPrefix]);

  /**
   * 初始化建模器
   */
  function initBpmnModeler() {
    console.log('【初始化建模器】1、初始化建模器开始');
    const modeler = new BpmnModeler({
      container: '#canvas',
      height: '96.5vh',
      additionalModules: getAdditionalModules(),
      moddleExtensions: getModdleExtensions(),
    });
    setBpmnModeler(modeler);

    /**
     * 添加解析器
     */
    function getAdditionalModules() {
      console.log('【初始化建模器】2、添加解析器');
      const modules: Array<any> = [];
      if (bpmnPrefix === FLOWABLE_PREFIX) {
        modules.push(flowableExtension);
      }
      if (bpmnPrefix === CAMUNDA_PREFIX) {
        modules.push(camundaExtension);
      }
      if (bpmnPrefix === ACTIVITI_PREFIX) {
        modules.push(activitiExtension);
      }
      // 添加翻译模块
      const TranslateModule = {
        // translate: ["value", customTranslate(translations || translationsCN)] translations是自定义的翻译文件
        translate: ['value', customTranslate(translationsCN)],
      };
      modules.push(TranslateModule);
      // 添加模拟流转模块
      modules.push(TokenSimulationModule);
      return modules;
    }

    /**
     * 添加解析文件
     */
    function getModdleExtensions() {
      console.log('【初始化建模器】3、添加解析文件');
      const extensions: any = {};
      if (bpmnPrefix === FLOWABLE_PREFIX) {
        extensions.flowable = flowableDescriptor;
      }
      if (bpmnPrefix === CAMUNDA_PREFIX) {
        extensions.camunda = camundaDescriptor;
      }
      if (bpmnPrefix === ACTIVITI_PREFIX) {
        extensions.activiti = activitiDescriptor;
      }
      return extensions;
    }

    console.log('【初始化建模器】4、初始化建模器结束');
  }

  /**
   * 绘制流程图，并设置属性面板的监听器
   * 1、建模器初始化完成后，开始绘制流程图，如果需要创建空白的流程图可以使用bpmnModeler.createDiagram()方法，但是这个流程的id是固定的，是bpmn内部默认的xml字符串；
   */
  useEffect(() => {
    if (!bpmnModeler) return;
    (async () => {
      // 绘制流程图
      // await createBpmnDiagram(xxx);
      await createBpmnDiagram();
      // 之后绑定属性面板监听器
      bindPropertiesListener();
    })();
  }, [bpmnModeler]);

  /**
   * 绘制流程图
   * 1、调用 modeler 的 importXML 方法，将 xml 字符串转为图像；
   *
   * @param xml
   */
  function createBpmnDiagram(xml?: string) {
    console.log('【绘制流程图】1、开始绘制流程图');
    let newId = processId || 'Process_' + new Date().getTime();
    let newName = processName || '业务流程_' + new Date().getTime();
    let newXML = xml ? xml : DefaultEmptyXML(newId, newName, bpmnPrefix);
    // 执行importXML方法
    try {
      bpmnModeler?.importXML(newXML);
    } catch (e) {
      console.error('【流程图绘制出错】错误日志如下: ↓↓↓');
      console.error(e);
    }
    // 更新流程信息，初始化建模器后，有了modeler，通过modeler获取到canvas，就能拿到rootElement，从而获取到流程的初始信息
    console.log('【绘制流程图】2、更新流程节点信息');
    setTimeout(() => {
      const canvas = bpmnModeler.get('canvas');
      const rootElement = canvas.getRootElement();
      // 获取流程id和name
      const id: string = rootElement.id;
      const name: string = rootElement.businessObject.name;
      dispatch(handleProcessId(id));
      dispatch(handleProcessName(name));
    }, 10);
    console.log('【绘制流程图】3、流程图绘制完成');
  }

  /**
   * 属性面板监听器
   * 1、属性面板监听器，当监听到属性面板的属性发生变化，会同步更新到xml字符串中；
   * 2、监听器要等到流程图绘制结束后才能添加；
   */
  function bindPropertiesListener() {
    console.log('【绑定属性面板监听器】1、开始绑定');
    bpmnModeler?.on('commandStack.changed', async () => {
      // 监听当前是否可撤销与恢复
      let revocable: boolean = bpmnModeler.get('commandStack').canUndo();
      let recoverable: boolean = bpmnModeler.get('commandStack').canRedo();
      setRevocable(revocable);
      setRecoverable(recoverable);
      //  其它操作
    });
    console.log('【绑定属性面板监听器】2、绑定成功');
  }

  /**
   * 渲染导入按钮
   */
  function renderImportButton() {
    function importLocalFile() {
      const file = refFile.current.files[0];
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function (this) {
        let xmlStr: any = this.result || undefined;
        console.log('【正在打开本地文件】文件内容如下: ↓↓↓');
        console.log(xmlStr);
        createBpmnDiagram(xmlStr);
      };
    }

    return (
      <>
        <Button
          type="primary"
          size={'small'}
          icon={<FolderOpenOutlined />}
          onClick={() => {
            refFile.current.click();
          }}
        >
          {'打开文件'}
        </Button>
        <input
          type={'file'}
          id="files"
          ref={refFile}
          accept=".xml, .bpmn"
          style={{ display: 'none' }}
          onChange={importLocalFile}
        />
      </>
    );
  }

  /**
   * 渲染下载按钮
   */
  function renderDownloadButton() {
    // 下载菜单
    const items: MenuProps['items'] = [
      {
        label: <a onClick={downloadProcessAsXml}>{'XML文件'}</a>,
        key: '1',
      },
      {
        label: <a onClick={downloadProcessAsSvg}>{'SVG图像'}</a>,
        key: '2',
      },
      {
        label: <a onClick={downloadProcessAsBpmn}>{'BPMN文件'}</a>,
        key: '3',
      },
    ];

    /**
     * 下载流程图
     * @param type
     * @param name
     */
    async function downloadProcess(type: string, name?: string) {
      try {
        // 按需要类型创建文件并下载
        if (type === 'xml' || type === 'bpmn') {
          const { err, xml } = await bpmnModeler.saveXML();
          // 读取异常时抛出异常
          if (err) {
            console.error(`【下载流程图出错】: ${err.message || err}`);
          }
          let { href, filename } = setEncoded(type.toUpperCase(), name, xml);
          downloadFunc(href, filename);
        } else {
          const { err, svg } = await bpmnModeler.saveSVG();
          // 读取异常时抛出异常
          if (err) {
            return console.error(err);
          }
          let { href, filename } = setEncoded('SVG', name, svg);
          downloadFunc(href, filename);
        }
      } catch (e: any) {
        console.error(`【下载流程图出错】: ${e.message || e}`);
      }

      /**
       * 根据所需类型进行转码并返回下载地址
       * @param type
       * @param filename
       * @param data
       */
      function setEncoded(
        type: string,
        filename = processId || 'diagram',
        data: any,
      ) {
        const encodedData = encodeURIComponent(data);
        return {
          filename: `${filename}.${type}`,
          href: `data:application/${
            type === 'svg' ? 'text/xml' : 'bpmn20-xml'
          };charset=UTF-8,${encodedData}`,
          data: data,
        };
      }

      /**
       * 文件下载方法
       * @param href
       * @param filename
       */
      function downloadFunc(href: string, filename: string) {
        if (href && filename) {
          let a = document.createElement('a');
          a.download = filename; //指定下载的文件名
          a.href = href; //  URL对象
          a.click(); // 模拟点击
          URL.revokeObjectURL(a.href); // 释放URL 对象
        }
      }
    }

    /**
     * 另存为xml文件
     */
    function downloadProcessAsXml() {
      downloadProcess('xml').then(() => message.info('成功另存为xml文件'));
    }

    /**
     * 另存为bpmn文件
     */
    function downloadProcessAsBpmn() {
      downloadProcess('bpmn').then(() => message.info('成功另存为bpmn文件'));
    }

    /**
     * 另存为svg文件
     */
    function downloadProcessAsSvg() {
      downloadProcess('svg').then(() => message.info('成功另存为svg文件'));
    }

    return (
      <>
        <Dropdown menu={{ items }} trigger={['click']}>
          <Button
            type="primary"
            size={'small'}
            onClick={(e) => e.preventDefault()}
          >
            <Space>
              <DownloadOutlined />
              {'下载文件'}
            </Space>
          </Button>
        </Dropdown>
      </>
    );
  }

  /**
   * 渲染预览按钮
   */
  function renderPreviewButton() {
    // 预览菜单
    const items: MenuProps['items'] = [
      {
        label: <Previewer modeler={bpmnModeler} type={'xml'} />,
        key: '1',
      },
      {
        label: <Previewer modeler={bpmnModeler} type={'json'} />,
        key: '2',
      },
    ];

    return (
      <>
        <Dropdown menu={{ items }} trigger={['click']}>
          <Button
            type="primary"
            size={'small'}
            onClick={(e) => e.preventDefault()}
          >
            <Space>
              <EyeOutlined />
              {'预览'}
            </Space>
          </Button>
        </Dropdown>
      </>
    );
  }

  /**
   * 渲染模拟流转按钮
   */
  function renderSimulationButton() {
    function handleSimulation() {
      bpmnModeler.get('toggleMode').toggleMode();
      setSimulationStatus(!simulationStatus);
    }

    return (
      <>
        <Button
          type="primary"
          size={'small'}
          onClick={() => handleSimulation()}
        >
          <Space>
            <BugOutlined />
            {simulationStatus ? '退出' : '模拟'}
          </Space>
        </Button>
      </>
    );
  }

  /**
   * 渲染 对齐按钮组
   */
  function renderAlignControlButtons() {
    const [open, setOpen] = useState(false);
    const [align, setAlign] = useState<
      'left' | 'right' | 'top' | 'bottom' | 'center' | 'middle'
    >('left');

    function handleOpen(
      align: 'left' | 'right' | 'top' | 'bottom' | 'center' | 'middle',
    ) {
      setAlign(align);
      setOpen(true);
    }

    function handleElAlign() {
      const Align = bpmnModeler.get('alignElements');
      const Selection = bpmnModeler.get('selection');
      const SelectedElements = Selection.get();
      if (!SelectedElements || SelectedElements.length <= 1) {
        message.warning('请按住 Ctrl 键选择多个元素对齐').then(() => {});
        return;
      }
      Align.trigger(SelectedElements, align);
      setOpen(false);
    }

    return (
      <>
        <Modal
          title="确认对齐"
          okText={'确认'}
          cancelText={'取消'}
          open={open}
          onOk={() => handleElAlign()}
          onCancel={() => setOpen(false)}
        >
          <p>{'自动对齐可能造成图形变形,是否继续?'}</p>
        </Modal>
        <Tooltip title="向左对齐">
          <Button
            type={'default'}
            size={'small'}
            style={{ width: '45px' }}
            icon={<AlignLeftOutlined />}
            onClick={() => handleOpen('left')}
          />
        </Tooltip>
        <Tooltip title="向右对齐">
          <Button
            type={'default'}
            size={'small'}
            style={{ width: '45px' }}
            icon={<AlignRightOutlined />}
            onClick={() => handleOpen('right')}
          />
        </Tooltip>
        <Tooltip title="向上对齐">
          <Button
            type={'default'}
            size={'small'}
            style={{ width: '45px' }}
            icon={<VerticalAlignTopOutlined />}
            onClick={() => handleOpen('top')}
          />
        </Tooltip>
        <Tooltip title="向下对齐">
          <Button
            type={'default'}
            size={'small'}
            style={{ width: '45px' }}
            icon={<VerticalAlignBottomOutlined />}
            onClick={() => handleOpen('bottom')}
          />
        </Tooltip>
        <Tooltip title="水平居中">
          <Button
            type={'default'}
            size={'small'}
            style={{ width: '45px' }}
            icon={<AlignCenterOutlined />}
            onClick={() => handleOpen('center')}
          />
        </Tooltip>
        <Tooltip title="垂直居中">
          <Button
            type={'default'}
            size={'small'}
            style={{ width: '45px' }}
            icon={<VerticalAlignMiddleOutlined />}
            onClick={() => handleOpen('middle')}
          />
        </Tooltip>
      </>
    );
  }

  /**
   * 渲染 视图操作按钮组
   */
  function renderScaleControlButtons() {
    const zoomStep = 0.1;

    function handleZoomIn() {
      let newSize: number = Math.floor(zoomSize * 100 + zoomStep * 100) / 100;
      if (newSize > 4) {
        newSize = 4;
        message.warning('已达到最大倍数 400%, 不能继续放大').then(() => {});
      }
      setZoomSize(newSize);
      bpmnModeler.get('canvas').zoom(newSize);
    }

    function handleZoomOut() {
      let newSize: number = Math.floor(zoomSize * 100 - zoomStep * 100) / 100;
      if (newSize < 0.2) {
        newSize = 0.2;
        message.warning('已达到最小倍数 20%, 不能继续缩小').then(() => {});
      }
      setZoomSize(newSize);
      bpmnModeler.get('canvas').zoom(newSize);
    }

    function resetZoom() {
      setZoomSize(1);
      bpmnModeler.get('canvas').zoom('fit-viewport', 'auto');
    }

    return (
      <>
        <Tooltip title="缩小视图">
          <Button
            type={'default'}
            size={'small'}
            style={{ width: '45px' }}
            icon={<ZoomOutOutlined />}
            onClick={handleZoomOut}
          />
        </Tooltip>
        <Button type={'default'} size={'small'} style={{ width: '65px' }}>
          {Math.floor(zoomSize * 10 * 10) + '%'}
        </Button>
        <Tooltip title="放大视图">
          <Button
            type={'default'}
            size={'small'}
            style={{ width: '45px' }}
            icon={<ZoomInOutlined />}
            onClick={handleZoomIn}
          />
        </Tooltip>
        <Tooltip title="重置视图并居中">
          <Button
            type={'default'}
            size={'small'}
            style={{ width: '45px' }}
            icon={<CompressOutlined />}
            onClick={resetZoom}
          />
        </Tooltip>
      </>
    );
  }

  /**
   * 渲染 撤销恢复按钮组
   */
  function renderStackControlButtons() {
    function handleUndo() {
      bpmnModeler.get('commandStack').undo();
    }

    function handleRedo() {
      bpmnModeler.get('commandStack').redo();
    }

    function handleRestart() {
      createBpmnDiagram();
    }

    return (
      <>
        <Tooltip title="撤销">
          <Button
            type={'default'}
            size={'small'}
            style={{ width: '45px' }}
            disabled={!revocable}
            icon={<UndoOutlined />}
            onClick={handleUndo}
          />
        </Tooltip>
        <Tooltip title="恢复">
          <Button
            type={'default'}
            size={'small'}
            style={{ width: '45px' }}
            disabled={!recoverable}
            icon={<RedoOutlined />}
            onClick={handleRedo}
          />
        </Tooltip>
        <Tooltip title="重新绘制">
          <Button
            type={'default'}
            size={'small'}
            style={{ width: '45px' }}
            icon={<SyncOutlined />}
            onClick={handleRestart}
          />
        </Tooltip>
      </>
    );
  }

  /**
   * 渲染顶部工具栏
   */
  function renderToolBar() {
    return (
      <>
        <Space
          direction={'horizontal'}
          size={8}
          style={{ marginTop: 3, marginBottom: 3 }}
        >
          {/* 基本操作按钮组 */}
          <ButtonGroup>
            {renderImportButton()}
            {renderDownloadButton()}
            {renderPreviewButton()}
            {renderSimulationButton()}
          </ButtonGroup>
          {/* 对齐按钮组 */}
          <ButtonGroup>{renderAlignControlButtons()}</ButtonGroup>
          {/* 缩放按钮组 */}
          <ButtonGroup>{renderScaleControlButtons()}</ButtonGroup>
          {/* 撤销按钮组 */}
          <ButtonGroup>{renderStackControlButtons()}</ButtonGroup>
          {/*配置中心按钮*/}
          <ConfigServer />
        </Space>
      </>
    );
  }

  return (
    <>
      <Row gutter={0}>
        <Col span={1}>
          {/*todo 2022/10/31 快捷工具栏，暂时留空，后面补充功能和界面*/}
        </Col>
        <Col span={17}>
          {renderToolBar()}
          <div
            id="canvas"
            style={{
              backgroundColor: 'transparent',
              backgroundImage:
                'linear-gradient(#cccccc 1px, transparent 0), linear-gradient(90deg,#cccccc 1px, transparent 0)',
              backgroundSize: '20px 20px',
            }}
          />
        </Col>
        <Col
          span={6}
          style={{
            height: '100vh',
            overflowY: 'auto',
            borderLeft: '1px solid #eee ',
          }}
        >
          <PropertyPanel modeler={bpmnModeler} />
        </Col>
      </Row>
    </>
  );
}
