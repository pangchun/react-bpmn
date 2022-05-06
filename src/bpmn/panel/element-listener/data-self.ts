//tips： 执行监听器/用户任务监听器 通用数据

// 执行监听器 事件类型
export const EXECUTE_EVENT_TYPE = {
  start: 'start',
  end: 'end',
};

export const EXECUTE_EVENT_TYPE_OPTIONS = [
  {
    name: 'start',
    value: EXECUTE_EVENT_TYPE.start,
  },
  {
    name: 'end',
    value: EXECUTE_EVENT_TYPE.end,
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
    listenerType: listenerType,
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
