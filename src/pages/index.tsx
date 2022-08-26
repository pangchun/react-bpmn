import ProcessDesigner from '@/components/CustomDesigner/ProcessDesigner';
import { Provider } from 'react-redux';
import { store } from '@/redux/store/store';

export default function IndexPage() {
  return (
    <Provider store={store}>
      <div>
        <ProcessDesigner />
      </div>
    </Provider>
  );
}
