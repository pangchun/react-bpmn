//tips： 这些数据是从bpmn-js包下的bpmn-js-properties-panel源码中获取的，搜索FormField与FormDataProps可以查看

export const form_field_type = {
  long: 'long',
  string: 'string',
  boolean: 'boolean',
  enum: 'enum',
  date: 'date',
  custom: 'custom',
};

export const form_field_type_options = [
  {
    name: '长整型',
    value: form_field_type.long,
  },
  {
    name: '字符串',
    value: form_field_type.string,
  },
  {
    name: '布尔值',
    value: form_field_type.boolean,
  },
  {
    name: '枚举值',
    value: 'enum',
  },
  {
    name: '时间日期',
    value: 'date',
  },
  {
    name: '自定义类型',
    value: 'custom',
  },
];

/**
 * 通过字段类型查询字段类型名称
 * @param type 类型 form_field_type
 */
export function getFormFieldNameByType(type: string) {
  const option = form_field_type_options.find((e) => e.value === type);
  if (option === undefined) {
    throw new Error('传入非法类型');
  }
  return option.name;
}
