const mongoose = require('mongoose');

const QueueSchema = new mongoose.Schema({
  isUpdated: {
    type: 'boolean',
    default: false,
  },
  syncApi: { type: 'string' },
  data: { type: [] },
  homeAreaId: {
    type: 'ObjectId',
    ref: 'org-home',
  },
  dataId: { type: 'string' },
}, { toJSON: { virtuals: true } }, { timestamp: true });
QueueSchema.index({
  dataId: 1,
  isActive: 1,
  isDeleted: 1,
});
module.exports = mongoose.model('queue', QueueSchema);
