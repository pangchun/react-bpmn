import ProcessDesigner from '@/components/ProcessDesigner/ProcessDesigner';
import { Provider } from 'react-redux';
import { store } from '@/redux/store/store';

// 引入样式
import './index.less';

export default function IndexPage() {
  return (
    <Provider store={store}>
      <div>
        <ProcessDesigner />
      </div>
    </Provider>
  );
}
