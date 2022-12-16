//tips： 这些数据是从bpmn-js包下的bpmn-js-properties-panel源码中获取的，搜索FormField与FormDataProps可以查看

// 表单字段类型
export const form_field_type = {
  long: 'long',
  string: 'string',
  boolean: 'boolean',
  enum: 'enum',
  date: 'date',
  custom: 'custom',
};

// 表单字段类型下拉项
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
    value: form_field_type.enum,
  },
  {
    name: '日期',
    value: form_field_type.date,
  },
  {
    name: '自定义类型',
    value: form_field_type.custom,
  },
];

/**
 * 校验是否为自定义类型
 *
 * @param type
 */
export function checkIsCustomType(type: string) {
  return (
    type !== form_field_type.boolean &&
    type !== form_field_type.long &&
    type !== form_field_type.date &&
    type !== form_field_type.string &&
    type !== form_field_type.enum
  );
}

/**
 * 通过字段类型查询字段类型下拉项
 *
 * @param type
 */
export function getFormFieldNameByType(type: string) {
  let option = form_field_type_options.find((e) => e.value === type);
  if (!option) {
    option = form_field_type_options.find(
      (e) => e.value === form_field_type.custom,
    );
  }
  return option;
}
