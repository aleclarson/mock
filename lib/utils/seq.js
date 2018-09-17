// Generated by CoffeeScript 2.3.1
var isArray, isPlainObj, seq, utils;

isPlainObj = require('is-plain-object');

utils = require('.');

({isArray} = Array);

seq = exports;

seq.nth = function(array, index) {
  if (index < 0) {
    index = array.length + index;
  }
  if (index < 0 || index >= array.length) {
    throw RangeError('Index out of bounds');
  }
  return array[index];
};

seq.getField = function(array, attr) {
  var i, len, results, value;
  results = [];
  for (i = 0, len = array.length; i < len; i++) {
    value = array[i];
    utils.expect(value, 'OBJECT');
    if (value.hasOwnProperty(attr)) {
      results.push(value[attr]);
    }
  }
  return results;
};

seq.hasFields = function(array, attrs) {
  var i, len, results, value;
  results = [];
  for (i = 0, len = array.length; i < len; i++) {
    value = array[i];
    utils.expect(value, 'OBJECT');
    if (utils.hasFields(value, attrs)) {
      results.push(value);
    }
  }
  return results;
};

// TODO: Throw error for negative indexes on a 'stream'.
seq.slice = function(array, args) {
  var endIndex, options, startIndex;
  options = isPlainObj(args[args.length - 1]) ? args.pop() : {};
  [startIndex, endIndex] = args;
  if (endIndex == null) {
    endIndex = array.length;
  }
  utils.expect(startIndex, 'NUMBER');
  utils.expect(endIndex, 'NUMBER');
  if (options.leftBound === 'open') {
    startIndex += 1;
  }
  if (options.rightBound === 'closed') {
    endIndex += 1;
  }
  return array.slice(startIndex, endIndex);
};

seq.pluck = function(rows, args) {
  return rows.map(function(row) {
    return utils.pluck(row, args);
  });
};

seq.without = function(rows, args) {
  return rows.map(function(row) {
    return utils.without(row, args);
  });
};