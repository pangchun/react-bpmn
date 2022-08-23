import { AppDispatch, RootState } from '@/redux/store/store';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// 在整个应用程序中使用，而不是简单的 `useDispatch` 和 `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
