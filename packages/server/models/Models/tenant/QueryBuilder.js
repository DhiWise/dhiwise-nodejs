const mongoose = require('mongoose');
const { MODULE } = require('../../constants/common');

const schema = new mongoose.Schema({

  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.APPLICATION.MODEL_NAME,
  },
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
  outputVariable: { type: 'string' },
  filter: { type: mongoose.Schema.Types.Mixed },
  filterJson: { type: mongoose.Schema.Types.Mixed },
  populate: { type: 'array' },
  select: { type: 'array' },
  code: { type: 'string' },
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
module.exports = mongoose.model(MODULE.QUERY_BUILDER.MODEL_NAME, schema);
