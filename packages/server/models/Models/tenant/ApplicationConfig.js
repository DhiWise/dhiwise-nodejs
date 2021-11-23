const mongoose = require('mongoose');
const { MODULE } = require('../../constants/common');

const schema = new mongoose.Schema({

  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.APPLICATION.MODEL_NAME,
  },

  authModuleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MODULE.SCHEMA.MODEL_NAME,
  },

  authModule: { type: 'string' },

  loginWith: {
    username: { type: mongoose.Schema.Types.Mixed },
    password: { type: mongoose.Schema.Types.Mixed },
  },

  isTwoFA: {
    type: 'boolean',
    default: false,
  },

  /*
   *"twoFAType":{
   * type: 'numbeisTwoFA_FA_AUTHENTICATION_TYPE.OTP,
   *},
   *"platform":{
   * "admin": false,
   * "device": true,
   * "desktop": true,
   * "client": true
   *},
   *"otpSendMedium": { type: mongoose.Schema.Types.Mixed,}
   *{
   *   masterIds:  {
   *     type: mongoose.Schema.Types.ObjectId,
   *     ref: MODULE.MASTER.MODEL_NAME,
   *   },
   *   "sms": true,
   *   "email": false
   *}
   */
  twoFactorAuthentication: { type: mongoose.Schema.Types.Mixed },

  /*
   * { min : 3
   *   max : 5
   * }
   */
  loginRetryLimit: { type: mongoose.Schema.Types.Mixed },

  /*
   * { min : 3
   *   max : 5
   *   reActiveTime:20
   * }
   */
  loginRateLimit: { type: mongoose.Schema.Types.Mixed },

  loginNextRetryTime: { type: 'number' },

  /*
   *  "otp":{
   *    masterIds:  {
   *    type: mongoose.Schema.Types.ObjectId,
   *    ref: MODULE.MASTER.MODEL_NAME,
   *    },
   *  //       "email": true,
   *  //       "sms": false
   *  //   },
   *  //   "link": {
   *        masterIds:  {
   *          type: mongoose.Schema.Types.ObjectId,
   *          ref: MODULE.MASTER.MODEL_NAME,
   *        },
   *  //       "email": true,
   *  //       "sms": false
   *  //   },number
   */
  resetPassword: { type: mongoose.Schema.Types.Mixed },

  isSocialMediaAuth: {
    type: 'boolean',
    default: false,
  },

  socialPlatform: [{
    typeId: { type: mongoose.Schema.Types.ObjectId },
    type: { type: 'string' },
    isChecked: { type: 'boolean' },
    platform: { type: mongoose.Schema.Types.Mixed },
    credential: { type: mongoose.Schema.Types.Mixed },
  }],

  tokenExpiryTime: { type: 'number' },

  restrictNoOfDevice: { type: 'boolean' },

  noOfDevice: {
    type: 'number',
    default: 1,
  },

  externalServiceProviderData: [
    {
      typeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODULE.MASTER.MODEL_NAME,
      },
      type: { type: 'string' },
      serviceProviderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODULE.MASTER.MODEL_NAME,
      },
      serviceProvide: { type: 'string' },
      customJson: { type: mongoose.Schema.Types.Mixed },
    },
  ],

  fileUpload: {
    uploads: [
      {
        platform: { type: mongoose.Schema.Types.Mixed },
        validationType: [
          { type: 'String' },
        ],
        storage: { type: 'string' },
        authentication: { type: 'boolean' },
        maxSize: { type: 'number' },
        isSingle: { type: 'boolean' },
      },
    ],
  },

  isBiometric: { // kotlin config
    type: 'boolean',
  },

  isSocket: { // node config
    type: 'boolean',
  },

  isActivityLog: { // node config
    type: 'boolean',
  },

  responseFormatter: [
    {
      _id: false,
      isAllModels: { type: 'boolean' },
      modelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODULE.SCHEMA.MODEL_NAME,
      },
      title: { type: 'string' },
      dataType: { type: 'string' },
      targetAttr: { type: 'string' },
      operator: { type: 'string' },
      attribute: { type: mongoose.Schema.Types.Mixed },
    },
  ],
  authentication: { type: mongoose.Schema.Types.Mixed },
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
module.exports = mongoose.model(MODULE.APPLICATION_CONFIG.MODEL_NAME, schema);
