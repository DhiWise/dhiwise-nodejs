const mongoose = require('mongoose');
const {
  MODULE, SUB_MODULE,
} = require('../../constants/common');

const schema = new mongoose.Schema({

  semanticVersion: { type: 'string' },
  version: { type: 'string' },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.APPLICATION.MODEL_NAME,
  },
  adapter: { type: 'string' },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
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
module.exports = mongoose.model(SUB_MODULE.SCHEMA_UPLOAD_VERSION.MODEL_NAME, schema);
