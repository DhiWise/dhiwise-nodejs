/* eslint-disable no-param-reassign */
import { cloneDeep } from 'lodash';
import { DB_TYPE } from './model';

export const SQL_INDEX = {
  ORDER_TYPE_OPTIONS: [
    { name: 'ASC', id: 'ASC', sequence: 1 },
    { name: 'DESC', id: 'DESC', sequence: 2 },
  ],
  TYPE: {
    BTREE: 'BTREE',
    GIN: 'GIN',
    PARTIAL: 'PARTIAL',
    UNIQUE: 'UNIQUE',
  },
  COLLATE: ['ar_AE', 'ar_BH', 'ar_DZ', 'ar_EG', 'ar_IN', 'ar_IQ', 'ar_JO', 'ar_KW', 'ar_LB',
    'ar_LY', 'ar_MA', 'ar_OM', 'ar_QA', 'ar_SA', 'ar_SD', 'ar_SY', 'ar_TN', 'ar_YE', 'be_BY',
    'bg_BG', 'ca_ES', 'cs_CZ', 'da_DK', 'de_AT', 'de_BE', 'de_CH', 'de_DE', 'de_LU', 'el_GR',
    'en_AU', 'en_CA', 'en_GB', 'en_IN', 'en_NZ', 'en_PH', 'en_US', 'en_ZA', 'en_ZW', 'es_AR',
    'es_BO', 'es_CL', 'es_CO', 'es_CR', 'es_DO', 'es_EC', 'es_ES', 'es_GT', 'es_HN', 'es_MX',
    'es_NI', 'es_PA', 'es_PE', 'es_PR', 'es_PY', 'es_SV', 'es_US', 'es_UY', 'es_VE', 'et_EE',
    'eu_ES', 'fi_FI', 'fo_FO', 'fr_BE', 'fr_CA', 'fr_CH', 'fr_FR', 'fr_LU', 'gl_ES', 'gu_IN',
    'he_IL', 'hi_IN', 'hr_HR', 'hu_HU', 'id_ID', 'is_IS', 'it_CH', 'it_IT', 'ja_JP', 'ko_KR',
    'lt_LT', 'lv_LV', 'mk_MK', 'mn_MN', 'ms_MY', 'nb_NO', 'nl_BE', 'nl_NL', 'no_NO', 'pl_PL',
    'pt_BR', 'pt_PT', 'rm_CH', 'ro_RO', 'ru_RU', 'ru_UA', 'sk_SK', 'sl_SI', 'sq_AL', 'sr_RS',
    'sv_FI', 'sv_SE', 'ta_IN', 'te_IN', 'th_TH', 'tr_TR', 'uk_UA', 'ur_PK', 'vi_VN', 'zh_CN',
    'zh_HK', 'zh_TW'],
  GIN_OPERATOR_OPTIONS: ['jsonb_path_ops'],
  ASSIGNMENT_OPERATOR_OPTIONS: ['in', 'nin', 'ne', '<', '>', '>=', '<=', 'eq'],
  FIELD_SEQ: {
    isExpanded: 1,
    name: 2,
    indexType: 3,
    fields: 4,
  },
  SUB_FIELD_SEQ: {
    attribute: 1,
    order: 2,
    operator: 2,
    value: 3,
    length: 3,
  },
  TOTAL_FIELDS: 4, // total columns
  SUB_TOTAL_FIELDS: 3, // total columns
  DEFAULT: {
    SUB_OBJ: {
      attribute: '',
      // collate: '', commented as discussed with Avina
      order: '',
      length: undefined,
      operator: '',
      value: '',
    },
    ROW_OBJ: {
      isExpanded: false,
      name: '',
      indexType: '',
      fields: [],
      // operator: '', this will be managed in sub-row
      indexFields: [],
    },
  },
};

export const MONGO_INDEX = {
  FIELD_SEQ: {
    name: 1,
    ttl: 2,
    expireAfterSeconds: 3,
    unique: 4,
  },
  SUB_FIELD_SEQ: {
    attribute: 1,
    type: 2,
  },
  TOTAL_FIELDS: 4, // total columns
  SUB_TOTAL_FIELDS: 2, // total columns
  DEFAULT: {
    ROW_OBJ: {
      isExpanded: false,
      name: '',
      ttl: '',
      expireAfterSeconds: '',
      indexFields: [],
    },
    SUB_OBJ: {
      attribute: '',
      indexType: '',
    },
  },
  MAX_SUB_ROWS_ALLOWED: 32,
};

export const SQL_TYPE_OPTIONS = [
  { name: SQL_INDEX.TYPE.BTREE, id: SQL_INDEX.TYPE.BTREE },
  // { name: 'GIN index', id: SQL_INDEX.TYPE.GIN },
  { name: SQL_INDEX.TYPE.PARTIAL, id: SQL_INDEX.TYPE.PARTIAL },
  { name: SQL_INDEX.TYPE.UNIQUE, id: SQL_INDEX.TYPE.UNIQUE },
];

