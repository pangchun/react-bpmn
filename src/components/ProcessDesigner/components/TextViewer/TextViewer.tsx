import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

interface IProps {
  modeler: any;
}

/**
 * 文本查看器
 * @param props
 * @constructor
 */
export default function TextViewer(props: IProps) {
  const { modeler } = props;

  const [xml, setXml] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = async () => {
    setIsModalVisible(true);

    let result = await modeler.saveXML({ format: true });
    const { xml } = result;
    console.log(xml);
    setXml(xml);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
      <Button
        type="primary"
        size={'small'}
        icon={<EyeOutlined />}
        onClick={showModal}
      >
        预览
      </Button>
      <Modal
        width={1200}
        bodyStyle={{ maxHeight: '50%' }}
        title="正在预览"
        visible={isModalVisible}
        okText={'复制'}
        cancelText={'关闭'}
        onOk={handleCopy}
        onCancel={handleCancel}
      >
        {/* todo 此处可以设置字符串过长时显示 展开、收缩 按钮，以便查看 */}
        <div style={{ maxHeight: 400, overflowY: 'scroll' }}>
          <pre>{xml}</pre>
        </div>
      </Modal>
    </>
  );
}
