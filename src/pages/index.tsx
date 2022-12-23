import ProcessDesigner from '@/components/ProcessDesigner/ProcessDesigner';
import { Provider } from 'react-redux';
import { store } from '@/redux/store/store';
import { message, Skeleton } from 'antd';

// 引入样式
import './index.less';
import { useEffect, useState } from 'react';

export default function IndexPage() {
  const [visible, setVisible] = useState<boolean>(
    document.documentElement.clientWidth > 1080,
  );

  useEffect(() => {
    watchClientWidth();
    window.addEventListener('resize', watchClientWidth);
  }, []);

  function watchClientWidth() {
    let clientWidth = document.documentElement.clientWidth;
    if (clientWidth < 1080) {
      setVisible(false);
      message.warning('请保证您的窗口宽带大于1080').then(() => {});
    } else {
      setVisible(true);
    }
  }

  return (
    <Provider store={store}>
      <div>
        <Skeleton loading={!visible} active>
          <ProcessDesigner />
        </Skeleton>
      </div>
    </Provider>
  );
}
