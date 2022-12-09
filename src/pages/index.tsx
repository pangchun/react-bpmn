import ProcessDesigner from '@/components/ProcessDesigner/ProcessDesigner';
import { Provider } from 'react-redux';
import { store } from '@/redux/store/store';
import { ConfigProvider } from 'antd';
import { useState } from 'react';

// 引入样式
import './index.less';
import { defaultData, ThemeData } from '@/pages/globalTheme';

export default function IndexPage() {
  const [data, setData] = useState<ThemeData>(defaultData);

  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: data.colorPrimary,
            borderRadius: data.borderRadius,
          },
        }}
      >
        <div>
          <ProcessDesigner />
        </div>
      </ConfigProvider>
    </Provider>
  );
}
