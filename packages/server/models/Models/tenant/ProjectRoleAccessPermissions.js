const mongoose = require('mongoose');
const { MODULE } = require('../../constants/common');

const schema = new mongoose.Schema({

  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.APPLICATION.MODEL_NAME,
  },
  name: { type: 'string' },
  description: { type: 'string' },
  customJson: [{
    _id: false,
    modelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODULE.SCHEMA.MODEL_NAME,
    },
    actions: { type: mongoose.Schema.Types.Mixed },
  }],
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
module.exports = mongoose.model(MODULE.PROJECT_ROLE_ACCESS_PERMISSIONS.MODEL_NAME, schema);
