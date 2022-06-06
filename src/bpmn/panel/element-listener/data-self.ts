//tips： 执行监听器/用户任务监听器 通用数据

// 执行监听器 事件类型
export const execute_event_type = {
  start: 'start',
  end: 'end',
};

export const execute_event_type_options = [
  {
    name: '开始',
    value: execute_event_type.start,
  },
  {
    name: '结束',
    value: execute_event_type.end,
  },
];

// 任务监听器 事件类型
export const task_event_type = {
  create: '创建',
  assignment: '指派',
  complete: '完成',
  delete: '删除',
  update: '更新',
  timeout: '超时',
};

export const task_event_type_options = [
  {
    name: 'create',
    value: task_event_type.create,
  },
  {
    name: 'assignment',
    value: task_event_type.assignment,
  },
  {
    name: 'complete',
    value: task_event_type.complete,
  },
  {
    name: 'delete',
    value: task_event_type.delete,
  },
  {
    name: 'update',
    value: task_event_type.update,
  },
  {
    name: 'timeout',
    value: task_event_type.timeout,
  },
];

// 任务监听器 定时器类型
export const timer_type = {
  timeDate: 'timeDate',
  timeCycle: 'timeCycle',
  timeDuration: 'timeDuration',
  none: '',
};

export const timer_type_options = [
  {
    name: '日期',
    value: timer_type.timeDate,
  },
  {
    name: '循环',
    value: timer_type.timeCycle,
  },
  {
    name: '持续时间',
    value: timer_type.timeDuration,
  },
  {
    name: '无',
    value: timer_type.none,
  },
];

// 执行监听器/用户任务监听器 监听器类型
export const listener_event_type = {
  class: 'class',
  expression: 'expression',
  delegateExpression: 'delegateExpression',
  script: 'script',
};

export const listener_event_type_options = [
  {
    name: 'Java 类',
    value: listener_event_type.class,
  },
  {
    name: '表达式',
    value: listener_event_type.expression,
  },
  {
    name: '代理表达式',
    value: listener_event_type.delegateExpression,
  },
  {
    name: '脚本',
    value: listener_event_type.script,
  },
];

export function encapsulateListener(listener: any) {
  let listenerType: any;
  if (listener.class) {
    listenerType = listener_event_type_options.find(
      (e) => e.value === listener_event_type.class,
    );
  } else if (listener.expression) {
    listenerType = listener_event_type_options.find(
      (e) => e.value === listener_event_type.expression,
    );
  } else if (listener.delegateExpression) {
    listenerType = listener_event_type_options.find(
      (e) => e.value === listener_event_type.delegateExpression,
    );
  } else if (listener.script) {
    listenerType = listener_event_type_options.find(
      (e) => e.value === listener_event_type.script,
    );
  }
  return {
    ...JSON.parse(JSON.stringify(listener)),
    ...(listener.script ?? {}),
    listenerType,
  };
}

// 执行监听器/用户任务监听器 脚本类型
export const script_type = {
  inlineScript: 'inlineScript',
  externalResource: 'externalResource',
};

export const script_type_options = [
  {
    name: '内联脚本',
    value: script_type.inlineScript,
  },
  {
    name: '外部脚本',
    value: script_type.externalResource,
  },
];

// 执行监听器/用户任务监听器 字段类型
export const field_type = {
  string: 'string',
  expression: 'expression',
};

export const field_type_options = [
  {
    name: '字符串',
    value: field_type.string,
  },
  {
    name: '表达式',
    value: field_type.expression,
  },
];

export function encapsulateField(field: any) {
  let fieldType: any;
  if (field.string) {
    fieldType = field_type_options.find((e) => e.value === field_type.string);
  } else if (field.expression) {
    fieldType = listener_event_type_options.find(
      (e) => e.value === field_type.expression,
    );
  }
  return {
    ...JSON.parse(JSON.stringify(field)),
    fieldType,
  };
}
