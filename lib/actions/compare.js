// Generated by CoffeeScript 2.3.1
// TODO: Comparison of objects/arrays with `gt`, `lt`, `ge`, `le`
var actions, arity, equals, isFalse, types, utils;

arity = require('./arity');

types = require('./types');

utils = require('../utils');

arity.set({
  eq: arity.ONE_PLUS,
  ne: arity.ONE_PLUS,
  gt: arity.ONE_PLUS,
  lt: arity.ONE_PLUS,
  ge: arity.ONE_PLUS,
  le: arity.ONE_PLUS,
  or: arity.ONE_PLUS,
  and: arity.ONE_PLUS
});

types.set({
  eq: types.DATUM,
  ne: types.DATUM,
  gt: types.DATUM,
  lt: types.DATUM,
  ge: types.DATUM,
  le: types.DATUM,
  or: types.DATUM,
  and: types.DATUM
});

actions = exports;

actions.eq = function(result, args) {
  return equals(result, args);
};

actions.ne = function(result, args) {
  return !equals(result, args);
};

actions.gt = function(result, args) {
  var arg, i, len, prev;
  prev = result;
  for (i = 0, len = args.length; i < len; i++) {
    arg = args[i];
    if (prev <= arg) {
      return false;
    }
    prev = arg;
  }
  return true;
};

actions.lt = function(result, args) {
  var arg, i, len, prev;
  prev = result;
  for (i = 0, len = args.length; i < len; i++) {
    arg = args[i];
    if (prev >= arg) {
      return false;
    }
    prev = arg;
  }
  return true;
};

actions.ge = function(result, args) {
  var arg, i, len, prev;
  prev = result;
  for (i = 0, len = args.length; i < len; i++) {
    arg = args[i];
    if (prev < arg) {
      return false;
    }
    prev = arg;
  }
  return true;
};

actions.le = function(result, args) {
  var arg, i, len, prev;
  prev = result;
  for (i = 0, len = args.length; i < len; i++) {
    arg = args[i];
    if (prev > arg) {
      return false;
    }
    prev = arg;
  }
  return true;
};

actions.or = function(result, args) {
  var arg, i, len;
  if (!isFalse(result)) {
    return result;
  }
  for (i = 0, len = args.length; i < len; i++) {
    arg = args[i];
    if (!isFalse(arg)) {
      return arg;
    }
  }
  return args.pop();
};

actions.and = function(result, args) {
  var arg, i, len;
  if (isFalse(result)) {
    return result;
  }
  for (i = 0, len = args.length; i < len; i++) {
    arg = args[i];
    if (isFalse(arg)) {
      return arg;
    }
  }
  return args.pop();
};


// Helpers

equals = function(result, args) {
  var arg, i, len;
  for (i = 0, len = args.length; i < len; i++) {
    arg = args[i];
    if (!utils.equals(result, arg)) {
      return false;
    }
  }
  return true;
};

isFalse = function(value) {
  return (value === null) || (value === false);
};