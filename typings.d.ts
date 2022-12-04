declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}

// tsx 默认不引入js，设置忽略类型 todo 2022/12/4 查询react怎么引入js可以点击跳转方法的
declare module '*';
