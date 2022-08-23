import CustomDesigner from '@/components/CustomDesigner/CustomDesigner';
import { Provider } from 'react-redux';
import { store } from '@/redux/store/store';

export default function IndexPage() {
  return (
    <Provider store={store}>
      <div>
        <CustomDesigner />
      </div>
    </Provider>
  );
}
