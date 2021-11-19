export const MODULE_NO = {
  USER: 1,
  PROJECT: 7,
  APPLICATION: 11,
  PLANS: 21,
  INVITATION: 109,
  PERMISSION: 28,
  MANAGE_MEMBER: 1001,
  GIT_INTEGRATION: 1002,
};
export const MODULE_URL = {
  [MODULE_NO.USER]: '/account/profile',
  [MODULE_NO.PROJECT]: '/project-list',
  [MODULE_NO.INVITATION]: '/account/invite',
  [MODULE_NO.MANAGE_MEMBER]: '/account/manage-member',
};
