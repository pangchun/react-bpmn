// ts: uuid生成

/**
 * 生成唯一id
 * @param prefix 前缀
 * @param length 长度，默认8
 * @constructor
 */
export function IdGenerator(prefix: string, length: number = 8) {
  let id: string = prefix ? prefix + '-' : '';
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = length; i > 0; --i) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}
