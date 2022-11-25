// ts: uuid生成

/**
 * 手动生成唯一id
 *
 * @param prefix 前缀
 * @param length 长度，默认8
 * @constructor
 */
export function UUIdGenerator(prefix: string, length: number = 8) {
  let id: string = prefix ? prefix + '_' : '';
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = length; i > 0; --i) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

/**
 * 根据当前时间生成唯一id
 * 1、返回格式如：process_1667396671442 (前缀为process)
 *
 * @param prefix 前缀
 * @constructor
 */
export function TimeIdGenerator(prefix: string) {
  let id: string = prefix ? prefix + '_' : '';
  return `${prefix}_${new Date().getTime()}`;
}

/**
 * 根据时间生成流程id
 * 1、返回格式如：Process_1667396671442
 *
 * @constructor
 */
export function ProcessIdGenerator() {
  return TimeIdGenerator('Process');
}
