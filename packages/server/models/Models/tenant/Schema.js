const mongoose = require('mongoose');
const { MODULE } = require('../../constants/common');

const schema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.APPLICATION.MODEL_NAME,
  },
  name: {
    type: 'string',
    required: true,
  },
  tableName: { type: 'string' },
  description: { type: 'string' },
  schemaJson: { type: mongoose.Schema.Types.Mixed },
  hooks: [{
    type: { type: 'string' },
    operation: { type: 'string' },
    code: { type: mongoose.Schema.Types.Mixed },
  }],

  modelIndexes: [{
    name: { type: 'string' },
    isParserRequired: { // temp key for if parse required for old data
      type: 'boolean',
      default: false,
    },
    indexFields: { type: mongoose.Schema.Types.Mixed },
    options: { type: mongoose.Schema.Types.Mixed },
    isDefault: {
      type: 'boolean',
      default: false,
    },
    indexType: { type: 'string' },
    fields: { type: 'array' },
    operator: { type: 'string' },
  }],

  customJson: { additionalSetting: { type: mongoose.Schema.Types.Mixed } },
  adapter: { type: 'string' },
  isDefault: {
    type: 'boolean',
    default: false,
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
module.exports = mongoose.model(MODULE.SCHEMA.MODEL_NAME, schema);
