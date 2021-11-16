module.exports = {
  IN_PROCESS_STATUS: {
    IN_QUEUE: 1,
    IN_PROCESS: 2,
    COMPLETED: 3,
    FAILED: 4,
    QUEUE_BUILD_REJECTED: 5,
  },
  DEFAULT_POLICY_NAME: 'auth',
  DEFAULT_POLICY_DESCRIPTION: 'Auto generated policy for authentication module in a read only mode.',
  DEFAULT_POLICY: `const passport = require('passport');
    const { ROLE_RIGHTS, USER_ROLE } = require('../config/authConstant');
    const util = require("../utils/messages");
    
    const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
        if (err || info || !user) {
            return reject("Unauthorized User");
        }
        req.user = user;
        if (!user.isActive) {
            return reject("User is deactivated");
        }
        if (requiredRights.length) {
            for(role in USER_ROLE){
                if(USER_ROLE[role]===user.role){
                    const userRights = ROLE_RIGHTS[user.role];
                    const hasRequiredRights = requiredRights.some((requiredRight) => userRights.includes(requiredRight));
                    if (!hasRequiredRights || !user.id) {
                        return reject('Unauthorized user');
                    }
                }
            }
        }
        resolve();
    };
    
    const auth = (...requiredRights) => async (req, res, next) => {
    
    let url =req.originalUrl;
    
                if(url.includes('admin')){
                    return new Promise((resolve, reject) => {
                        passport.authenticate('admin-rule', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(
                            req,
                            res,
                            next
                        );
                    })
                    .then(() => next())
                    .catch((err) => {
                        return util.unAuthorizedRequest(err,res);
                     });
                }
    
                else if(url.includes('device')){
                    return new Promise((resolve, reject) => {
                        passport.authenticate('device-rule', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(
                            req,
                            res,
                            next
                        );
                    })
                    .then(() => next())
                    .catch((err) => {
                        return util.unAuthorizedRequest(err,res);
                     });
                }
    
                else if(url.includes('client')){
                    return new Promise((resolve, reject) => {
                        passport.authenticate('client-rule', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(
                            req,
                            res,
                            next
                        );
                    })
                    .then(() => next())
                    .catch((err) => {
                        return util.unAuthorizedRequest(err,res);
                     });
                }
    
                else if(url.includes('desktop')){
                    return new Promise((resolve, reject) => {
                        passport.authenticate('desktop-rule', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(
                            req,
                            res,
                            next
                        );
                    })
                    .then(() => next())
                    .catch((err) => {
                        return util.unAuthorizedRequest(err,res);
                     });
                }
    
    
    };
    module.exports = auth;`,

  DEFAULT_CONSTANT_NAME: 'authConstant',
  DEFAULT_CONSTANT_DESCRIPTION: 'Auto generated constant for authentication module in a read only mode.',
  DEFAULT_CONSTANT: {
    JWT: {
      ADMIN_SECRET: 'myjwtadminsecret',
      DEVICE_SECRET: 'myjwtdevicesecret',
      CLIENT_SECRET: 'myjwtclientsecret',
      DESKTOP_SECRET: 'myjwtdesktopsecret',
      EXPIRESIN: 10000,
    },
    USER_ROLE: {
      Admin: 1,
      User: 2,
    },
    PLATFORM: {
      ADMIN: 1,
      DEVICE: 2,
      CLIENT: 3,
      DESKTOP: 4,
    },
    DEFAULT_ROLE: 1,
  },
  ORM_TYPE: {
    MONGOOSE: 1,
    SEQUELIZE: 2,
    ELOQUENT: 3,
  },
};
