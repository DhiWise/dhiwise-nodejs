const mongoose = require('mongoose');
const { MODULE } = require('../../constants/common');

const schema = new mongoose.Schema({

  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.APPLICATION.MODEL_NAME,
  },
  platform: { type: 'string' },
  operation: { type: 'string' },
  operationMode: { type: 'string' },

  referenceId: { type: mongoose.Schema.Types.ObjectId },

  referenceType: { type: 'number' },

  requestParams: { type: mongoose.Schema.Types.Mixed },

  requestModelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.SCHEMA.MODEL_NAME,
  },

  requestModel: { type: 'string' },

  model: { type: 'string' },

  modelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.SCHEMA.MODEL_NAME,
  },

  queryMode: { type: 'string' },

  existingVariable: { type: 'string' },

  outputVariable: { type: 'string' },

  filter: { type: mongoose.Schema.Types.Mixed },

  filterJson: { type: mongoose.Schema.Types.Mixed },

  populate: { type: 'array' },

  select: { type: 'array' },

  isActive: {
    type: 'boolean',
    default: true,
  },

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
module.exports = mongoose.model(MODULE.NESTED_QUERY_BUILDER.MODEL_NAME, schema);
