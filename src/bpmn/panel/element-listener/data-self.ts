//tips： 执行监听器/用户任务监听器 通用数据

// 执行监听器 事件类型
export const EXECUTE_EVENT_TYPE = {
  start: 'start',
  end: 'end',
};

export const EXECUTE_EVENT_TYPE_OPTIONS = [
  {
    name: '开始',
    value: EXECUTE_EVENT_TYPE.start,
  },
  {
    name: '结束',
    value: EXECUTE_EVENT_TYPE.end,
  },
];

// 任务监听器 事件类型
export const TASK_EVENT_TYPE = {
  create: '创建',
  assignment: '指派',
  complete: '完成',
  delete: '删除',
  update: '更新',
  timeout: '超时',
};

export const TASK_EVENT_TYPE_OPTIONS = [
  {
    name: 'create',
    value: TASK_EVENT_TYPE.create,
  },
  {
    name: 'assignment',
    value: TASK_EVENT_TYPE.assignment,
  },
  {
    name: 'complete',
    value: TASK_EVENT_TYPE.complete,
  },
  {
    name: 'delete',
    value: TASK_EVENT_TYPE.delete,
  },
  {
    name: 'update',
    value: TASK_EVENT_TYPE.update,
  },
  {
    name: 'timeout',
    value: TASK_EVENT_TYPE.timeout,
  },
];

// 任务监听器 定时器类型
export const TIMER_TYPE = {
  timeDate: 'timeDate',
  timeCycle: 'timeCycle',
  timeDuration: 'timeDuration',
  none: '',
};

export const TIMER_TYPE_OPTIONS = [
  {
    name: '日期',
    value: TIMER_TYPE.timeDate,
  },
  {
    name: '循环',
    value: TIMER_TYPE.timeCycle,
  },
  {
    name: '持续时间',
    value: TIMER_TYPE.timeDuration,
  },
  {
    name: '无',
    value: TIMER_TYPE.none,
  },
];

// 执行监听器/用户任务监听器 监听器类型
export const LISTENER_EVENT_TYPE = {
  class: 'class',
  expression: 'expression',
  delegateExpression: 'delegateExpression',
  script: 'script',
};

export const LISTENER_EVENT_TYPE_OPTIONS = [
  {
    name: 'Java 类',
    value: LISTENER_EVENT_TYPE.class,
  },
  {
    name: '表达式',
    value: LISTENER_EVENT_TYPE.expression,
  },
  {
    name: '代理表达式',
    value: LISTENER_EVENT_TYPE.delegateExpression,
  },
  {
    name: '脚本',
    value: LISTENER_EVENT_TYPE.script,
  },
];

export function encapsulateListener(listener: any) {
  let listenerType: any;
  if (listener.class) {
    listenerType = LISTENER_EVENT_TYPE_OPTIONS.find(
      (e) => e.value === LISTENER_EVENT_TYPE.class,
    );
  } else if (listener.expression) {
    listenerType = LISTENER_EVENT_TYPE_OPTIONS.find(
      (e) => e.value === LISTENER_EVENT_TYPE.expression,
    );
  } else if (listener.delegateExpression) {
    listenerType = LISTENER_EVENT_TYPE_OPTIONS.find(
      (e) => e.value === LISTENER_EVENT_TYPE.delegateExpression,
    );
  } else if (listener.script) {
    listenerType = LISTENER_EVENT_TYPE_OPTIONS.find(
      (e) => e.value === LISTENER_EVENT_TYPE.script,
    );
  }
  return {
    ...JSON.parse(JSON.stringify(listener)),
    ...(listener.script ?? {}),
    listenerType,
  };
}

// 执行监听器/用户任务监听器 脚本类型
export const SCRIPT_TYPE = {
  inlineScript: 'inlineScript',
  externalResource: 'externalResource',
};

export const SCRIPT_TYPE_OPTIONS = [
  {
    name: '内联脚本',
    value: SCRIPT_TYPE.inlineScript,
  },
  {
    name: '外部脚本',
    value: SCRIPT_TYPE.externalResource,
  },
];

// 执行监听器/用户任务监听器 字段类型
export const FIELD_TYPE = {
  string: 'string',
  expression: 'expression',
};

export const FIELD_TYPE_OPTIONS = [
  {
    name: '字符串',
    value: FIELD_TYPE.string,
  },
  {
    name: '表达式',
    value: FIELD_TYPE.expression,
  },
];

export function encapsulateField(field: any) {
  let fieldType: any;
  if (field.string) {
    fieldType = FIELD_TYPE_OPTIONS.find((e) => e.value === FIELD_TYPE.string);
  } else if (field.expression) {
    fieldType = LISTENER_EVENT_TYPE_OPTIONS.find(
      (e) => e.value === FIELD_TYPE.expression,
    );
  }
  return {
    ...JSON.parse(JSON.stringify(field)),
    fieldType,
  };
}
