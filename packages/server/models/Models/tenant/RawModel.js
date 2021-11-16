const mongoose = require('mongoose');
const { MODULE } = require('../../constants/common');

const schema = new mongoose.Schema({

  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.APPLICATION.MODEL_NAME,
  },
  modelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.SCHEMA.MODEL_NAME,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.RAW_MODEL.MODEL_NAME,
    default: null,
  },
  // attribute level from main parent
  level: {
    type: 'number',
    default: 1,
  },
  // siblings sequence
  sequence: {
    type: 'number',
    default: 1,
  },
  attribute: { type: 'string' },
  dataType: {
    type: 'string',
    default: '',
  },
  /**
   * 1:none
   * 2:as define
   * 3:current time
   * 4:null
   * 4:empty string
   */
  defaultValueType: {
    type: 'number',
    default: 1,
  },
  defaultValue: { type: mongoose.Schema.Types.Mixed },
  isRequired: {
    type: 'boolean',
    default: false,
  },
  isUnique: {
    type: 'boolean',
    default: false,
  },
  isAllowNull: {
    type: 'boolean',
    default: false,
  },
  isAutoIncrement: {
    type: 'boolean',
    default: false,
  },
  description: { type: 'string' },
  enumValues: { type: mongoose.Schema.Types.Array },

  // relation

  relationModel: { type: 'string' },
  relationAttribute: { type: 'string' },
  relationType: { type: 'string' },

  isDeleted: {
    type: 'boolean',
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  dataId: { type: 'string' },
}, { timestamps: true }, { toJSON: { virtuals: true } });
schema.index({
  dataId: 1,
  isActive: 1,
  isDeleted: 1,
});
module.exports = mongoose.model(MODULE.RAW_MODEL.MODEL_NAME, schema);
