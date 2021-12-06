/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable radix */
import React, { useState } from 'react';
import {
  cloneDeep, isArray, isEmpty, omit,
} from 'lodash';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import omitDeep from 'omit-deep-lodash';
import { useHistory } from 'react-router';
import { Icons } from '@dhiwise/icons';
import {
  Button, MessageNotify, Error, Loader,
} from '../../../../components';
import ModelHeader from './ModelHeader';
import { updateModel } from '../../../../redux/reducers/models';
import { useBoolean } from '../../../../components/hooks';
import { API_URLS, apiClient } from '../../../../api';
// import DeleteModel from '../DeleteModel';
import useToastNotifications from '../../../hooks/useToastNotifications';
import {
  ERROR_MSG, getParsedType, getParsedKeys, parsedKeys,
  DB_TYPE, util, isNumberType, KEYS, DB_CONST, pluralizeTableName,
} from '../../../../constant/model';
import { EditorProvider } from './EditorProvider';
import { EditorTabs } from './EditorTabs';
import {
  emailRegex, isRegExp, modelAttrRegex, URLRegex,
} from '../../../../utils/regex';
import { useModel } from './ModelProvider';
import { IndexProvider } from '../Indexing/SQLIndexing/IndexProvider';
import { checkDuplicate, SQL_INDEX, findDuplicate } from '../../../../constant/modelIndexing';
import { RedirectUrl } from '../../../../constant/Nodecrud';

export const NoModelData = 'Create at least one model. You can\'t proceed further as further steps are dependent on the models.';
const jsonLint = require('jsonlint');

const ErrorNotify = () => (
  <div className="p-2">
    <MessageNotify size="small" messageType="alert" isAlert>
      This model will be not included in generated code. Please resolve
      error first
    </MessageNotify>
  </div>
);

