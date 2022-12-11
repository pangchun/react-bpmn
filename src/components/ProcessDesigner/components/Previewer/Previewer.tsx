import React, { useState } from 'react';
import { Modal, message } from 'antd';

// 引入代码高亮插件和样式
import SyntaxHighlighter from 'react-syntax-highlighter';
import { obsidian } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { xml2json } from '@/bpmn/util/xmlUtil';

// 样式
import styles from './index.less';

interface IProps {
  modeler: any;
  type: 'xml' | 'json';
}

/**
 * 流程预览
 * @param props
 * @constructor
 */
export default function Previewer(props: IProps) {
  // props
  const { modeler, type } = props;
  // states
  const [xml, setXml] = useState<string>('');
  const [open, setOpen] = useState(false);

  const showModal = async () => {
    setOpen(true);
    let result = await modeler.saveXML({ format: true });
    const { xml } = result;
    if (type == 'xml') {
      setXml(xml);
    } else {
      const jsonStr: string = xml2json(xml);
      setXml(jsonStr);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleCopy = () => {
    if (navigator) {
      navigator.clipboard
        .writeText(xml)
        .then((r) => message.info('已复制到剪贴板'));
    }
  };

  return (
    <>
      <a type="primary" onClick={showModal}>
        {'预览' + type.toUpperCase()}
      </a>
      <Modal
        width={1200}
        bodyStyle={{ maxHeight: '50%' }}
        title="预览"
        open={open}
        okText={'复制'}
        cancelText={'关闭'}
        onOk={handleCopy}
        onCancel={handleCancel}
      >
        <div
          className={styles.codePreWrap}
          style={{ maxHeight: 600, overflowY: 'scroll', maxWidth: 1200 }}
        >
          <SyntaxHighlighter language={type} style={obsidian}>
            {xml}
          </SyntaxHighlighter>
        </div>
      </Modal>
    </>
  );
}
