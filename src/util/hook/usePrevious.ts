import { useEffect, useRef } from 'react';

/**
 * 自定义hook
 * 1、用户获取state的旧值；
 * @param value
 */
export function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