const Editor = React.memo(({ currentId, saveRef, loaderRef }) => {
  const {
    modelErrors, modelErrCount, isError, setModelErrors, setIsJsonError,
  } = useModel();
  const history = useHistory();
  const { addErrorToast, addSuccessToast } = useToastNotifications();
  const dispatch = useDispatch();

  const {
    modelList, currentApplicationCode, dbType, detailFetching,
  } = useSelector(({ models, projects }) => ({
    dbType: DB_CONST[projects.applicationDatabase.databaseType],
    modelList: models.modelList,
    currentApplicationCode: projects.currentApplicationCode,
    detailFetching: models.detailFetching,
  }), shallowEqual);

  const TABLE_TYPES = React.useMemo(() => util.getTableTypes(dbType), [dbType]);
  const currentModel = React.useMemo(() => modelList.find((model) => model._id === currentId), [currentId, modelList]);

  const [jsonError, setJsonError] = useState(false);
  // const [showError, setShowError] = useBoolean(false);
  const [showError, setShowError, setHideError] = useBoolean(false);
  // Remove
  // const [, setSaveLoader, hideSaveLoader] = useBoolean(false);
  // saveLoader,

  const tabRef = React.useRef();
  const updateRef = React.useRef();
  React.useEffect(() => setIsJsonError(!!jsonError?.isCustom), [jsonError]);
  React.useEffect(() => {
    if (modelErrCount && jsonError) setJsonError(false);
  }, [modelErrCount]);

  const handleShowError = () => {
    setShowError();
  };

  const isCustomErr = React.useCallback((parseCode, isKey, mainAttrObj, options) => {
    let errorFlag = false;
    if (!parseCode) return errorFlag;
    Object.keys(parseCode).every((x) => {
      if (x === '_id') return x; // don't check for validation
      if (!isKey && (parseCode[x] === null || (typeof parseCode[x] === 'string' && !parseCode[x])
      || (typeof parseCode[x] === 'object' && Object.entries(parseCode[x]).length === 0))) {
        // do not update json if value contains [{},'',null]
        errorFlag = { name: 'Error', message: `${x}: Expecting value, got empty`, isCustom: true };
        if (errorFlag) return errorFlag;
      }

      // sub-attr logic starts
      let isSubAttr = false;
      if (dbType === DB_TYPE.MONGODB && typeof parseCode[x] === 'object' && Array.isArray(parseCode[x])) {
        isSubAttr = true;
      } else if (dbType === DB_TYPE.MONGODB && parseCode[x] && typeof parseCode[x] === 'object' && Object.keys(parseCode[x])?.length > 0) {
        // type object
        if (Object.values(parseCode[x]).some((v) => typeof v === 'object' && v)) {
          // if any value has type object
          isSubAttr = true;
        }
      }
      if (isSubAttr) {
        if (!errorFlag) {
          errorFlag = isCustomErr(Array.isArray(parseCode[x]) ? parseCode[x][0] : parseCode[x],
            false,
            { parseCode, attribute: x, isSubAttr },
            options);
        }
        if (errorFlag) return errorFlag;
      }
      // sub-attr logic ends

      if (typeof x === 'string' && !modelAttrRegex.test(x)) {
        // attribute name validation
        errorFlag = { name: 'Error', message: `${x}: ${ERROR_MSG.attrName}`, isCustom: true };
        if (errorFlag) return errorFlag;
      }

      if (dbType === DB_TYPE.MONGODB && typeof parseCode[x] === 'object' && !isArray(parseCode[x]) && parseCode[x] && Object.entries(parseCode[x])?.length > 0) {
        if (!errorFlag) errorFlag = isCustomErr(parseCode[x], true, { parseCode, attribute: x }, options);
        if (errorFlag) return errorFlag;
      }
      if (typeof parseCode[x] === 'object' && !isEmpty(parseCode[x]) && !(Array.isArray(parseCode[x])
      || (Object.keys(parseCode[x])?.length > 0
      && typeof parseCode[x][Object.keys(parseCode[x])?.[0]] === 'object'))
       && !getParsedType(parseCode[x]?.type, dbType)) {
        errorFlag = { name: 'Error', message: `${x}: ${ERROR_MSG.type}`, isCustom: true };
        if (errorFlag) return errorFlag;
      }
      if (parseCode[x]?.min > parseCode[x]?.max) {
        errorFlag = { name: 'Error', message: `${x}: ${ERROR_MSG.minMax}`, isCustom: true };
        if (errorFlag) return errorFlag;
      }
      if (parseCode[x]?.minLength > parseCode[x]?.maxLength) {
        errorFlag = { name: 'Error', message: `${x}: ${ERROR_MSG.minMaxLength}`, isCustom: true };
        if (errorFlag) return errorFlag;
      }
      if (parseCode[x] && isNumberType(parseCode[x].type, TABLE_TYPES)) {
        // default value validation
        if (parseCode[x].default && parseCode[x].min && parseCode[x].default < parseCode[x].min) {
          errorFlag = { name: 'Error', message: `${x}: ${ERROR_MSG.min}`, isCustom: true };
        } else if (parseCode[x].default && parseCode[x].max && parseCode[x].default > parseCode[x].max) {
          errorFlag = { name: 'Error', message: `${x}: ${ERROR_MSG.max}`, isCustom: true };
        }
        if (errorFlag) return errorFlag;
      }
      if (parseCode[x]) {
        // default value validation
        if (parseCode[x]?.type === TABLE_TYPES.EMAIL && parseCode[x]?.default && !emailRegex.test(parseCode[x].default)) {
          errorFlag = { name: 'Error', message: `${x}: ${ERROR_MSG.email}`, isCustom: true };
          if (errorFlag) return errorFlag;
        }
        if (parseCode[x]?.type === TABLE_TYPES.URL && parseCode[x]?.default && !URLRegex.test(parseCode[x].default)) {
          errorFlag = { name: 'Error', message: `${x}: ${ERROR_MSG.url}`, isCustom: true };
          if (errorFlag) return errorFlag;
        }
        if (parseCode[x].default && parseCode[x].minLength && parseCode[x].default?.length < parseInt(parseCode[x].minLength)) {
          errorFlag = { name: 'Error', message: `${x}: ${ERROR_MSG.minLength}`, isCustom: true };
          if (errorFlag) return errorFlag;
        } if (parseCode[x].default && parseCode[x].maxLength && parseCode[x].default?.length > parseInt(parseCode[x].maxLength)) {
          errorFlag = { name: 'Error', message: `${x}: ${ERROR_MSG.maxLength}`, isCustom: true };
          if (errorFlag) return errorFlag;
        }
        if (!isKey && dbType === DB_TYPE.MONGODB && !parseCode[x]?.ref
           && [TABLE_TYPES.OBJECTID, TABLE_TYPES.VIRTUAL_RELATION].includes(parseCode[x]?.type)) {
          // ref validaion (select model)
          errorFlag = { name: 'Error', message: `${x}: ${ERROR_MSG.ref}`, isCustom: true };
          if (errorFlag) return errorFlag;
        }
        if (!isKey && dbType === DB_TYPE.MONGODB && parseCode[x].type === TABLE_TYPES.VIRTUAL_RELATION) {
          // manage virtual realtionship
          if (!parseCode[x].ref || !parseCode[x].foreignField || !parseCode[x].localField) {
            const msg = `${!parseCode[x].foreignField ? 'foreignField' : ''}
            ${!parseCode[x].ref ? 'ref' : ''} ${!parseCode[x].localField ? 'ref' : ''} `;
            errorFlag = { name: 'Error', message: `${x}: Select ${msg}`, isCustom: true };
            if (errorFlag) return errorFlag;
            // cErrors.push(err);
          }
        }
        if ((!isEmpty(options?.customSetting?.[x]) || (mainAttrObj?.isSubAttr
           && !isEmpty(options?.customSetting?.[mainAttrObj.attribute]?.[x])))
          && ((dbType === DB_TYPE.MONGODB && (parseCode[x]?.type === TABLE_TYPES.NUMBER
            || parseCode[x]?.type === TABLE_TYPES.STRING)) || parseCode[x]?.type === TABLE_TYPES.ENUM)
        ) {
          // manage ENUM type

          // eslint-disable-next-line no-inner-declarations
          function enumValidation(eObj) {
            // return if undefined or have sub-attribute
            if (!eObj || !eObj?.isEnum || (Object.values(parseCode[x]).some((v) => typeof v === 'object' && v))) { return; }
            let enumKeys = '';
            if (!eObj.enum) enumKeys = 'enumFile, enumAttribute, default';
            else {
              if (!eObj.enum?.enumFile) enumKeys += 'enumFile';
              if (!eObj.enum?.enumAttribute) enumKeys += ', enumAttribute';
              if (!eObj.enum?.default) enumKeys += ', default value';
            }
            if (enumKeys) {
              errorFlag = {
                name: 'Error', message: `${x}: Select ${enumKeys}`, isCustom: true,
              };
            }
          }

          if (mainAttrObj?.attribute) {
            // for subattr
            const o = isArray(options?.customSetting?.[mainAttrObj.attribute]) ? options?.customSetting?.[mainAttrObj.attribute]?.[0] : options?.customSetting?.[mainAttrObj.attribute]?.[x];
            enumValidation(o);
          } else { enumValidation(options?.customSetting?.[x]); }
          if (errorFlag) return errorFlag;
        }
        if (dbType === DB_TYPE.MONGODB && isKey && mainAttrObj && parseCode[x].type === TABLE_TYPES.POINT) {
          // manage POINT type
          const isExist = Object.keys(parseCode).find((s) => parseCode[s]?.type === TABLE_TYPES.ARRAY);
          if (!isExist) {
            errorFlag = {
              name: 'Error', message: `${mainAttrObj?.attribute}: ${ERROR_MSG.point}`, isCustom: true,
            };
            if (errorFlag) return errorFlag;
          }
          if (dbType === DB_TYPE.MONGODB && x !== 'type') {
            // Attribute name must be 'type' for type 'Point'
            errorFlag = {
              name: 'Error', message: `${mainAttrObj?.attribute}: ${ERROR_MSG.pointAttr}`, isCustom: true,
            };
            if (errorFlag) return errorFlag;
          }
        }
        if (parseCode[x].match && !isKey) {
          if (!isRegExp(parseCode[x].match)) {
            errorFlag = { name: 'Error', message: `${x}: ${ERROR_MSG.match}`, isCustom: true };
            if (errorFlag) return errorFlag;
          }
          const regex = RegExp(parseCode[x].match.slice(1, -1));
          if (parseCode[x].default && !regex.test(parseCode[x].default)) {
            // validate default value as per regex
            errorFlag = { name: 'Error', message: `${x}: ${ERROR_MSG.matchRegex}`, isCustom: true };
            if (errorFlag) return errorFlag;
          }
        }
        if (dbType !== DB_TYPE.MONGODB && parseCode[x].ref && !isKey) {
          if (!parseCode[x].refAttribute) {
            errorFlag = { name: 'Error', message: `${x}: ${ERROR_MSG.refAttr}`, isCustom: true };
          } else if (!parseCode[x].relType) {
            errorFlag = { name: 'Error', message: `${x}: ${ERROR_MSG.relType}`, isCustom: true };
          }
          if (errorFlag) return errorFlag;
        }
        if (dbType === DB_TYPE.MONGODB && parseCode[x]?.type === TABLE_TYPES.PERCENT && (parseCode[x]?.default < 0 || parseCode[x]?.default > 100)) {
          // Default value between 0 to 100
          errorFlag = { name: 'Error', message: `${x}: ${ERROR_MSG.percentage}`, isCustom: true };
          if (errorFlag) return errorFlag;
        }
      }
      return x;
    });
    return errorFlag;
  }, []);

  const saveJSON = React.useCallback(({
    showMsg, tCode, tcustomSetting, indexes, tHooks, msg, isRedirect = false, tDependency,
  }) => {
  // Remove
  // isRedirect= if step remove ,remove await and async
    try {
      if (jsonError && !jsonError?.isCustom && !modelErrCount) {
        // if error then open error popup
        handleShowError();
        return;
      }
      if (!tabRef || !tabRef.current) return;
      const data = tCode || tabRef?.current?.code;
      const dependency = tDependency || tabRef?.current?.dependency;
      const schema = jsonLint.parse(data);
      let hooks = tHooks || tabRef?.current?.hooks;
      let customSetting = tcustomSetting || tabRef?.current?.customSetting;
      let modelIndexes = cloneDeep(indexes) || cloneDeep(tabRef?.current?.modelIndexList) || [];
      if (isEmpty(currentModel?.schemaJson) && isEmpty(schema)) {
        if (isRedirect && modelList.findIndex((m) => !isEmpty(m.schemaJson)) >= 0) {
          history.push(RedirectUrl[currentApplicationCode].model.nextUrl);
        }
        return;
      }
      if (hooks?.length > 0) {
        hooks = hooks.map((x) => omit(x, ['isExist']));
      }
      let indexErrors = false;
      if (modelIndexes?.length > 0) {
        const isDuplicateName = findDuplicate(modelIndexes.map((f) => f.name));
        if (isDuplicateName) {
          indexErrors = { name: 'Indexing error', message: `${isDuplicateName}: ${ERROR_MSG.indexName}`, isCustom: true };
        }
        if (!indexErrors) {
          modelIndexes = modelIndexes.filter((x) => x.name).map((x) => {
            if (dbType !== DB_TYPE.MONGODB) {
              // sql indexing
              if (!x.indexType) {
                indexErrors = { name: 'Indexing error', message: `${x.name}: ${ERROR_MSG.indexType}`, isCustom: true };
              }
              if (x.indexType === SQL_INDEX.TYPE.GIN) {
                x.operator = x.indexFields?.[0]?.operator;
                x.indexFields = [];
              }
              if ([SQL_INDEX.TYPE.BTREE].includes(x?.indexType)) {
                x.fields = [];
              }
            }

            if (dbType !== DB_TYPE.MONGODB && (x.indexType === SQL_INDEX.TYPE.PARTIAL
              || x.indexType === SQL_INDEX.TYPE.UNIQUE) && (!x.fields || x.fields?.length === 0)) {
              // sql multiple attr validation
              indexErrors = {
                name: 'Indexing error',
                message: `${x.name}: Please select attributes`,
                isCustom: true,
              };
            }

            if (x.indexFields?.length > 0 && !indexErrors) {
              if (checkDuplicate(x.indexFields.map((f) => f.attribute))) {
                indexErrors = { name: 'Indexing error', message: `${x.name}: ${ERROR_MSG.attribute}`, isCustom: true };
              }
              x.indexFields = x.indexFields.filter((f) => f.attribute);
              if (dbType === DB_TYPE.MONGODB) {
                // model indexing
                if (x.indexFields.length === 0) indexErrors = { name: 'Indexing error', message: `${x.name}: ${ERROR_MSG.requiredSubIndex}`, isCustom: true };
                if (x.ttl && !x.expireAfterSeconds) indexErrors = { name: 'Indexing error', message: `${x.name}: ${ERROR_MSG.ttl}`, isCustom: true };

                const tempFields = {};
                x.indexFields.forEach((f) => {
                  if (!f.attribute || !f.type) {
                    indexErrors = {
                      name: 'Indexing error',
                      message: `${x.name}: ${!f.attribute ? ERROR_MSG.requiredAttr : ERROR_MSG.requiredIndexType}`,
                      isCustom: true,
                    };
                  }
                  if (!indexErrors) { tempFields[f.attribute] = f.type; }
                });
                x.indexFields = tempFields;
              } else {
                // sql indexing validation
                if (x.indexFields.length === 0) indexErrors = { name: 'Indexing error', message: `${x.name}: ${ERROR_MSG.requiredSqlSubIndex}`, isCustom: true };

                if (!indexErrors) {
                  x.indexFields.forEach((f) => {
                    if (x.indexType === SQL_INDEX.TYPE.BTREE && (schema?.[f?.attribute]?.type === 'STRING') && (!f.attribute || !f.length)) { // check for length validation only if the attribute type is "STRING"
                      indexErrors = {
                        name: 'Indexing error',
                        message: `${x.name}: Please input ${!f.attribute ? 'attribute' : 'length'}`,
                        isCustom: true,
                      };
                    }
                    if (x.indexType === SQL_INDEX.TYPE.PARTIAL && (!f.attribute || !f.operator || !f.value)) {
                      indexErrors = {
                        name: 'Indexing error',
                        message: `${x.name}: Please input ${!f.attribute ? 'attribute' : !f.operator ? 'operator' : 'value'}`,
                        isCustom: true,
                      };
                    }
                  });
                }
              }
            }

            if (dbType === DB_TYPE.MONGODB) { x.options = { expireAfterSeconds: x.ttl ? x.expireAfterSeconds : undefined, unique: x.unique }; }

            x = omit(x, ['isExpanded', 'ttl', 'expireAfterSeconds', 'unique']);
            x = omitDeep(x, ['isExist']);
            return x;
          });
        }
      }

      if (indexErrors) {
        setJsonError(indexErrors);
        // hideSaveLoader();
        return;
      }

      let errorFlag = false;
      const primaryKeys = [];
      const allSchemaAttr = [];
      const parentAttrs = []; // attribute name having sub-atrributes

      if (schema && typeof schema === 'object') {
        // check for duplicate schema attribute
        const isDuplicateAttr = findDuplicate(Object.keys(schema).map((f) => f.toLowerCase()));
        if (isDuplicateAttr) {
          errorFlag = { name: 'Error', message: `${isDuplicateAttr}: ${ERROR_MSG.duplicateAttr}`, isCustom: true };
        }
        if (errorFlag) {
          setJsonError(errorFlag);
          return;
        }

        Object.keys(schema)?.map((x) => {
          if (!x) return x;
          if (!schema[x]) return x;
          let isSubAttr = false;
          if (dbType === DB_TYPE.MONGODB && typeof schema[x] === 'object' && Array.isArray(schema[x])) {
            // Add value false for "_id" {_id:false} => exclude _id if no sub-attr
            // eslint-disable-next-line no-prototype-builtins
            if (Object.keys(schema[x][0]).length === 1 && schema[x][0].hasOwnProperty('_id')) {
              isSubAttr = false;
              schema[x] = { type: TABLE_TYPES.ARRAY };
            } else { isSubAttr = true; }
          } else if (dbType === DB_TYPE.MONGODB && typeof schema[x] === 'object' && Object.keys(schema[x])?.length > 0) {
          // type object
            if (Object.values(schema[x]).some((v) => typeof v === 'object' && v)) {
              // if any value has type object
              isSubAttr = true;
            } else {
            // eslint-disable-next-line no-lonely-if
              if (Object.keys(schema[x]).includes('type') && parsedKeys(schema[x], dbType)?.isSub) {
                isSubAttr = true;
              } else {
                isSubAttr = false;
              }
            }
          }

          if (isSubAttr && dbType === DB_TYPE.MONGODB) {
          // manage sub-rows
            const tempSub = Array.isArray(schema[x]) ? schema[x][0] : schema[x];
            // check for duplicate schema attribute
            const isDuplicateSubAttr = findDuplicate(Object.keys(tempSub).map((f) => f.toLowerCase()));
            if (isDuplicateSubAttr) {
              errorFlag = { name: 'Error', message: `${isDuplicateSubAttr}: ${ERROR_MSG.duplicateAttr}`, isCustom: true };
            }

            Object.keys(tempSub).map((y) => {
              if (tempSub[y]) {
                if (typeof tempSub[y] === 'string') {
                  const newAttr = {};
                  newAttr.type = tempSub[y];
                  tempSub[y] = newAttr;
                }
                if (tempSub[y].type) {
                  tempSub[y].type = getParsedType(tempSub[y].type, dbType);
                }
                if (dbType === DB_TYPE.MONGODB && Array.isArray(schema[x]) && y === '_id') {
                  // Add value false for "_id" {_id:false}
                  tempSub[y] = tempSub[y].default || false;
                } else { tempSub[y] = getParsedKeys(tempSub[y], dbType); }
                if (tempSub[y]?.type === TABLE_TYPES.POINT) {
                // type point then add index
                  const isIndexExist = modelIndexes?.find((mi) => mi.indexFields?.[x] === '2dsphere');
                  if (!isIndexExist) {
                    modelIndexes.push({
                      name: `${[x]}_default`,
                      indexFields: { [x]: '2dsphere' },
                      options: { unique: false },
                    });
                  }
                }
                allSchemaAttr.push(`${x}.${y}`);
              }
              if (tempSub[y]?.private === true) {
                // prepare obj
                customSetting = {
                  ...customSetting,
                  [x]: {
                    ...customSetting[x],
                    [y]: {
                      ...customSetting[x][y],
                      private: true,
                    },
                  },
                };
              }
              delete tempSub[y].private; // remove private key from schema
              return y;
            });
            schema[x] = Array.isArray(schema[x]) ? [tempSub] : tempSub;
            parentAttrs.push(x);
          } else {
            if (typeof schema[x] === 'string') {
              const newAttr = {};
              newAttr.type = schema[x];
              schema[x] = newAttr;
            }
            if (schema[x].type) {
              schema[x].type = getParsedType(schema[x].type, dbType);
            }
            schema[x] = getParsedKeys(schema[x], dbType);
            if (dbType !== DB_TYPE.MONGODB && schema[x][KEYS.primary]) {
              primaryKeys.push(x); // store all selected primary keys
            }
            allSchemaAttr.push(x);
            if (schema[x]?.private === true) {
              // prepare obj
              customSetting = {
                ...customSetting,
                [x]: {
                  ...customSetting[x],
                  private: true,
                },
              };
            }
            delete schema[x].private; // remove private key from schema
          }
          return x;
        });
      }
      if (errorFlag) {
        setJsonError(errorFlag);
        return;
      }
      // error handler, to read data we'll have to parse twice due to backslash escaping
      errorFlag = isCustomErr(schema, null, null, { customSetting });
      if (errorFlag) {
        setJsonError(errorFlag);
        // setShowError();
        // hideSaveLoader();
        return;
      }

      if (customSetting && typeof customSetting === 'object' && Object.entries(customSetting)?.length > 0) {
        customSetting = omitDeep(customSetting, ['isEnum', 'isMarkedAsPrivate']);
        Object.keys(customSetting).forEach((x) => {
          // filter empty object
          if (isEmpty(customSetting[x])) delete customSetting[x];
        });
      }

      // if (dbType !== DB_TYPE.MONGODB) {
      //   // SQL: Primary composition for indexes
      //   const isIndexExist = modelIndexes?.findIndex((mi) => mi.name === 'PRIMARY' && mi.isDefault);
      //   let indexFields = [];
      //   primaryKeys.map((x) => {
      //     indexFields.push({
      //       attribute: x,
      //       collate: 'en_US',
      //       order: 'ASC',
      //       length: 1,
      //     });
      //     return x;
      //   });
      //   indexFields = uniqBy(indexFields, 'attribute');
      //   const indexObj = {
      //     isDefault: true,
      //     name: 'PRIMARY',
      //     indexType: SQL_INDEX.TYPE.BTREE,
      //     indexFields,
      //   };
      //   if (isIndexExist < 0) {
      //     // to add new entry of PRIMARY keys
      //     if (indexFields?.length > 0) { modelIndexes.push(indexObj); }
      //   } else if (indexFields?.length > 0) modelIndexes[isIndexExist] = indexObj; // update existing one
      //   else modelIndexes.splice(isIndexExist, 1); // remove existing one
      // }

      if (modelIndexes?.length > 0) {
        // filter by update and deleted model attr
        modelIndexes.forEach((x) => {
          if (dbType === DB_TYPE.MONGODB) {
            Object.keys(x.indexFields).forEach((f) => {
              // ignore error checking for attribute having sub-attribute
              if (f && !allSchemaAttr.includes(f) && !parentAttrs.includes(f)) {
                indexErrors = {
                  name: 'Indexing error',
                  message: `${x.name}: ${ERROR_MSG.requiredAttr}`,
                  isCustom: true,
                };
              }
            });
          } else {
            x.indexFields.forEach((f) => {
              if (f.attribute && !allSchemaAttr.includes(f.attribute)) {
                indexErrors = {
                  name: 'Indexing error',
                  message: `${x.name}: ${ERROR_MSG.requiredAttr}`,
                  isCustom: true,
                };
              }
            });
          }
        });
      }

      if (indexErrors) {
        setJsonError(indexErrors);
        return;
      }

      const customHook = [];
      const hookError = false;
      hooks.map((x) => {
        // if (!x.code) hookError = { name: 'Error', message: `Hook ${x.hookType}: code is required`, isCustom: true };
        if (!x.isErr && x.code) { customHook.push(omit(x, ['index', '_id', 'hookType', 'isErr'])); }
        return x;
      });
      if (hookError) {
        setJsonError(hookError);
        // hideSaveLoader();
        return;
      }
      // setSaveLoader();

      let customJson;
      if (currentModel.customJson) {
        customJson = { ...currentModel.customJson };
      }
      customJson = {
        additionalSetting: customSetting,
        dependencySetting: dependency.filter((x) => x.newKey || x.isDelete),
      };
      if (jsonError) setJsonError(false);
      if (showError) setHideError();

      // loaderCallBack({ isHidePopup: false });
      loaderRef.current.setLoader();
      apiClient(`${API_URLS.schema.update}/${currentId}`, {
        customJson,
        schemaJson: schema,
        name: currentModel.name,
        tableName: pluralizeTableName(currentModel.name, currentApplicationCode),
        description: currentModel.description,
        hooks: customHook,
        modelIndexes,
        definitionType: currentApplicationCode,
      }, 'PUT', null, null, {
        isHandleCatch: true,
      }).then((res) => {
        if (res?.code === 'E_BAD_REQUEST') {
          // manage multiple errors
          loaderRef.current.setLoader();

          if (res.data?.length > 0) { setModelErrors(res.data); }
          // hideSaveLoader();
          addErrorToast(res.message);
        } else if (res?.code === 'OK') {
          if (modelErrors?.length > 0) setModelErrors?.(modelErrors.filter((x) => x?.modelName !== currentModel?.name));
          dispatch(updateModel(res?.data));
          if (showMsg) addSuccessToast(msg || res.message);
          // hideSaveLoader();
          // if (tableRef?.current && res?.message) addSuccessToast(res.message);
          // setCode(JSON.stringify(res?.data?.schemaJson || {}));
          loaderRef.current.setLoader();

          // loaderCallBack({ isHidePopup: true });
          if (isRedirect) {
            history.push(RedirectUrl[currentApplicationCode].model.nextUrl);
          }
        }
      }).catch((err) => {
        // hideSaveLoader();
        addErrorToast(err);
        loaderRef.current.setLoader();
      });
      updateRef.current?.setHideEdit();
    } catch (err) {
      setJsonError(err);
      // hideSaveLoader();
      // setShowError();
    }
  }, [currentModel, tabRef, modelErrors, jsonError, showError, dbType, handleShowError]);

  const handleSave = React.useCallback(({ isRedirect = false }) => {
    if ((isEmpty(modelList) || modelList.findIndex((m) => !isEmpty(m.schemaJson)) < 0) && (isEmpty(currentModel?.schemaJson) && isEmpty(JSON.parse(tabRef?.current?.code)))) {
      addErrorToast(NoModelData);
      return;
    }
    saveJSON({ showMsg: true, isRedirect });
  }, [saveJSON]);
  React.useImperativeHandle(saveRef, () => ({ handleSave }));

  return (
    <>
      {
        detailFetching ? <Loader />
          : (
            <>
              <div className="headTop">
                <div className="flex items-start p-3 pb-0 pr-5 pb-2">
                  <ModelHeader
                    currentId={currentId}
                    currentModel={currentModel}
                    // onUpdate={handleUpdate}
                    updateRef={updateRef}
                  />
                  <div className="w-4/12 xxl:w-6/12 flex justify-end items-center">
                    <Button
                      onClick={handleShowError}
                      className="ml-2"
                      variant="secondary"
                      shape="rounded"
                      size="small"
                      isIcon
                      label={`${modelErrCount + (jsonError ? 1 : 0) || 0} error`}
                      icon={modelErrCount > 0 || !!jsonError ? <Icons.Alert color="#E24C4B" /> : <Icons.Alert />}
                    />
                  </div>
                </div>
                {!!isError?.(currentModel?.name) || !!jsonError ? (
                  <ErrorNotify />
                ) : null}
              </div>

              <EditorProvider saveJSON={saveJSON}>
                <IndexProvider>
                  <EditorTabs
                    ref={tabRef}
                    jsonError={jsonError}
                    setJsonError={setJsonError}
                  />
                </IndexProvider>
              </EditorProvider>
            </>
          )
      }

      {
        showError
          ? (
            <Error
              isModelTab
              isOpen={showError}
              error={jsonError}
              jsonErrCount={jsonError ? 1 : 0}
              modelErrCount={modelErrCount}
              modelErrors={modelErrors}
              handleCancel={setHideError}
            />
          ) : null
      }

    </>
  );
});
Editor.displayName = 'Editor';
export default Editor;
