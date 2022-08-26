'use strict';

var isFunction = require('min-dash').isFunction,
  isObject = require('min-dash').isObject,
  some = require('min-dash').some;

var WILDCARD = '*';

function FlowableExtension(eventBus) {
  var self = this;

  eventBus.on('moddleCopy.canCopyProperty', function (context) {
    var property = context.property,
      parent = context.parent;

    return self.canCopyProperty(property, parent);
  });
}

FlowableExtension.$inject = ['eventBus'];

/**
 * Check wether to disallow copying property.
 */
FlowableExtension.prototype.canCopyProperty = function (property, parent) {
  // (1) check wether property is allowed in parent
  if (isObject(property) && !isAllowedInParent(property, parent)) {
    return false;
  }

  // (2) check more complex scenarios

  if (
    is(property, 'flowable:InputOutput') &&
    !this.canHostInputOutput(parent)
  ) {
    return false;
  }

  if (
    isAny(property, ['flowable:Connector', 'flowable:Field']) &&
    !this.canHostConnector(parent)
  ) {
    return false;
  }

  if (is(property, 'flowable:In') && !this.canHostIn(parent)) {
    return false;
  }
};

FlowableExtension.prototype.canHostInputOutput = function (parent) {
  // allowed in flowable:Connector
  var connector = getParent(parent, 'flowable:Connector');

  if (connector) {
    return true;
  }

  // special rules inside bpmn:FlowNode
  var flowNode = getParent(parent, 'bpmn:FlowNode');

  if (!flowNode) {
    return false;
  }

  if (
    isAny(flowNode, ['bpmn:StartEvent', 'bpmn:Gateway', 'bpmn:BoundaryEvent'])
  ) {
    return false;
  }

  if (is(flowNode, 'bpmn:SubProcess') && flowNode.get('triggeredByEvent')) {
    return false;
  }

  return true;
};

FlowableExtension.prototype.canHostConnector = function (parent) {
  var serviceTaskLike = getParent(parent, 'flowable:ServiceTaskLike');

  if (is(serviceTaskLike, 'bpmn:MessageEventDefinition')) {
    // only allow on throw and end events
    return (
      getParent(parent, 'bpmn:IntermediateThrowEvent') ||
      getParent(parent, 'bpmn:EndEvent')
    );
  }

  return true;
};

FlowableExtension.prototype.canHostIn = function (parent) {
  var callActivity = getParent(parent, 'bpmn:CallActivity');

  if (callActivity) {
    return true;
  }

  var signalEventDefinition = getParent(parent, 'bpmn:SignalEventDefinition');

  if (signalEventDefinition) {
    // only allow on throw and end events
    return (
      getParent(parent, 'bpmn:IntermediateThrowEvent') ||
      getParent(parent, 'bpmn:EndEvent')
    );
  }

  return true;
};

module.exports = FlowableExtension;

// helpers //////////

function is(element, type) {
  return (
    element && isFunction(element.$instanceOf) && element.$instanceOf(type)
  );
}

function isAny(element, types) {
  return some(types, function (t) {
    return is(element, t);
  });
}

function getParent(element, type) {
  if (!type) {
    return element.$parent;
  }

  if (is(element, type)) {
    return element;
  }

  if (!element.$parent) {
    return;
  }

  return getParent(element.$parent, type);
}

function isAllowedInParent(property, parent) {
  // (1) find property descriptor
  var descriptor =
    property.$type && property.$model.getTypeDescriptor(property.$type);

  var allowedIn = descriptor && descriptor.meta && descriptor.meta.allowedIn;

  if (!allowedIn || isWildcard(allowedIn)) {
    return true;
  }

  // (2) check wether property has parent of allowed type
  return some(allowedIn, function (type) {
    return getParent(parent, type);
  });
}

function isWildcard(allowedIn) {
  return allowedIn.indexOf(WILDCARD) !== -1;
}
