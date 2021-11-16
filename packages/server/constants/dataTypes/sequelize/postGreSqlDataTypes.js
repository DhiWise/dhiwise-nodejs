const DATA_TYPES = require('../dataTypes');
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

module.exports = { DATA_TYPES };
