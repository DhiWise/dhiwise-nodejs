const mongoose = require('mongoose');
const { MODULE } = require('../../constants/common');

const schema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.APPLICATION.MODEL_NAME,
  },
  type: {
    type: 'number',
    default: 1,
  },
  config: { type: mongoose.Schema.Types.Mixed },
  output: { type: mongoose.Schema.Types.Mixed },
  projectPath: { type: 'string' },
  status: {
    type: 'number',
    default: 1,
  },
  versionNumber: {
    type: 'number',
    default: 0,
  },
  semanticVersionNumber: { type: 'string' },
  inProcessStatus: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      build_app: 0,
      get_apk: 0,
    },
  },
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
module.exports = mongoose.model(MODULE.GENERATOR.MODEL_NAME, schema);
