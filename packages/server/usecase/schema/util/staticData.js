/* global _ */
const { DEFAULT_POLICY_NAME } = require('../../../models/constants/application');
const { ORM_TYPE } = require('../../../models/constants/applicationConfig');
const DATA_TYPES = require('../../../constants/dataTypes/dataTypes');
const { PROPS } = require('../../../constants/dataTypes/props');
const mongoDB = require('../../../constants/schema');
const {
  DEFAULT_TABLE_NAME, DEFAULT_FIELDS, RELATIONS_TYPES,
} = require('../../../constants/schema');

const getAdditionalJsonAuthPlatform = () => {
  const additionalJson = {
    additionalSetting: {
      admin: {
        C: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
        R: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
        U: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
        D: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
        BC: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
        BU: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
      },
      device: {
        C: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
        R: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
        U: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
        D: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
        BC: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
        BU: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
      },
      client: {
        C: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
        R: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
        U: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
        D: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
        BC: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
        BU: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
      },
      desktop: {
        C: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
        R: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
        U: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
        D: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
        BC: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
        BU: {
          selected: true,
          policy: [DEFAULT_POLICY_NAME],
          isAuth: true,
          attributes: [],
        },
      },
    },
  };

  return additionalJson;
};

const getAdditionalJsonAuthOptions = () => {
  const additionalJsonOptions = {
    C: {
      selected: true,
      policy: [DEFAULT_POLICY_NAME],
      isAuth: true,
      attributes: [],
    },
    R: {
      selected: true,
      policy: [DEFAULT_POLICY_NAME],
      isAuth: true,
      attributes: [],
    },
    U: {
      selected: true,
      policy: [DEFAULT_POLICY_NAME],
      isAuth: true,
      attributes: [],
    },
    D: {
      selected: true,
      policy: [DEFAULT_POLICY_NAME],
      isAuth: true,
      attributes: [],
    },
    BC: {
      selected: true,
      policy: [DEFAULT_POLICY_NAME],
      isAuth: true,
      attributes: [],
    },
    BU: {
      selected: true,
      policy: [DEFAULT_POLICY_NAME],
      isAuth: true,
      attributes: [],
    },
  };

  return additionalJsonOptions;
};

const getAdditionalJsonWithoutAuthOptions = () => {
  const additionalJsonOptions = {
    C: {
      selected: true,
      policy: [],
      attributes: [],
    },
    R: {
      selected: true,
      policy: [],
      attributes: [],
    },
    U: {
      selected: true,
      policy: [],
      attributes: [],
    },
    D: {
      selected: true,
      policy: [],
      attributes: [],
    },
    BC: {
      selected: true,
      policy: [],
      attributes: [],
    },
    BU: {
      selected: true,
      policy: [],
      attributes: [],
    },
  };

  return additionalJsonOptions;
};

const schemaJsonAuthPlatform = () => {
  const schemaJson = {
    admin: [
      'C',
      'R',
      'U',
      'D',
      'BC',
      'BU',
      {
        isAuth: true,
        policy: [DEFAULT_POLICY_NAME],
      },
    ],
    device: [
      'C',
      'R',
      'U',
      'D',
      'BC',
      'BU',
      {
        isAuth: true,
        policy: [DEFAULT_POLICY_NAME],
      },
    ],
    client: [
      'C',
      'R',
      'U',
      'D',
      'BC',
      'BU',
      {
        isAuth: true,
        policy: [DEFAULT_POLICY_NAME],
      },
    ],
    desktop: [
      'C',
      'R',
      'U',
      'D',
      'BC',
      'BU',
      {
        isAuth: true,
        policy: [DEFAULT_POLICY_NAME],
      },
    ],
  };

  return schemaJson;
};

const schemaJsonWithoutAuthPlatform = () => {
  const schemaJson = {
    admin: [
      'C',
      'R',
      'U',
      'D',
      'BC',
      'BU',
    ],
    device: [
      'C',
      'R',
      'U',
      'D',
      'BC',
      'BU',
    ],
    client: [
      'C',
      'R',
      'U',
      'D',
      'BC',
      'BU',
    ],
    desktop: [
      'C',
      'R',
      'U',
      'D',
      'BC',
      'BU',
    ],
  };

  return schemaJson;
};

