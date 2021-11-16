const APPLICATION_FIELDS = [
  '_id',
  'updatedAt',
  'name',
  'description',
  'addedBy',
  'createdAt',
  'isArchive',
  'projectId',
  'definitionId',
  'configInput',
  'statics',
  'projectType',
  'processStep',
  'generatedId',
  'tempGeneratedId',
  'isClone',
  'stepInput.figmaFileId',
  'stepInput.ormType',
  'stepInput.databaseType',
  'imageScale',
  'adminPanelGeneratedId',
  'parentId',
  'fireStoreProjectId',
  'isConstraint',
];

const USER_FIELDS = [
  '_id',
  'image',
  'firstName',
  'lastName',
  'email',
  'username',
];

const PROJECT_FIELDS = [
  '_id',
  'image',
  'name',
  'updatedAt',
  'description',
  'isArchive',
  'createdAt',
];

const PROJECT_DEFINITION_FIELDS = [
  '_id',
  'name',
  'code',
  'frontJson',
];

const GENERATOR_FIELDS = [
  '_id',
  'type',
  'status',
  'createdAt',
  'updatedAt',
];

module.exports = {
  APPLICATION_FIELDS,
  USER_FIELDS,
  PROJECT_FIELDS,
  PROJECT_DEFINITION_FIELDS,
  GENERATOR_FIELDS,
};
