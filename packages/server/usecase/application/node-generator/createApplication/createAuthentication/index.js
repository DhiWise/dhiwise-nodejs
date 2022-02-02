const {
  isEmpty, each, forEach, cloneDeep,
} = require('lodash');
const {
  getTemplateByName, getPlatformWiseAPIOfCustomRoutes,
} = require('../utils/common');
const writeOperations = require('../../writeOperations');
const {
  ORM_PROVIDERS, PROJECT_TYPE,
} = require('../../constants/constant');

async function setPackagesForAuth ({
  userLoginRateLimit, socialAuth,
}) {
  const pkg = { dependencies: {} };
  pkg.dependencies.bcrypt = '5.0.0';
  pkg.dependencies.jsonwebtoken = '~8.5.1';
  pkg.dependencies.passport = '~0.4.1';
  pkg.dependencies['passport-jwt'] = '~4.0.0';
  pkg.dependencies.dayjs = '~1.10.7';
  pkg.dependencies.uuid = '~8.3.2';
  if (userLoginRateLimit && !isEmpty(userLoginRateLimit)) {
    pkg.dependencies['express-rate-limit'] = '~5.2.6';
  }
  if (!isEmpty(socialAuth) && socialAuth.required) {
    pkg.dependencies['express-session'] = '~1.17.1';
  }
  return pkg;
}
async function getAuthorizeRoutes (PLATFORM, loginAccessPlatform) {
  const obj = {};
  forEach(loginAccessPlatform, (element, key) => {
    obj[key] = [];
    element.forEach((e) => {
      if (PLATFORM.includes(e)) {
        obj[key].push(`getAllBy${key}In${e.charAt(0).toUpperCase() + e.slice(1)}Platform`);
        obj[key].push(`getBy${key}In${e.charAt(0).toUpperCase() + e.slice(1)}Platform`);
        obj[key].push(`getCountBy${key}In${e.charAt(0).toUpperCase() + e.slice(1)}Platform`);
        obj[key].push(`createBy${key}In${e.charAt(0).toUpperCase() + e.slice(1)}Platform`);
        obj[key].push(`addBulkBy${key}In${e.charAt(0).toUpperCase() + e.slice(1)}Platform`);
        obj[key].push(`updateBy${key}In${e.charAt(0).toUpperCase() + e.slice(1)}Platform`);
        obj[key].push(`updateBulkBy${key}In${e.charAt(0).toUpperCase() + e.slice(1)}Platform`);
        obj[key].push(`partialUpdateBy${key}In${e.charAt(0).toUpperCase() + e.slice(1)}Platform`);
        obj[key].push(`deleteBy${key}In${e.charAt(0).toUpperCase() + e.slice(1)}Platform`);
        obj[key].push(`softDeleteBy${key}In${e.charAt(0).toUpperCase() + e.slice(1)}Platform`);
        obj[key].push(`fileUploadBy${key}In${e.charAt(0).toUpperCase() + e.slice(1)}Platform`);
        obj[key].push(`logoutBy${key}In${e.charAt(0).toUpperCase() + e.slice(1)}Platform`);
        obj[key].push(`softDeleteManyBy${key}In${e.charAt(0).toUpperCase() + e.slice(1)}Platform`);
        obj[key].push(`deleteManyBy${key}In${e.charAt(0).toUpperCase() + e.slice(1)}Platform`);
        obj[key].push(`changePasswordBy${key}In${e.charAt(0).toUpperCase() + e.slice(1)}Platform`);
        obj[key].push(`updateProfileBy${key}In${e.charAt(0).toUpperCase() + e.slice(1)}Platform`);
      }
    });
  });
  const keysOfObj = Object.keys(obj);
  const values = Object.values(obj);
  const keyObj = [];
  for (let i = 0; i < keysOfObj.length; i += 1) {
    const arr = [];
    arr.push(keysOfObj[i]);
    keyObj.push(arr);
  }

  const valObj = [];
  for (let i = 0; i < values.length; i += 1) {
    valObj.push(values[i]);
  }
  return {
    valObj,
    keyObj,
  };
}

