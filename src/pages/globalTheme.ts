// ts: 全局主题常量

export type ThemeData = {
  borderRadius: number;
  colorPrimary: string;
  darkBgColor: string;
  lightBgColor: string;
  darkPaletteBgColor: string;
  lightPaletteBgColor: string;
  darkCanvasBgColor: string;
  lightCanvasBgColor: string;
};

// 默认主题变量
export const defaultThemeData: ThemeData = {
  borderRadius: 6,
  // 基础主题色
  colorPrimary: '#FF33CC',
  // 背景色：dark模式
  darkBgColor: '#000000',
  // 背景色：light模式
  lightBgColor: '#ffffff',
  // palette背景色：dark模式
  darkPaletteBgColor: '#000000',
  // palette背景色：light模式
  lightPaletteBgColor: '#ffffff',
  // Canvas背景色：dark模式
  darkCanvasBgColor: '#424242',
  // Canvas背景色：light模式
  lightCanvasBgColor: '#dbdbdb',
};

// 暗夜主题变量
export const darkThemeData: any = {
  // 文本色
  colorText: 'rgba(255, 255, 255, 0.85)',
  colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
  colorTextTertiary: 'rgba(255, 255, 255, 0.45)',
  colorTextQuaternary: 'rgba(255, 255, 255, 0.25)',
  // 描边色
  colorBorder: '#424242',
  colorBorderSecondary: '#303030',

  // 填充色
  colorFill: 'rgba(255, 255, 255, 0.18)',
  colorFillSecondary: 'rgba(255, 255, 255, 0.12)',
  colorFillTertiary: 'rgba(255, 255, 255, 0.08)',
  colorFillQuaternary: 'rgba(255, 255, 255, 0.04)',
  // 背景色
  colorBgContainer: '#141414',
  colorBgElevated: '#000000',
  colorBgLayout: '#000000',
  colorBgSpotlight: '#424242',
  colorBgMask: 'rgba(0, 0, 0, 0.45)',

  // 品牌主色
  colorPrimaryBg: '#111a2c',
};
