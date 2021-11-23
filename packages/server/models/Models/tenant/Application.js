const mongoose = require('mongoose');
const { MODULE } = require('../../constants/common');

const schema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.PROJECT.MODEL_NAME,
  },
  generatedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.GENERATOR.MODEL_NAME,
  },
  adminPanelGeneratedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.GENERATOR.MODEL_NAME,
  },
  tempGeneratedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.GENERATOR.MODEL_NAME,
  },
  definitionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.PROJECT_DEFINITION.MODEL_NAME,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.APPLICATION.MODEL_NAME,
  },

  name: {
    type: 'string',
    required: true,
  },
  description: { type: 'string' },
  image: { type: 'string' },

  stepInput: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  configInput: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  isActive: {
    type: 'boolean',
    default: true,
  },
  isDeleted: {
    type: 'boolean',
    default: false,
  },
  isArchive: {
    type: 'boolean',
    default: false,
  },
  isPublic: {
    type: 'boolean',
    default: false,
  },
  isPublicConsent: {
    type: 'boolean',
    default: false,
  },
  port: { type: 'Number' },

  projectType: { type: 'string' },

  inProcessStatus: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      build_app: 0,
      get_apk: 0,
    },
  },
  statics: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  processStep: { type: 'number' },
  processDoneOnced: {
    type: 'boolean', // first time true when open on dashboard
    default: false,
  },
  lastBuildAt: { type: Date },
  output: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  isClone: {
    type: 'boolean',
    default: false,
  },
  inActiveReason: { type: String },
  imageScale: { type: 'number' },
  isDefaultPublic: {
    type: 'boolean',
    default: false,
  },
  tags: { type: Array },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  selfUpdatedAt: {
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
module.exports = mongoose.model(MODULE.APPLICATION.MODEL_NAME, schema);
