const mongoose = require('mongoose');
const { MODULE } = require('../../constants/common');
const { CONSTANT_GENERATE_TYPE } = require('../../constants/project');

const schema = new mongoose.Schema({

  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.APPLICATION.MODEL_NAME,
  },
  fileName: { type: 'string' },
  type: {
    type: 'number',
    default: CONSTANT_GENERATE_TYPE.AUTO,
  },
  customJson: { type: mongoose.Schema.Types.Mixed },
  isActive: {
    type: 'boolean',
    default: true,
  },
  modelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.SCHEMA.MODEL_NAME,
  },
  description: { type: 'string' },
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
module.exports = mongoose.model(MODULE.PROJECT_CONSTANT.MODEL_NAME, schema);
