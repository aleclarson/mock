isPlainObj = require 'is-plain-object'
TypeError = require 'type-error'
slice = require 'lodash.slice'

Table = require './Table'
Query = require './Query'
utils = require './utils'

{isArray} = Array

define = Object.defineProperty
setProto = Object.setPrototypeOf
tableRE = /^[A-Z0-9_]+$/i

Database = (name) ->
  if typeof name != 'string'
    throw TypeError String, name

  r = (value) -> r.expr value
  r._name = name

  define r, '_tables',
    value: {}
    writable: true

  setProto r, Database.prototype
  return r

methods = {}

methods.init = (tables) ->
  if !isPlainObj tables
    throw TypeError Object, tables

  for tableId, table of tables
    if !tableRE.test tableId
      throw Error "Table name `#{tableId}` invalid (Use A-Za-z0-9_ only)"

    if !isArray table
      throw TypeError Array, table
    @_tables[tableId] = table
  return

methods.load = ->
  filePath = require('path').resolve.apply null, arguments
  json = require('fs').readFileSync filePath, 'utf8'
  @_tables = JSON.parse json
  return

methods.table = (tableId) ->
  if tableId == undefined
    throw Error 'Cannot convert `undefined` with r.expr()'
  return Table this, tableId

# TODO: Support `options` argument
methods.tableCreate = (tableId) ->
  if typeof tableId != 'string'
    throw TypeError String, tableId
  if !tableRE.test tableId
    throw Error "Table name `#{tableId}` invalid (Use A-Za-z0-9_ only)"

  if @_tables.hasOwnProperty tableId
    throw Error "Table `#{@_name + '.' + tableId}` already exists"

  @_tables[tableId] = []
  return Query._expr {tables_created: 1}

methods.tableDrop = (tableId) ->
  if typeof tableId != 'string'
    throw TypeError String, tableId
  if !tableRE.test tableId
    throw Error "Table name `#{tableId}` invalid (Use A-Za-z0-9_ only)"

  if delete @_tables[tableId]
    return Query._expr {tables_dropped: 1}

  throw Error "Table `#{@_name + '.' + tableId}` does not exist"

methods.uuid = require './utils/uuid'

methods.typeOf = (value) ->
  if arguments.length != 1
    throw Error "`typeOf` takes 1 argument, #{arguments.length} provided"
  return Query._expr(value).typeOf()

methods.branch = (cond) ->
  args = slice arguments, 1
  if args.length < 2
    throw Error "`branch` takes at least 3 arguments, #{args.length + 1} provided"
  return Query._branch Query._expr(cond), args

methods.do = (arg) ->
  if !arguments.length
    throw Error '`do` takes at least 1 argument, 0 provided'
  return Query._do Query._expr(arg), slice arguments, 1

# TODO: You cannot have a sequence nested in an expression. You must use `coerceTo` first.
methods.expr = Query._expr

methods.row = Query._row

methods.args = (args) ->

  # TODO: Support passing `r([])` to `r.args`
  if utils.isQuery args
    throw Error 'The first argument of `r.args` cannot be a query (yet)'

  utils.expect args, 'ARRAY'
  args = args.map (arg) ->
    if utils.isQuery(arg) and arg._lazy
      throw Error 'Implicit variable `r.row` cannot be used inside `r.args`'
    return Query._expr arg

  query = Query null, 'ARGS'
  query._eval = (ctx) ->
    ctx.type = 'DATUM'

    values = []
    args.forEach (arg) ->

      if arg._type == 'ARGS'
        values = values.concat arg._run()
        return

      values.push arg._run()
      return

    return values
  return query

# TODO: You cannot have a sequence nested in an object. You must use `coerceTo` first.
methods.object = ->
  args = slice arguments

  if args.length % 2
    throw Error 'Expected an even number of arguments'

  args.forEach (arg, index) ->
    if arg == undefined
      throw Error "Argument #{index} to object may not be `undefined`"

  query = Query null, 'DATUM'
  query._eval = (ctx) ->
    result = {}

    index = 0
    while index < args.length
      key = utils.resolve args[index]
      utils.expect key, 'STRING'
      result[key] = utils.resolve args[index + 1]
      index += 2

    ctx.type = @_type
    return result
  return query

methods.asc = (index) -> {ASC: true, index}
methods.desc = (index) -> {DESC: true, index}

utils.each methods, (value, key) ->
  define Database.prototype, key, {value}

module.exports = Database
