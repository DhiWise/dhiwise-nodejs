module.exports = {
  validation: {
    name: {
      min: 1,
      max: 250,
    },
    description: {
      min: 1,
      max: 500,
    },
    template: {
      min: 1,
      max: 250,
    },
    fileName: {
      min: 1,
      max: 250,
    },
    method: {
      min: 1,
      max: 250,
    },
    route: {
      min: 1,
      max: 250,
    },
    controller: {
      min: 1,
      max: 250,
    },
    content: {
      min: 1,
      max: 250,
    },
    pagePath: {
      min: 1,
      max: 250,
    },
    databaseName: {
      min: 1,
      max: 200,
    },
    port: {
      min: 1000,
      max: 9999,
    },
    figmaFileId: {
      min: 1,
      max: 200,
    },
    figmaToken: {
      min: 1,
      max: 200,
    },
    navigateTo: {
      min: 1,
      max: 200,
    },
    navigateFrom: {
      min: 1,
      max: 200,
    },
    authModel: {
      min: 1,
      max: 200,
    },
    packageName: {
      min: 1,
      max: 200,
    },
    image: {
      min: 1,
      max: 200,
    },
    entryPath: {
      min: 1,
      max: 200,
    },
  },
  VALIDATION_RULES: {
    DESCRIPTION: {
      MIN: 1,
      MAX: 500,
    },
    PROJECT_NAME: {
      MIN: 3,
      MAX: 40,
      REGEX: /^[a-zA-Z0-9]+[\w _-]*$/,
    },
    APPLICATION: {
      NAME: {
        MIN: 3,
        MAX: 40,
        REGEX: /^([0-9 _-]*[a-zA-Z]){3,}[0-9 _-]*$/,
      },
      BUNDLE_ID: { REGEX: /^[a-z][a-z_]+\.[a-z][a-z_]+\.[a-z][a-z_]+/ },
      PACKAGE_NAME: { REGEX: /^[a-z][a-z_]+\.[a-z][a-z_]+\.[a-z][a-z_]+/ },
      SCREEN_IDS: { REGEX: /(^\d+$)|(^\d+:?\d+$)/ },
    },
    PROJECT_DEFINITION_CODE: /^[A-Z_]+$/,
    APPLICATION_FILE_NAME: /^[a-zA-Z]+[\w0-9_-]*$/,
    CONSTANT_FILE_NAME: /^[_a-zA-Z]+[\w0-9_-]*$/,
    APPLICATION_FILE_NAME_WITHOUT_DASH: /^[a-zA-Z_]+[\w0-9_]*$/,
    ROUTE_REGEX: /^[/]+[a-zA-Z]+[\w0-9/_\-{}]*$/,
    URL_REGEX: /^((http|https):\/\/)/,
    PORT_REGEX: /^(102[4-9]|10[3-9]\d|1[1-9]\d{2}|[2-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
  },
  NAME_REGEX: /^[a-zA-Z0-9]+[\w_-]*$/,
};