export const MONGO_TYPE_OPTIONS = [
  { name: 'Ascending', id: 1, sequence: 1 },
  { name: 'Descending', id: -1, sequence: 2 },
  { name: '2dSphere', id: '2dsphere', sequence: 3 },
];

export const getTypeOptions = (constName) => Object.keys(constName).map(
  (x) => ({ id: constName[x], name: constName[x] }),
);

export const getCollateOpts = () => SQL_INDEX.COLLATE.map((x) => ({ id: x, name: x }));
export const getOperatorOpts = () => SQL_INDEX.GIN_OPERATOR_OPTIONS.map((x) => ({ id: x, name: x }));
export const getAssignOperatorOpts = () => SQL_INDEX.ASSIGNMENT_OPERATOR_OPTIONS.map((x) => ({ id: x, name: x }));
export const checkDuplicate = (arr) => arr.some((x) => x && arr.indexOf(x) !== arr.lastIndexOf(x));
export const findDuplicate = (arr) => arr.find((x) => arr.indexOf(x) !== arr.lastIndexOf(x));
export const getSubFieldPosition = (index, dbType) => {
  const { SUB_FIELD_SEQ, SUB_TOTAL_FIELDS } = dbType === DB_TYPE.MONGODB ? MONGO_INDEX : SQL_INDEX;
  const focIndex = index * SUB_TOTAL_FIELDS;
  const FiledPosition = {
    attribute: focIndex + SUB_FIELD_SEQ.attribute,
    order: focIndex + SUB_FIELD_SEQ.order,
    operator: focIndex + SUB_FIELD_SEQ.operator,
    value: focIndex + SUB_FIELD_SEQ.value,
    length: focIndex + SUB_FIELD_SEQ.length,
    type: focIndex + SUB_FIELD_SEQ.type,
  };
  return { FiledPosition };
};
export const getFieldPosition = (index, isSub, dbType) => {
  if (isSub) return getSubFieldPosition(index, dbType);
  const { FIELD_SEQ, TOTAL_FIELDS } = dbType === DB_TYPE.MONGODB ? MONGO_INDEX : SQL_INDEX;
  const focIndex = index * TOTAL_FIELDS;
  const FiledPosition = {
    name: focIndex + FIELD_SEQ.name,
    indexType: focIndex + FIELD_SEQ.indexType,
    fields: focIndex + FIELD_SEQ.fields,
    ttl: focIndex + FIELD_SEQ.ttl, // mongo
    expireAfterSeconds: focIndex + FIELD_SEQ.expireAfterSeconds,
    unique: focIndex + FIELD_SEQ.unique,
  };
  return { FiledPosition };
};

export const prepareIndexing = ({ modelIndexes, dbType }) => {
  if (modelIndexes?.length > 0) {
    let temp = cloneDeep(modelIndexes);

    if (dbType === DB_TYPE.MONGODB) {
      // mongodb
      temp = temp.map((x) => {
        const tempFields = [];
        const obj = {
          ...x,
          ...x.options,
          ttl: !!x.options?.expireAfterSeconds,
          isExist: true,
          isExpanded: false,
        };
        delete obj.options;
        if (x?.indexFields && Object.entries(x.indexFields)?.length > 0) {
          Object.keys(x.indexFields).forEach((f) => {
            tempFields.push({
              attribute: f,
              type: x.indexFields[f],
              isExist: true,
            });
          });
        }
        obj.indexFields = tempFields;
        return obj;
      });
    } else {
      // sql
      temp = temp.map((x) => {
        if (x.isParserRequired && x?.name === 'PRIMARY') {
        // old data script
          const newIndexFields = [];
          if (x.indexFields && Object.entries?.(x.indexFields)?.length > 0) {
            Object.keys(x.indexFields).forEach((y) => {
              newIndexFields.push({
                attribute: y,
                collate: 'en_US',
                length: 1,
                order: 'ASC',
              });
            });
          }
          return {
            ...x,
            isDefault: true,
            indexType: SQL_INDEX.TYPE.BTREE,
            indexFields: newIndexFields,
            isExist: true,
            isExpanded: false,
          };
        }
        if (x?.indexFields?.length > 0) {
          if (x.indexType === SQL_INDEX.TYPE.BTREE || x.indexType === SQL_INDEX.TYPE.PARTIAL) {
            x.indexFields = x.indexFields.map((y) => ({ ...y, isExist: true }));
          }
        } else if (x.indexType === SQL_INDEX.TYPE.GIN) {
          x.indexFields = [{ operator: x.operator, isExist: true }];
        } else if (x.indexType && x.indexType !== SQL_INDEX.TYPE.UNIQUE) { x.indexFields = [SQL_INDEX.DEFAULT.SUB_OBJ]; }
        return { ...x, isExist: true, isExpanded: false };
      });
    }
    return temp;
  }
  return [];
};
