// Generated by CoffeeScript 2.3.1
var cache, seqRE, types;

seqRE = /TABLE|SELECTION<ARRAY>/;

cache = Object.create(null);

types = exports;

types.get = function(actionId) {
  return cache[actionId];
};

types.set = function(values) {
  var actionId, value;
  for (actionId in values) {
    value = values[actionId];
    cache[actionId] = value;
  }
};

types.DATUM = 'DATUM';

// TABLE becomes SELECTION<ARRAY>
types.SEQUENCE = function(ctx) {
  if (seqRE.test(ctx.type)) {
    return 'SELECTION<ARRAY>';
  }
  return 'DATUM';
};

// TABLE and SELECTION<ARRAY> become SELECTION
types.SELECTION = function(ctx) {
  if (seqRE.test(ctx.type)) {
    return 'SELECTION';
  }
  return 'DATUM';
};

// When `args[0]` is numeric, TABLE and SELECTION<ARRAY> become SELECTION
types.BRACKET = function(ctx, args) {
  if (typeof args[0] !== 'string') {
    if (seqRE.test(ctx.type)) {
      return 'SELECTION';
    }
  }
  return 'DATUM';
};