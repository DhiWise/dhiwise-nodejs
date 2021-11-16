const mongoose = require('mongoose');
const { MODULE } = require('../../constants/common');
const { ROUTE_GENERATE_TYPE } = require('../../constants/project');

const schema = new mongoose.Schema({

  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.APPLICATION.MODEL_NAME,
  },
  fileName: { type: 'string' },
  method: { type: 'string' },
  route: { type: 'string' },
  controller: { type: 'string' },
  action: { type: 'string' },
  description: { type: 'string' },
  platform: { type: 'string' },
  policies: { type: mongoose.Schema.Types.Mixed },
  type: {
    type: 'number',
    default: ROUTE_GENERATE_TYPE.AUTO,
  },
  customJson: { type: mongoose.Schema.Types.Mixed },
  modelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.SCHEMA.MODEL_NAME,
  },
  groupName: { type: 'string' },
  headers: [{
    _id: false,
    key: { type: 'string' },
    value: { type: 'string' },
  }],
  params: [{
    _id: false,
    key: { type: 'string' },
    value: { type: 'string' },
  }],
  request: { type: mongoose.Schema.Types.Mixed },
  response: { type: mongoose.Schema.Types.Mixed },
  fileUpload: {
    uploads: [
      {
        platform: { type: mongoose.Schema.Types.Mixed },
        validationType: [{ type: 'String' }],
        storage: { type: 'String' },
        authentication: { type: 'boolean' },
        maxSize: { type: 'number' },
        isSingle: { type: 'boolean' },
      },
    ],
  },
  attributes: { type: mongoose.Schema.Types.Mixed },
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
module.exports = mongoose.model(MODULE.PROJECT_ROUTE.MODEL_NAME, schema);
