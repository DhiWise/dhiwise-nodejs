module.exports = {
  MESSAGE: {
    ALREADY_EXISTS: {
      code: 'E_DUPLICATE',
      message: 'data already exists.',
      status: 200,
    },
    OK: {
      code: 'OK',
      message: 'Operation is successfully executed',
      status: 200,
    },
    BAD_REQUEST: {
      code: 'E_BAD_REQUEST',
      message: 'The request cannot be fulfilled due to bad syntax',
      status: 400,
    },
    UNAUTHORIZED: {
      code: 'E_UNAUTHORIZED',
      message: 'You are not authorized to perform this action.',
      status: 401,
    },
    UNAUTHORIZED_ACTION: {
      code: 'E_BAD_REQUEST',
      message: 'You are not authorized to perform this action.',
      status: 400,
    },
    PERMISSION_NOT_FOUND: {
      code: 'PERMISSION_NOT_FOUND',
      message: 'We are not able to find permission for this action.',
      status: 400,
    },
    FORBIDDEN: {
      code: 'E_FORBIDDEN',
      message: 'Access Denied You don`t have permission to access.',
      status: 403,
    },
    NOT_FOUND: {
      code: 'E_NOT_FOUND',
      message: 'The requested resource could not be found but may be available again in the future.',
      status: 404,
    },
    SERVER_ERROR: {
      code: 'E_INTERNAL_SERVER_ERROR',
      message: 'Something bad happened on the server',
      status: 500,
    },
    ERROR: {
      code: 'E_ERROR',
      message: 'Something went wrong, Please try again',
      status: 400,
    },
    USERNAME_REGISTERED: {
      code: 'E_DUPLICATE',
      message: 'Username already registered.',
      status: 200,
    },
    USER_NOT_FOUND: {
      code: 'E_USER_NOT_FOUND',
      message: 'User with specified credentials is not found',
      status: 404,
    },
    RESET_PASSWORD_LINK_EXPIRE: {
      code: 'E_BAD_REQUEST',
      message: 'Your reset password link is expired or invalid',
      status: 400,
    },
    RESET_PASSWORD_LINK: {
      code: 'OK',
      message: 'Please check your email to reset password.',
      status: 200,
    },
    USER_PASSWORD_RESET: {
      code: 'OK',
      message: 'Password reset successfully.',
      status: 200,
    },
    SESSION_EXPIRE: {
      code: 'E_UNAUTHORIZED',
      message: 'Your current session has expired',
      status: 401,
    },
    USER_NOT_ACTIVE: {
      code: 'E_UNAUTHORIZED',
      message: 'User not active.',
      status: 200,
    },
    INVALID_DEVICE: {
      code: 'E_BAD_REQUEST',
      message: 'Invalid device for the requested user.',
      status: 400,
    },
    LOGOUT: {
      code: 'OK',
      message: 'Successfully logout.',
      status: 200,
    },
    EMAIL_PASS_NOT_MATCHED: {
      code: 'E_BAD_REQUEST',
      message: 'You\'ve entered an invalid password. Please check and try again.',
      status: 200,
    },
    DUPLICATE_DEVICE_ID: {
      code: 'E_BAD_REQUEST',
      message: 'Order is already generated. Please visit Digital Binder to view the order.',
      status: 200,
    },
    UNAUTHORIZED_USER_X_RAY: {
      code: 'E_BAD_REQUEST',
      message: 'You are not authorized to create request for this x-ray.',
      status: 400,
    },

    INVALID_TOKEN: {
      code: 'E_INVALID_TOKEN',
      message: 'Invalid token.',
      status: 401,
    },

    FAILED_TO_EXEC_CHHOMD_CMD: {
      code: 'ERROR',
      message: 'Failed to execute chmod command.',
      status: 400,
    },

    INVALID_FILE_MIMETYPE: {
      code: 'OERROR',
      message: 'Invalid file type.',
      status: 400,
    },
    VALID_FILE_MIMETYPE: {
      code: 'OK',
      message: 'Valid file mime type.',
      status: 200,
    },
    AWS_S3_FILE_UPLOAD_ISSUE: {
      code: 'ERROR',
      message: 'File not uploaded to S3, plz try again later.',
      status: 400,
    },
    AWS_S3_FILE_UPLOAD_SUCCESS: {
      code: 'OK',
      message: 'File uploaded successfully.',
      status: 200,
    },

    OTP_EXPIRE: {
      code: 'E_BAD_REQUEST',
      message: 'Your OTP has expired.',
      status: 400,
    },
    OTP_VERIFIED: {
      code: 'OK',
      message: 'Your OTP is verified.',
      status: 200,
    },
    INVALID_OTP: {
      code: 'E_BAD_REQUEST',
      message: 'You\'ve entered an incorrect OTP. Please check and try again.',
      status: 400,
    },
    VERSION_UPDATE_SUCCESS: {
      code: 'OK',
      message: 'Version detail successfully updated.',
      status: 200,
    },
    VERSION_CREATE_FAILED: {
      code: 'E_INTERNAL_SERVER_ERROR',
      message: 'Failed to added Version.',
      status: 200,
    },
    VERSION_DELETED: {
      code: 'OK',
      message: 'Version(s) deleted successfully.',
      status: 200,
    },
    VERSION_ALREADY_EXISTS: {
      code: 'E_DUPLICATE',
      message: 'Version with same version already exists.',
      status: 200,
    },
    VERSION_APKS_ALREADY_EXISTS: {
      code: 'E_DUPLICATE',
      message: 'Apks with same version already exists.',
      status: 200,
    },
    VERSION_DEVICES_ALREADY_EXISTS: {
      code: 'E_DUPLICATE',
      message: 'Devices with same version already exists.',
      status: 200,
    },
    VERSION_STILL_ACTIVE: {
      code: 'E_DUPLICATE',
      message: 'You cant delete current active version.',
      status: 200,
    },
    VERSION_CREATE_SUCCESS: {
      code: 'OK',
      message: 'Version Created Successfully.',
      status: 200,
    },
    VERSION_NOT_FOUND: {
      code: 'E_NOT_FOUND',
      message: 'Not Found.',
      status: 200,
    },

    EMAIL_REGISTERED: {
      code: 'E_DUPLICATE',
      message: 'Email already registered.',
      status: 200,
    },

    INVITATION_ACCEPTED: {
      code: 'E_BAD_REQUEST',
      message: 'Invitation already accepted.',
      status: 200,
    },

    DE_ACTIVE_USER: {
      code: 'E_UNAUTHORIZED',
      message: 'Your account is de-active.',
      status: 401,
    },
    ACTIVE_SUBSCRIPTION_PLAN_NOT_FOUND: {
      code: 'E_NOT_FOUND',
      message: 'Active subscription plan not found.',
      status: 200,
    },
    PROJECT_PLAN_LIMIT_OVER: {
      code: 'OK',
      message: 'You cant create new project.',
      status: 200,
    },
    PLAN_DOWNGRADE: {
      code: 'E_BAD_REQUEST',
      message: 'Sorry, you can not downgrade your plan. Contact support for more information.',
      status: 400,
    },
    DE_ACTIVE_USER_FROM_COMPANY: {
      code: 'DE_ACTIVE_USER_FROM_COMPANY',
      message: 'You have been deactivated from this workspace.',
      status: 401,
    },
    REMOVED_FROM_WORKSPACE: {
      code: 'REMOVE_USER_FROM_COMPANY',
      message: 'Your are no longer part of this workspace',
      status: 401,
    },
    DE_ACTIVE_COMPAND_FOUND_AND_DEFAULT_COMPANY_CHANGED: {
      code: 'DE_ACTIVE_COMPAND_FOUND_AND_DEFAULT_COMPANY_CHANGED',
      message: 'The company you are trying to sign in is not longer active. Your default company has been changed',
      status: 400,
    },
    DE_ACTIVE_COMPAND_FOUND: {
      code: 'DE_ACTIVE_COMPAND_FOUND',
      message: 'The company you are trying to sign in is not longer active.',
      status: 400,
    },
    USER_TYPE_NOT_FOUND: {
      code: 'USER_TYPE_NOT_FOUND',
      message: 'We are not able to find user type.',
      status: 404,
    },
    USER_PLAN_NOT_FOUND: {
      code: 'USER_PLAN_NOT_FOUND',
      message: 'We are not able to find user plan.',
      status: 404,
    },
    APPLICATION_UNASSIGNED: {
      code: 'APPLICATION_UNASSIGNED',
      message: 'You are no longer authorized to access this application.',
      status: 400,
    },
    PERMISSION_NOT_FOUND_FOR_USER: {
      code: 'PERMISSION_NOT_FOUND_FOR_USER',
      message: 'We are not able to find permission.',
      status: 400,
    },
    TOKEN_EXPIRED: {
      code: 'TOKEN_EXPIRED',
      message: 'Token Expired.',
      status: 400,
    },
    TOO_MANY_REQUEST: {
      code: 'TOO_MANY_REQUEST',
      message: 'Too Many Request',
      status: 400,
    },
    UNVERIFIED_EMAIL_ID: {
      code: 'E_BAD_REQUEST',
      message: 'Please verify your email address.',
      status: 400,
    },
    APPLICATION_IS_DELETED: {
      code: 'APPLICATION_IS_DELETED',
      message: 'Selected application is deleted.',
      status: 400,
    },
    INVALID_EMAIL_OR_PASSWORD: {
      code: 'E_USER_NOT_FOUND',
      message: 'Email address or password is invalid. Please check and try again.',
      status: 404,
    },
    ACCOUNT_BLOCKED: {
      code: 'ACCOUNT_BLOCKED',
      message: 'Your account has been blocked for multiple wrong password attempts.',
      status: 404,
    },
  },
};
