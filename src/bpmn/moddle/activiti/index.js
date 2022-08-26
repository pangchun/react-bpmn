/*
 * @author igdianov
 * address https://github.com/igdianov/activiti-bpmn-moddle
 * */

module.exports = {
  __init__: ['activitiExtension'],
  activitiExtension: ['type', require('./ActivitiExtension')],
};
