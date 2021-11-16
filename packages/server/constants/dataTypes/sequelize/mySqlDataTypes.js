/* global _ */

let DATA_TYPES = require('../dataTypes');

/**
 * To omit some properties from defined dataTypes.
 * Ex:
 */

/*
 * const STRING = { ...DATA_TYPES.STRING, ...{ NA_PROPS: [PROPS.DEFAULT] } };
 * const ARRAY = { ...DATA_TYPES.ARRAY, ...{ NA_PROPS: [PROPS.REQUIRED] } };
 *
 * DATA_TYPES = { ...DATA_TYPES, ...{ STRING, ARRAY } };
 */

DATA_TYPES = _.omit(DATA_TYPES, [
  DATA_TYPES.UUID.VALUE,
  DATA_TYPES.UUIDV4.VALUE,
  DATA_TYPES.BLOB.VALUE,
  DATA_TYPES.JSONB.VALUE,
  DATA_TYPES.ARRAY.VALUE,
  DATA_TYPES.RANGE.VALUE,
]);
module.exports = { DATA_TYPES };
