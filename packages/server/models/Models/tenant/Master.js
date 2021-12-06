const mongoose = require('mongoose');
const { MODULE } = require('../../constants/common');

const MasterSchema = new mongoose.Schema(
  {
    name: { type: 'string' },
    normalizeName: { type: 'string' },
    slug: { type: 'string' },
    code: { type: 'string' },
    group: { type: 'string' },
    description: { type: 'string' },
    isActive: { type: 'boolean' },
    isDefault: { type: 'boolean' },
    sortingSequence: { type: 'number' },
    image: { type: 'string' },
    icon: { type: 'string' },
    customJson: { type: mongoose.Schema.Types.Mixed },
    // self relation
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODULE.MASTER.MODEL_NAME,
      default: null,
    },
    parentCode: { type: 'string' },
    documentUrl: { type: String },
    isDeleted: {
      type: 'boolean',
      default: false,
    },

    masterForMedium: { type: 'number' },
  },
  { timestamps: true },
  { toJSON: { virtuals: true } },
);
MasterSchema.virtual('subMaster', {
  ref: MODULE.MASTER.MODEL_NAME,
  localField: '_id',
  foreignField: 'parentId',
});

MasterSchema.pre('save', (next) => {
  // 'this' refers to the current document about to be saved
  const user = this;
  // create slug using code
  const slug = user.code.toLowerCase();
  // Replace and then store it
  user.slug = slug;
  // Indicates we're done and moves on to the next middleware
  next();
});
MasterSchema.pre(
  'findOneAndUpdate',
  {
    document: true,
    query: false,
  },
  (next) => {
    const user = this._update;
    // console.log('user.$set.code');
    if (user.$set.code) {
      const slug = user.$set.code.toLowerCase();
      user.$set.slug = slug;
    }
    next();
  },
);
module.exports = mongoose.model(MODULE.MASTER.MODEL_NAME, MasterSchema);
