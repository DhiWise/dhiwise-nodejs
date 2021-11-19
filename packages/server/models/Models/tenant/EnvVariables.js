const mongoose = require('mongoose');
const { MODULE } = require('../../constants/common');

const schema = new mongoose.Schema({

  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.APPLICATION.MODEL_NAME,
  },
  environments: {
    type: 'array',
    columnType: 'array',
  },
  customJson: { type: mongoose.Schema.Types.Mixed },
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

module.exports = mongoose.model(MODULE.ENV_VARIABLES.MODEL_NAME, schema);