const schemaJsonAuthOptions = () => {
  const authOptions = [
    'C',
    'R',
    'U',
    'D',
    'BC',
    'BU',
    {
      isAuth: true,
      policy: [DEFAULT_POLICY_NAME],
    },
  ];
  return authOptions;
};

const schemaJsonOptions = () => {
  const options = [
    'C',
    'R',
    'U',
    'D',
    'BC',
    'BU',
  ];
  return options;
};

/**
 * Static fields for `SEQUELIZE`.
 */
const getDefaultFieldsForSequelize = ({ ormType }) => {
  const relationType = {};
  relationType.type = DATA_TYPES.INTEGER.VALUE;
  relationType[PROPS.REF] = DEFAULT_TABLE_NAME;
  relationType[PROPS.REF_ATTR] = DEFAULT_FIELDS.ID;

  const idType = {};
  idType.type = DATA_TYPES.INTEGER.VALUE;
  idType[PROPS.IS_AUTO_INCREMENT] = true;
  idType[PROPS.PRIMARY] = true;

  let fields = {};
  fields = {
    id: idType,
    isActive: { type: DATA_TYPES.BOOLEAN.VALUE },
    createdAt: { type: DATA_TYPES.DATE.VALUE },
    updatedAt: { type: DATA_TYPES.DATE.VALUE },
  };

  if (ormType && ormType === ORM_TYPE.ELOQUENT) {
    if (relationType?.ref) {
      relationType.ref = _.capitalize(relationType.ref);
    }
    if (relationType?.type) {
      relationType.type = DATA_TYPES.UnsignedBigInt.VALUE;
    }
    relationType[PROPS.RELATION_TYPE] = RELATIONS_TYPES.HAS_ONE;
    idType.type = DATA_TYPES.UnsignedBigInt.VALUE;
    fields = {
      id: idType,
      is_active: { type: DATA_TYPES.BOOLEAN.VALUE },
      created_at: { type: DATA_TYPES.TIMESTAMP.VALUE },
      updated_at: { type: DATA_TYPES.TIMESTAMP.VALUE },
      added_by: relationType,
      updated_by: relationType,
    };
    fields.is_active[PROPS.DEFAULT] = true;
  }

  return fields;
};

/**
 * Static fields for `MongoDB`.
 */
const getDefaultFieldsForMongoDB = () => {
  const relationType = {};
  relationType.type = mongoDB.DATA_TYPES.OBJECTID.value;
  relationType.ref = DEFAULT_TABLE_NAME;

  const fields = {
    _id: { type: mongoDB.DATA_TYPES.STRING.value },
    isActive: { type: mongoDB.DATA_TYPES.BOOLEAN.value },
    createdAt: { type: mongoDB.DATA_TYPES.DATE.value },
    updatedAt: { type: mongoDB.DATA_TYPES.DATE.value },
  };

  return fields;
};

/**
 * Function used to re-order schemaJson keys.
 * @param  {} schemaJson
 */
async function reOrderSchemaJson (schemaJson) {
  const newSchemaJson = {};
  if (schemaJson?.id) {
    newSchemaJson.id = schemaJson?.id;
  }
  if (schemaJson?._id) {
    newSchemaJson._id = schemaJson?._id;
  }
  Object.keys(schemaJson).forEach((key) => {
    if (key !== '_id' && key !== 'id') {
      newSchemaJson[key] = _.cloneDeep(schemaJson[key]);
    }
  });

  return newSchemaJson;
}

module.exports = {
  getAdditionalJsonAuthPlatform,
  getAdditionalJsonAuthOptions,
  getAdditionalJsonWithoutAuthOptions,
  schemaJsonAuthPlatform,
  schemaJsonWithoutAuthPlatform,
  getDefaultFieldsForSequelize,
  getDefaultFieldsForMongoDB,
  schemaJsonAuthOptions,
  schemaJsonOptions,
  reOrderSchemaJson,
};
