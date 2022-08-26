// ts: 监听器通用方法

import {
  field_type,
  listener_type,
  script_type,
  task_event_type,
} from '@/bpmn/panel/ElementListener/data-self';
import { IdGenerator } from '@/bpmn/util/idUtil';

/**
 * 创建 监听器实例
 * @param options [id, event, listenerType, expression, delegateExpression, class, fields]
 * @param isTask
 * @param prefix
 */
export function createListenerObject(
  options: any,
  isTask: boolean,
  prefix: string,
) {
  const listenerObj = Object.create(null);
  listenerObj.event = options.event;
  isTask && (listenerObj.id = options.id); // 任务监听器特有的 id 字段
  switch (options.listenerType) {
    case listener_type.script:
      listenerObj.script = createScriptObject(options, prefix);
      break;
    case listener_type.expression:
      listenerObj.expression = options.expression;
      break;
    case listener_type.delegateExpression:
      listenerObj.delegateExpression = options.delegateExpression;
      break;
    default:
      listenerObj.class = options.class;
  }
  // 注入字段
  if (options.fields) {
    listenerObj.fields = options.fields.map((field: any) => {
      return createFieldObject(field, prefix);
    });
  }
  // 任务监听器的 定时器 设置
  if (
    isTask &&
    options.event === task_event_type.timeout &&
    !!options.timerType
  ) {
    const timeDefinition = window.bpmnInstance?.moddle.create(
      'bpmn:FormalExpression',
      {
        body: options.timerValue,
      },
    );
    const timerEventDefinition = window.bpmnInstance?.moddle.create(
      'bpmn:TimerEventDefinition',
      {
        id: `TimerEventDefinition_${IdGenerator('', 8)}`,
        [options.timerType]: timeDefinition,
      },
    );
    listenerObj.eventDefinitions = [timerEventDefinition];
  }
  return window.bpmnInstance?.moddle.create(
    `${prefix}:${isTask ? 'TaskListener' : 'ExecutionListener'}`,
    listenerObj,
  );
}

/**
 * 创建 监听器注入字段
 * @param option [name, fieldType, string, expression]
 * @param prefix
 */
export function createFieldObject(option: any, prefix: string) {
  const { name, fieldType, string, expression } = option;
  const fieldConfig =
    fieldType === field_type.string ? { name, string } : { name, expression };
  return window.bpmnInstance?.moddle.create(`${prefix}:Field`, fieldConfig);
}

/**
 * 创建 脚本实例
 * @param options [scriptType, scriptFormat, value, resource]
 * @param prefix
 */
export function createScriptObject(options: any, prefix: string) {
  const { scriptType, scriptFormat, value, resource } = options;
  const scriptConfig =
    scriptType === script_type.inlineScript
      ? { scriptFormat, value }
      : { scriptFormat, resource };
  return window.bpmnInstance?.moddle.create(`${prefix}:Script`, scriptConfig);
}