async function generateAuthConstant (PLATFORM, auth, {
  keyObj, valObj,
}, configPath, customRoutes = {}) {
  const {
    userRoles, loginAccessPlatform, userLoginRetryLimit, forgotPassword, userTokenExpireTime, noOfDeviceAllowed,
  } = auth;
  const constant = writeOperations.loadTemplate(`${configPath}/constant.js`);
  constant.locals.CUSTOM_ROUTES = customRoutes;
  constant.locals.PLATFORM = PLATFORM;
  constant.locals.USER_ROLE = userRoles;
  constant.locals.AUTHORIZE_ROUTE_KEY = keyObj;
  constant.locals.AUTHORIZE_ROUTE_VALUE = valObj;
  constant.locals.LOGIN_ACCESS = loginAccessPlatform;
  constant.locals.TOKEN_EXPIRE_TIME = userTokenExpireTime;
  constant.locals.DEVICE_ALLOWED_REQUIRED = noOfDeviceAllowed.required;
  constant.locals.NO_OF_DEVICE = noOfDeviceAllowed.no;
  if (!isEmpty(userLoginRetryLimit)) {
    constant.locals.LOGIN_RETRY_LIMIT = userLoginRetryLimit;
  } else {
    constant.locals.LOGIN_RETRY_LIMIT = false;
  }
  if (!isEmpty(forgotPassword)) {
    const fpObj = {};
    const sendToConstant = cloneDeep(forgotPassword);
    const key = !isEmpty(sendToConstant.link) ? 'link' : 'otp';
    if (sendToConstant[key]?.emailTemplate) {
      delete sendToConstant[key].emailTemplate;
    }
    if (sendToConstant[key]?.smsTemplate) {
      delete sendToConstant[key].smsTemplate;
    }
    if (sendToConstant[key]?.smsTemplateId) {
      delete sendToConstant[key].smsTemplateId;
    }
    if (sendToConstant[key]?.emailTemplateId) {
      delete sendToConstant[key].emailTemplateId;
    }
    const entries = Object.entries(sendToConstant);
    for (let i = 0; i < entries.length; i += 1) {
      const [k, v] = entries[i];
      fpObj[k.toUpperCase()] = v;
    }
    let finalStr = '';
    finalStr = JSON.stringify(fpObj, undefined, 2).toString().replace(/"/g, '');
    constant.locals.RESET_PASSWORD = finalStr;
  } else {
    constant.locals.RESET_PASSWORD = false;
  }
  return constant;
}

async function generateAuthUsecase (useCaseFolderPath, {
  userModel,
  passwordField,
  notificationType,
  emailFieldName,
  mobileFieldName,
  userLoginRetryLimit,
  rolePermission,
}) {
  const authUsecase = {};
  authUsecase.register = {};
  // For Register
  const registerUseCase = writeOperations.loadTemplate(`${useCaseFolderPath}/authentication/register.js`);
  registerUseCase.locals.FILE_NAME = 'register';
  registerUseCase.locals.USER_MODEL = userModel;
  registerUseCase.locals.PASSWORD_FIELD = passwordField;
  registerUseCase.locals.NOTIFICATION_TYPE = notificationType;
  registerUseCase.locals.EMAIL_FIELD = emailFieldName;
  registerUseCase.locals.MOBILE_FIELD = mobileFieldName;
  registerUseCase.locals.ROLE_DB = 'roleDb';
  registerUseCase.locals.USER_ROLE_DB = 'userRoleDb';
  authUsecase.register = registerUseCase;

  // For ForgotPassword
  const forgotPasswordUseCase = writeOperations.loadTemplate(`${useCaseFolderPath}/authentication/forgotPassword.js`);
  forgotPasswordUseCase.locals.FILE_NAME = 'forgotPassword';
  forgotPasswordUseCase.locals.USER_MODEL = userModel;
  forgotPasswordUseCase.locals.EMAIL_FIELD = emailFieldName;
  authUsecase.forgotPassword = forgotPasswordUseCase;

  // For Reset password

  const resetPasswordUseCase = writeOperations.loadTemplate(`${useCaseFolderPath}/authentication/resetPassword.js`);
  resetPasswordUseCase.locals.FILE_NAME = 'resetPassword';
  resetPasswordUseCase.locals.USER_MODEL = userModel;
  resetPasswordUseCase.locals.PASSWORD_FIELD = passwordField;
  resetPasswordUseCase.locals.EMAIL_FIELD = emailFieldName;
  resetPasswordUseCase.locals.LOGIN_RETRY_LIMIT = userLoginRetryLimit || null;
  authUsecase.resetPassword = resetPasswordUseCase;

  // For ValidateResetPasswordOtp
  const validateResetPasswordOtpUseCase = writeOperations.loadTemplate(`${useCaseFolderPath}/authentication/validateResetPasswordOtp.js`);
  validateResetPasswordOtpUseCase.locals.FILE_NAME = 'validateResetPasswordOtp';
  validateResetPasswordOtpUseCase.locals.USER_MODEL = userModel;
  authUsecase.validateResetPasswordOtp = validateResetPasswordOtpUseCase;

  // For Logout
  const logoutUseCase = writeOperations.loadTemplate(`${useCaseFolderPath}/authentication/logout.js`);
  logoutUseCase.locals.FILE_NAME = 'logout';
  authUsecase.logout = logoutUseCase;

  const authentication = writeOperations.loadTemplate(`${useCaseFolderPath}/authentication/authentication.js`);
  authentication.locals.FILE_NAME = 'authentication';
  authentication.locals.USER_MODEL = userModel;
  authentication.locals.ROLE_PERMISSION = rolePermission;
  authUsecase.loginWithOTP = authentication;

  return authUsecase;
}

async function authenticationSetup (platformStrategy, {
  auth, configPath, controllerPath, routePath, authControllerPath, templates, ORM, rolePermission, projectType, useCaseFolderPath, middlewarePath,
}) {
  const socialPlatforms = [];
  if (auth.socialAuth.platforms.length) {
    each(auth.socialAuth.platforms, (p) => {
      if (p.platforms.includes(platformStrategy)) {
        socialPlatforms.push(p.type);
      }
    });
  }
  const or = [];
  const {
    userModel, userLoginWith, noOfDeviceAllowed, registerAuth, loginAccessPlatform, emailField, mobileField, userLoginRetryLimit,
  } = auth;
  userLoginWith.username.forEach((item) => {
    const query = {};
    query[item] = 'params.username';
    or.push(query);
  });
  let orObj = {};
  if (ORM === ORM_PROVIDERS.MONGOOSE) {
    orObj.$or = or;
  } else if (ORM === ORM_PROVIDERS.SEQUELIZE) {
    orObj['[Op.or]'] = or;
  } else {
    orObj.$or = or;
  }
  orObj = JSON.stringify(orObj);
  orObj = orObj.toString().replace(/"/g, '');

  // PASSPORT
  let passport;
  if (projectType === PROJECT_TYPE.MVC || projectType === PROJECT_TYPE.MVC_SEQUELIZE) {
    passport = writeOperations.loadTemplate(`${configPath}/passport.js`);
    passport.locals.MODEL = userModel;
    passport.locals.STRATEGY = platformStrategy;
    passport.locals.LOGIN_WITH = userLoginWith.username;
    passport.locals.MAX_DEVICE_ALLOWED = noOfDeviceAllowed.required;
  } else {
    passport = writeOperations.loadTemplate(`${middlewarePath}/passport.js`);
    passport.locals.STRATEGY = platformStrategy;
  }
  const authController = writeOperations.loadTemplate(`${controllerPath}/authController.js`);
  authController.locals.LOGIN_WITH = userLoginWith.username;
  authController.locals.MULTIPLE_LOGIN = orObj;
  authController.locals.USER_MODEL = userModel;
  authController.locals.EMAIL_FIELD = emailField || 'email';
  authController.locals.MOBILE_FIELD = mobileField || 'mobileNo';
  authController.locals.ROLE_PERMISSION = !!rolePermission;
  // ? adding templates for sending email or sms
  if (!isEmpty(registerAuth) && !isEmpty(templates)) {
    if (!isEmpty(registerAuth.smsTemplate)) {
      authController.locals.NOTIFICATION_TYPE = 'SMS';
      authController.locals.REGISTER_TEMPLATE_NAME = registerAuth.smsTemplate;
      const temps = getTemplateByName(templates, registerAuth.smsTemplate);
      if (!isEmpty(temps) && !isEmpty(temps.attribute)) {
        authController.locals.REGISTER_TEMPLATE_ATTRIBUTE = temps.attribute;
      } else {
        authController.locals.REGISTER_TEMPLATE_ATTRIBUTE = false;
      }
    } else if (!isEmpty(registerAuth.emailTemplate) && !isEmpty(templates)) {
      const temps = getTemplateByName(templates, registerAuth.emailTemplate);
      authController.locals.NOTIFICATION_TYPE = 'EMAIL';
      authController.locals.REGISTER_TEMPLATE_NAME = registerAuth.emailTemplate;
      if (!isEmpty(temps) && !isEmpty(temps.attribute)) {
        authController.locals.REGISTER_TEMPLATE_ATTRIBUTE = temps.attribute;
      } else {
        authController.locals.REGISTER_TEMPLATE_ATTRIBUTE = false;
      }
    } else {
      authController.locals.NOTIFICATION_TYPE = false;
      authController.locals.REGISTER_TEMPLATE_NAME = false;
      authController.locals.REGISTER_TEMPLATE_ATTRIBUTE = false;
    }
  } else {
    authController.locals.NOTIFICATION_TYPE = false;
    authController.locals.REGISTER_TEMPLATE_NAME = false;
    authController.locals.REGISTER_TEMPLATE_ATTRIBUTE = false;
  }
  authController.locals.PATH = authControllerPath;
  const authRoutes = writeOperations.loadTemplate(`${routePath}/auth.js`);
  authRoutes.locals.PLATFORM = platformStrategy;
  authRoutes.locals.SOCIAL_PLATFORMS = socialPlatforms;
  authRoutes.locals.LOGIN_ACCESS_PLATFORM = loginAccessPlatform;
  authRoutes.locals.MODULE = platformStrategy;

  let authUsecase;

  if (projectType === PROJECT_TYPE.CLEAN_CODE || projectType === PROJECT_TYPE.CC_SEQUELIZE) {
    const passwordField = userLoginWith.password || 'password';
    const notificationType = authController.locals.NOTIFICATION_TYPE || false;
    const emailFieldName = emailField;
    const mobileFieldName = mobileField;
    const pushNotification = authController.locals.PUSH_NOTIFICATION;

    authUsecase = await generateAuthUsecase(useCaseFolderPath, {
      userModel,
      passwordField,
      notificationType,
      emailFieldName,
      mobileFieldName,
      userLoginRetryLimit,
      rolePermission,
      userLoginWith,
      orObj,
      pushNotification,
    });
  }

  return {
    passport,
    authController,
    authRoutes,
    authUsecase,
  };
}
async function generateAuthMiddleware (PLATFORM, middlewarePath, platformWiseCustomRoutes, noOfDeviceAllowed) {
  const middleware = writeOperations.loadTemplate(`${middlewarePath}/auth.js`);
  middleware.locals.CUSTOM_ROUTES = platformWiseCustomRoutes;
  middleware.locals.PLATFORM = PLATFORM;
  middleware.locals.MAX_DEVICE_ALLOWED = noOfDeviceAllowed.required;
  const authUser = writeOperations.loadTemplate(`${middlewarePath}/loginUser.js`);
  authUser.locals.PLATFORM = PLATFORM;
  return {
    middleware,
    authUser,
  };
}
async function generateAuthService (platforms, {
  auth, servicePath, templates, ORM, rolePermission,
}) {
  const {
    userModel, userLoginWith,
    userLoginRetryLimit, forgotPassword, noOfDeviceAllowed, emailField, mobileField,
  } = auth;
  const or = [];
  userLoginWith.username.forEach((item) => {
    const query = {};
    query[item] = 'username';
    or.push(query);
  });
  let orObj = {};
  if (ORM === ORM_PROVIDERS.MONGOOSE) {
    orObj.$or = or;
  } else if (ORM === ORM_PROVIDERS.SEQUELIZE) {
    orObj['[Op.or]'] = or;
  } else {
    orObj.$or = or;
  }
  orObj = JSON.stringify(orObj);
  orObj = orObj.toString().replace(/"/g, '');

  const authService = writeOperations.loadTemplate(`${servicePath}/auth.js`);
  authService.locals.PLATFORMS = platforms;
  authService.locals.MODEL = userModel;
  authService.locals.LOGIN_WITH = userLoginWith.username;
  authService.locals.MULTIPLE_LOGIN = orObj;
  authService.locals.MAX_DEVICE_ALLOWED = noOfDeviceAllowed.required;
  authService.locals.MOBILE_FIELD = mobileField || 'mobileNo';
  authService.locals.EMAIL_FIELD = emailField || 'email';
  authService.locals.PASSWORD = userLoginWith.password;
  authService.locals.ROLE_PERMISSION = rolePermission;

  if (!isEmpty(userLoginRetryLimit)) {
    authService.locals.LOGIN_RETRY_LIMIT = userLoginRetryLimit;
  } else {
    authService.locals.LOGIN_RETRY_LIMIT = false;
  }
  if (!isEmpty(forgotPassword)) {
    if (!isEmpty(forgotPassword.otp)) {
      authService.locals.RESET_PASSWORD = true;
      authService.locals.FORGOT_WITH_OTP = true;
      authService.locals.FORGOT_WITH_LINK = false;
    } else if (!isEmpty(forgotPassword.link)) {
      authService.locals.RESET_PASSWORD = true;
      authService.locals.FORGOT_WITH_LINK = true;
      authService.locals.FORGOT_WITH_OTP = false;
    } else {
      authService.locals.RESET_PASSWORD = false;
      authService.locals.FORGOT_WITH_OTP = false;
      authService.locals.FORGOT_WITH_LINK = false;
    }
  } else {
    authService.locals.RESET_PASSWORD = false;
    authService.locals.FORGOT_WITH_OTP = false;
    authService.locals.FORGOT_WITH_LINK = false;
  }

  if (!isEmpty(forgotPassword) && !isEmpty(templates)) {
    const key = forgotPassword.link ? 'link' : 'otp';
    if (!isEmpty(forgotPassword[key].smsTemplate) && !isEmpty(templates)) {
      authService.locals.RESET_PASSWORD_NOTIFICATION_TYPE = 'SMS';
      authService.locals.RESET_PASSWORD_TEMPLATE_NAME = forgotPassword[key].smsTemplate;
      const tmp = getTemplateByName(templates, forgotPassword[key].smsTemplate);
      if (!isEmpty(tmp) && !isEmpty(tmp.attribute)) {
        authService.locals.RESET_PASSWORD_TEMPLATE_ATTRIBUTE = tmp.attribute;
      } else {
        authService.locals.RESET_PASSWORD_TEMPLATE_ATTRIBUTE = false;
      }
    } else if (!isEmpty(forgotPassword[key].emailTemplate) && !isEmpty(templates)) {
      authService.locals.RESET_PASSWORD_NOTIFICATION_TYPE = 'EMAIL';
      authService.locals.RESET_PASSWORD_TEMPLATE_NAME = forgotPassword[key].emailTemplate;
      const tmp = getTemplateByName(templates, forgotPassword[key].emailTemplate);
      if (!isEmpty(tmp) && !isEmpty(tmp.attribute)) {
        authService.locals.RESET_PASSWORD_TEMPLATE_ATTRIBUTE = tmp.attribute;
      } else {
        authService.locals.RESET_PASSWORD_TEMPLATE_ATTRIBUTE = false;
      }
    } else {
      authService.locals.RESET_PASSWORD_NOTIFICATION_TYPE = false;
      authService.locals.RESET_PASSWORD_TEMPLATE_ATTRIBUTE = false;
      authService.locals.RESET_PASSWORD_TEMPLATE_NAME = false;
    }
  } else {
    authService.locals.RESET_PASSWORD_NOTIFICATION_TYPE = false;
    authService.locals.RESET_PASSWORD_TEMPLATE_ATTRIBUTE = false;
    authService.locals.RESET_PASSWORD_TEMPLATE_NAME = false;
  }
  return authService;
}
async function makeAuth (makeAuthObj) {
  const app = { locals: {} };
  const PLATFORM = makeAuthObj.platform;
  const platformForAuth = makeAuthObj.platform;
  app.locals.PLATFORM = platformForAuth;
  app.locals.IS_AUTH = makeAuthObj.auth.isAuth;

  const packageDependency = await setPackagesForAuth({
    userLoginRateLimit: makeAuthObj.auth.userLoginRateLimit,
    socialAuth: makeAuthObj.auth.socialAuth,
  });

  const {
    valObj, keyObj,
  } = await getAuthorizeRoutes(PLATFORM, makeAuthObj.auth.loginAccessPlatform);
  let platformWiseCustomRoutes = {};
  if (makeAuthObj.customRoutes && makeAuthObj.customRoutes.apis && makeAuthObj.customRoutes.apis.length) {
    platformWiseCustomRoutes = getPlatformWiseAPIOfCustomRoutes(cloneDeep(makeAuthObj.customRoutes.apis));
  }
  const constant = await generateAuthConstant(PLATFORM, makeAuthObj.auth, {
    keyObj,
    valObj,
  }, makeAuthObj.configPath, platformWiseCustomRoutes);

  const authSetup = {};
  forEach(platformForAuth, async (platformName) => {
    authSetup[platformName] = await authenticationSetup(platformName, makeAuthObj);
  });

  const authService = await generateAuthService(PLATFORM, makeAuthObj);

  const policy = await generateAuthMiddleware(PLATFORM, makeAuthObj.middlewarePath, platformWiseCustomRoutes, makeAuthObj.auth.noOfDeviceAllowed);

  let isForgotPasswordTemplate = false;
  const key = makeAuthObj.auth.forgotPassword.link ? 'link' : 'otp';
  if (!isEmpty(makeAuthObj.auth.forgotPassword[key]) && !isEmpty(makeAuthObj.templates)) {
    if (!isEmpty(makeAuthObj.auth.forgotPassword[key].emailTemplate) || !isEmpty(makeAuthObj.auth.forgotPassword[key].smsTemplate)) {
      isForgotPasswordTemplate = true;
    }
  }
  return {
    app,
    authSetup,
    authService,
    constant,
    packageDependency,
    policy,
    isForgotPasswordTemplate,
    forgotPassword: makeAuthObj.auth.forgotPassword,
  };
}
async function isAuthenticationFromInput (jsonData) {
  let isAuth = false;
  let registerAuth = {};
  let userRoles = [];
  let loginAccessPlatform = {};
  let userModel = '';
  let userTokenExpireTime = 10000;
  let emailField = 'email';
  let mobileField = 'mobileNo';

  let userLoginWith = {
    username: ['email'],
    password: 'password',
  };
  let forgotPassword = {
    link: {
      email: true,
      sms: false,
    },
    expireTime: 20,
  };
  let userLoginRateLimit = false;
  const userLoginRetryLimit = {
    max: 3,
    reActiveTime: 20,
    key: 'loginRetryLimit',
  };
  const socialAuth = {
    required: false,
    platforms: [],
  };
  const noOfDeviceAllowed = {
    required: false,
    no: 1,
  };
  if (jsonData.authentication.isAuthentication !== undefined && jsonData.authentication.loginAccess !== undefined && jsonData.authentication.types !== undefined) {
    const {
      isAuthentication, loginAccess, types, authModel, loginWith, resetPassword, loginRateLimit, loginRetryLimit, tokenExpireTime,
      registerUser,
    } = jsonData.authentication;
    isAuth = isAuthentication === true;
    userRoles = types.length > 0 ? types : [];
    loginAccessPlatform = loginAccess;
    if (!isEmpty(loginWith)) {
      if (!isEmpty(loginWith.username)) {
        if (loginWith.username.includes('password')) {
          loginWith.username = loginWith.username.filter((e) => e !== 'password');
        }
        userLoginWith = loginWith;
      }
      if (!isEmpty(loginWith.password)) {
        userLoginWith.password = loginWith.password;
      }
    }
    if (!isEmpty(registerUser)) {
      registerAuth = registerUser;
    }
    if (!isEmpty(loginRetryLimit)) {
      if (loginRetryLimit.max && loginRetryLimit.max !== '') {
        userLoginRetryLimit.max = loginRetryLimit.max;
      }
      if (loginRetryLimit.reActiveTime && loginRetryLimit.reActiveTime !== '') {
        userLoginRetryLimit.reActiveTime = loginRetryLimit.reActiveTime;
      }
    }

    userModel = authModel || 'user';
    if (!isEmpty(resetPassword)) {
      if (!isEmpty(resetPassword.otp)) {
        delete resetPassword.otp.masterIds;
        if (!resetPassword.otp.email) {
          resetPassword.otp.email = false;
        }
        if (!resetPassword.otp.sms) {
          resetPassword.otp.sms = false;
        }
        forgotPassword = resetPassword;
      } else if (!isEmpty(resetPassword.link)) {
        delete resetPassword.link.masterIds;
        if (!resetPassword.link.email) {
          resetPassword.link.email = false;
        }
        if (!resetPassword.link.sms) {
          resetPassword.link.sms = false;
        }
        forgotPassword = resetPassword;
      }
    }
    userLoginRateLimit = isEmpty(loginRateLimit) ? userLoginRateLimit : loginRateLimit;
    userTokenExpireTime = tokenExpireTime !== undefined ? tokenExpireTime : userTokenExpireTime;
  }
  if (jsonData.authentication.isSocialMediaAuth !== undefined && jsonData.authentication.isSocialMediaAuth && isAuth) {
    if (!isEmpty(jsonData.authentication.socialPlatform) && jsonData.authentication.socialPlatform.length) {
      socialAuth.required = true;
      for (let i = 0; i < jsonData.authentication.socialPlatform.length; i += 1) {
        if (jsonData.authentication.socialPlatform[i].isChecked) {
          socialAuth.platforms.push(jsonData.authentication.socialPlatform[i]);
        }
      }
      for (let i = 0; i < socialAuth.platforms.length; i += 1) {
        if (isEmpty(socialAuth.platforms[i].platforms) || socialAuth.platforms[i].platforms.length === 0) {
          socialAuth.platforms[i].platforms = jsonData.authentication.platform;
        }
      }
    }
  }
  if (jsonData.authentication.restrictNoOfDevice !== undefined && jsonData.authentication.restrictNoOfDevice && isAuth) {
    noOfDeviceAllowed.required = true;
    noOfDeviceAllowed.no = jsonData.authentication.noOfDevice;
  }
  if (!isEmpty(jsonData.authentication.emailField)) {
    emailField = jsonData.authentication.emailField;
  }
  if (!isEmpty(jsonData.authentication.mobileField)) {
    mobileField = jsonData.authentication.mobileField;
  }

  const loginPlatform = [];
  Object.keys(loginAccessPlatform).forEach((e) => {
    loginAccessPlatform[e].forEach((l) => {
      if (!loginPlatform.includes(l)) {
        loginPlatform.push(l);
      }
    });
  });

  return {
    isAuth,
    userRoles,
    loginAccessPlatform,
    userModel,
    userLoginWith,
    userLoginRateLimit,
    userLoginRetryLimit,
    forgotPassword,
    socialAuth,
    userTokenExpireTime,
    noOfDeviceAllowed,
    registerAuth,
    emailField,
    mobileField,
    loginPlatform,
  };
}

async function makeAuthIndex (authObject) {
  const { platforms } = authObject;
  const authSetup = {};
  forEach(platforms, async (platformName) => {
    const authControllerIndex = writeOperations.loadTemplate(`${authObject.controllerPath}/authControllerIndex.js`);
    authControllerIndex.locals.MODEL = authObject.auth.userModel;
    authControllerIndex.locals.ROLE_PERMISSION = authObject.rolePermission;
    if (!isEmpty(authObject.auth.registerAuth)) {
      if (!isEmpty(authObject.auth.registerAuth.smsTemplate)) {
        authControllerIndex.locals.REGISTER_NOTIFICATION_TYPE = 'SMS';
      } else if (!isEmpty(authObject.auth.registerAuth.emailTemplate)) {
        authControllerIndex.locals.REGISTER_NOTIFICATION_TYPE = 'EMAIL';
      } else {
        authControllerIndex.locals.REGISTER_NOTIFICATION_TYPE = false;
      }
    } else {
      authControllerIndex.locals.REGISTER_NOTIFICATION_TYPE = false;
    }
    authSetup[platformName] = authControllerIndex;
  });
  return authSetup;
}

async function makeMiddlewareIndex (middlewareObj) {
  const {
    platforms, projectType, middlewarePath, userModel,
  } = middlewareObj;
  /*
   * console.log(projectType, middlewareObj.userModel); process.exit(1);
   * middleware index.js
   */
  let indexOfMiddleware;
  if (projectType === PROJECT_TYPE.CLEAN_CODE || projectType === PROJECT_TYPE.CC_SEQUELIZE) {
    indexOfMiddleware = writeOperations.loadTemplate(`${middlewarePath}/index.js`);
    indexOfMiddleware.locals.PLATFORMS = platforms;
    indexOfMiddleware.locals.USER_MODEL = userModel;
  }
  return indexOfMiddleware;
}

module.exports = {
  makeAuth,
  isAuthenticationFromInput,
  makeAuthIndex,
  makeMiddlewareIndex,
};
