/* eslint-disable no-param-reassign */
/* eslint-disable radix */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  omit, isEmpty, isEqual, cloneDeep, isObject, extend,
} from 'lodash';
import {
  util,
  getDisableField,
  getParsedType,
  getParsedKeys,
  parsedKeys,
  SCHEMA_TAB,
  TABS,
  getHookData,
  DB_TYPE,
  isNumberType,
  DB_CONST,
  RELATION_TYPE,
} from '../../../../../constant/model';
import { filterObjectUndefinedValues } from '../../../../../utils/dataTypes';
import {
  getUnixTimestamp, getDateByTimestamp, dateTimeFormat, dateFormat, dateTimeFormatter, setDateToISO,
} from '../../../../../utils/dateTimeFormatter';
import { ORM_TYPE } from '../../../../../constant/Project/applicationStep';

const getHookType = (str) => {
  const arr = str.split('-');
  return { type: arr[0], ...(arr[1] && { operation: arr[1] }) };
};

export const EditorContext = React.createContext();
const arr = [];
const EditorProvider = React.memo(({
  children, saveJSON,
}) => {
  const dbType = useSelector((state) => DB_CONST[state.projects.applicationDatabase.databaseType]);
  const ormType = useSelector((state) => {
    if (state.projects.applicationDatabase.ormType === ORM_TYPE.ELOQUENT) return ORM_TYPE.SEQUELIZE;
    return state.projects.applicationDatabase.ormType;
  });
  const TABLE_TYPES = React.useMemo(() => util.getTableTypes(dbType), [dbType]);
  const [mainActiveTab, setMainActiveTab] = React.useState(0);
  const currentId = useSelector((state) => state.models.currentId);
  const modelList = useSelector((state) => state.models.modelList) || [];
  const currentModel = React.useMemo(() => modelList.find((model) => model._id === currentId), [currentId, modelList]);
  const currentApplicationCode = useSelector((state) => state.projects.currentApplicationCode);

  const hookOptions = getHookData(currentApplicationCode);

  const [code, setCode] = React.useState();
  const [tableJson, setTableJson] = useState(arr);
  const [activeTab, setActiveTab] = useState(SCHEMA_TAB.TABLE_VIEW);
  const [customSetting, setCustomSetting] = React.useState({});
  const [hooks, setHooks] = React.useState([]);
  const [dependency, setDependency] = React.useState([]);

  const listRef = React.useRef(null);

  React.useEffect(() => {
    const tempHooks = currentModel?.hooks ? [...currentModel?.hooks] : [];
    const typeArr = [];

    const newHooks = [];

    hookOptions.map((t) => {
      let obj = {};
      const isExist = tempHooks.find((hook) => (t.id === ((`${hook.type}-${hook.operation}`))));
      obj.code = '';
      if (isExist) {
        obj.isExist = true;
        obj.code = isExist.code;
      }
      obj.hookType = t.id;
      obj._id = t.id;
      obj = {
        ...obj,
        ...getHookType(obj.hookType),
      };
      newHooks.push(obj);
      typeArr.push(obj.hookType);
      return t;
    });
    setHooks(newHooks);
  }, [currentModel?.hooks]);

  const handleAddRow = React.useCallback((tableArr, isAutoFocus) => {
    // add new row
    const newTable = tableArr ? cloneDeep(tableArr) : [...tableJson];
    const obj = {
      key: `r${newTable.length}`,
    };
    newTable.push(obj);
    if (!isEqual(tableJson, newTable)) {
      setTableJson(() => newTable);
      requestAnimationFrame(() => {
        listRef?.current?.resetAfterIndex?.(0);
        // listRef?.current?.scrollToItem?.(newTable.length - 1); // add new row from head
        if (isAutoFocus) {
          // handleCurEleFocus(obj.key);
        }
      });
    }
  }, [tableJson, listRef?.current]);

  function prepareTableObj(x, parent, opt, customModelList = []) {
    if (x.minlength) {
      // parse for case-insensitive
      x.minLength = x.minlength;
      delete x.minlength;
    } if (x.maxlength) {
      // parse for case-insensitive
      x.maxLength = x.maxlength;
      delete x.maxlength;
    }
    const obj = {
      ...x,
      type: getParsedType(x.type, dbType),
      minLength:
        x.minLength > x.maxLength ? undefined : x.minLength?.toString(),
      maxLength:
        x.minLength > x.maxLength ? undefined : x.maxLength?.toString(),
      min: x.min > x.max ? undefined : x.min?.toString(),
      max: x.min > x.max ? undefined : x.max?.toString(),
      // attr: c,
      isExpand: false,
      ref: isEmpty(customModelList) ? modelList?.find((m) => m.name === x.ref)?._id : customModelList?.find((m) => m?.name === x.ref)?._id,
    };
    if (obj.ref) {
      obj.refName = x.ref;
    }
    if (obj.default === null) obj.filter = 'NULL';
    else if (obj.default !== undefined && obj.default !== null && obj.type !== TABLE_TYPES.BOOL) obj.filter = 'AS_DEFINED';
    if ((dbType !== DB_TYPE.MONGODB && isNumberType(obj.type, TABLE_TYPES))) {
      obj.filter = undefined;
    }
    if ([TABLE_TYPES.BOOL, '_id'].includes(obj.type) && obj.default !== undefined && obj.default !== null && typeof obj.default === 'boolean') obj.default = obj.default ? 'true' : 'false';
    if (obj.type === TABLE_TYPES.VIRTUAL_RELATION && !obj.localField) {
      obj.localField = '_id';
    }
    if (dbType !== DB_TYPE.MONGODB && obj.ref && !obj.relType) {
      obj.relType = RELATION_TYPE.HAS_MANY;
    }
    if (opt?.newCustomSetting) {
      // Mark attribute as private
      const tempSetting = cloneDeep(customSetting) || {};
      if (!parent && (obj.type === TABLE_TYPES.ARRAY || obj.type === JSON) && tempSetting?.[obj.attr]) {
        // set false for row attribute
        obj.private = false;
        tempSetting[obj.attr].private = false;
        tempSetting[obj.attr].isMarkedAsPrivate = false;
      }
      if (parent && typeof opt?.newCustomSetting?.[parent.attr]?.[obj.attr]?.private === 'boolean') {
        // sub-attr
        if (opt?.newCustomSetting?.[parent.attr]?.[obj.attr]?.isMarkedAsPrivate) {
          tempSetting[parent.attr][obj.attr].private = obj.private;
        } else {
          obj.private = opt?.newCustomSetting?.[parent.attr]?.[obj.attr]?.private;
          if (!tempSetting[parent.attr]) tempSetting[parent.attr] = {};
          if (!tempSetting[parent.attr]?.[obj.attr]) tempSetting[parent.attr][obj.attr] = {};
          tempSetting[parent.attr][obj.attr].private = opt?.newCustomSetting?.[parent.attr]?.[obj.attr]?.private;
          tempSetting[parent.attr][obj.attr].isMarkedAsPrivate = true;
        }
      } else if (!parent && typeof opt?.newCustomSetting?.[obj.attr]?.private === 'boolean') {
        // main row
        if (opt?.newCustomSetting?.[obj.attr]?.isMarkedAsPrivate) {
          tempSetting[obj.attr].private = obj.private;
        } else {
          obj.private = opt?.newCustomSetting?.[obj.attr]?.private;
          if (!tempSetting[obj.attr]) tempSetting[obj.attr] = {};
          tempSetting[obj.attr].private = opt?.newCustomSetting?.[obj.attr]?.private;
          tempSetting[obj.attr].isMarkedAsPrivate = true;
        }
      }

      // manage enum
      if ((dbType === DB_TYPE.MONGODB && (obj.type === TABLE_TYPES.STRING || obj.type === TABLE_TYPES.NUMBER))
      || obj.type === TABLE_TYPES.ENUM) {
        let enumObj = {};
        if (!parent) enumObj = opt?.newCustomSetting?.[obj.attr]?.enum;
        else {
        // sub-row
        // eslint-disable-next-line no-lonely-if
          if (parent?.attr && parent.type === TABLE_TYPES.JSON) {
            enumObj = opt?.newCustomSetting?.[parent.attr]?.[obj.attr]?.enum;
          } else if (parent?.attr && parent.type === TABLE_TYPES.ARRAY) {
            enumObj = opt?.newCustomSetting?.[parent.attr]?.[0]?.[obj.attr]?.enum || opt?.newCustomSetting?.[parent.attr]?.[obj.attr]?.enum;
          }
        }

        obj.enum = enumObj;
        if (obj.enum?.default) obj.filter = 'AS_DEFINED';
        if (obj.default !== null && obj.default !== undefined) obj.default = x.default;
        obj.isEnum = typeof obj.enum === 'object' && Object.entries(obj.enum)?.length > 0;
        if (!obj.isEnum) {
          obj.enum = undefined;
          obj.default = obj.default ?? undefined;
        }
        if (obj.enum?.default && (obj.default === null || obj.default === undefined)) {
        // on remove default value remove it from customsetting too
          // const tempSetting = cloneDeep(customSetting);
          obj.enum = omit(obj.enum, 'default');
          if (parent && tempSetting[parent.attr]?.[obj.attr]) { tempSetting[parent.attr][obj.attr].enum = obj.enum; } else if (!parent && tempSetting[obj.attr]) { tempSetting[obj.attr].enum = obj.enum; }
        }
      }
      setCustomSetting(tempSetting);
    }
    if (obj.type === TABLE_TYPES.DATE && dbType === DB_TYPE.POSTRAGSQL && obj.default) {
      // convert DATE for POSTRAGSQL DB
      obj.default = getDateByTimestamp(obj.default, true); // true for time
    } else if ((obj.type === TABLE_TYPES.DATE || obj.type === TABLE_TYPES.DATEONLY || obj.type === TABLE_TYPES.TIMESTAMP) && obj.default) {
      obj.default = new Date(obj.default);
    }
    return obj;
  }

  const prepareTableView = React.useCallback(({
    isAutoFocus = false, isMount = false, tCode, tCustomSetting, isReturnTempArray = false, customModelList = [], isExcludeArrayId,
  }) => {
    try {
      if (activeTab === SCHEMA_TAB.TABLE_VIEW && !isMount) return; // parser need only when TREE_VIEW and CODE_VIEW is active tab
      const curCode = tCode || code;
      if (!curCode) return;
      // prepare tableview data (code view json to array)
      const parsedCode = isObject(curCode) ? curCode : JSON.parse(curCode);
      // setLoading(true);
      const tempArray = [];
      const tempDependency = [];
      const newCustomSetting = isMount ? tCustomSetting : customSetting;

      if (curCode !== '{}') {
        Object.keys(parsedCode).map((c, index) => {
          let x = parsedCode[c];
          const obj = {};
          if (!x || isEmpty(x)) return c; // return if null or undefined or empty array/object
          if (dbType === DB_TYPE.MONGODB && x?.type === TABLE_TYPES.ARRAY) {
            // default value false of__id
            let tempSub = {};
            if (!isExcludeArrayId) { tempSub = extend(tempSub, { _id: { default: 'false', type: '_id' } }); }
            x = [tempSub];
          }

          let isSubAttr = false;
          if (dbType === DB_TYPE.MONGODB && typeof x === 'object' && Array.isArray(x)) {
            isSubAttr = true;
          } else if (dbType === DB_TYPE.MONGODB && typeof x === 'object' && Object.keys(x)?.length > 0) {
            // type object
            if (Object.values(x).some((v) => typeof v === 'object' && v)) {
              // if any value has type object
              isSubAttr = true;
            } else {
              // eslint-disable-next-line no-lonely-if
              if (Object.keys(x).includes('type') && parsedKeys(x, dbType)?.isSub) {
                isSubAttr = true;
              } else {
                isSubAttr = false;
              }
            }
          }

          if (isSubAttr) {
            // sub-rows  ex:- if condition x=[{e:{}}] || x={e:{}}
            const tempSubRows = [];
            obj.type = Array.isArray(x) ? TABLE_TYPES.ARRAY : TABLE_TYPES.JSON;
            obj.attr = c;
            obj.key = `r${index}`;
            if (x.description)obj.description = x.description;
            let tempSub = Array.isArray(x) ? x[0] : x;
            if (dbType === DB_TYPE.MONGODB && Array.isArray(x)) {
              // default value false of__id
              if (!isExcludeArrayId) {
                tempSub = extend(tempSub,
                  {
                    _id: {
                      default: typeof tempSub._id === 'boolean' ? tempSub._id.toString() : 'false',
                      type: '_id',
                    },
                  });
              }
            } else if (dbType === DB_TYPE.MONGODB && !Array.isArray(x)) {
              // default value false of__id (if obj then filter _id)
              delete tempSub._id;
            }
            tempDependency.push({
              oldKey: c,
              newKey: '',
              parentKey: '',
            });
            Object.keys(tempSub).map((y, yi) => {
              let sr = tempSub[y];
              if (!sr || isEmpty(sr)) return y; // return if null or undefined or empty array/object
              if (typeof sr === 'string') {
                sr = {};
                sr.type = tempSub[y];
              }
              sr.attr = y;
              sr.key = `rs${yi}`;
              sr.rowKey = obj.key;
              if (sr.attr !== '_id') { tempSubRows.push(prepareTableObj(sr, obj, { newCustomSetting }, customModelList)); } else {
                tempSubRows.push(sr);
              }
              tempDependency.push({
                oldKey: y,
                newKey: '',
                parentKey: c,
              });
              return y;
            });
            obj.subRows = tempSubRows;

            tempArray.push(obj);
          } else {
            // main row
            if (typeof x === 'string') {
              x = {};
              x.type = parsedCode[c];
            }
            x.attr = c;
            x.key = `r${index}`;
            tempArray.push(prepareTableObj(x, undefined, { newCustomSetting }, customModelList));
            tempDependency.push({
              oldKey: c,
              newKey: '',
              parentKey: '',
            });
          }
          return c;
        });
      }
      setDependency(tempDependency);
      // setTableJson(tempArray);
      if (isReturnTempArray) {
        // eslint-disable-next-line consistent-return
        return tempArray;
      }
      handleAddRow(tempArray, isAutoFocus);
    } catch (e) {
      // console.log(e);
    }
  }, [code, activeTab, customSetting, modelList, dbType]);

  React.useMemo(() => {
    // do not set tablejson here
    const tempJson = currentModel?.schemaJson || {};
    setCode(JSON.stringify(tempJson));
  }, [currentModel?._id]);

  React.useMemo(() => {
    // do not set tablejson here
    const tempJson = currentModel?.schemaJson || {};
    // setCode(JSON.stringify(tempJson));
    prepareTableView({
      isMount: true, isAutoFocus: true, tCode: JSON.stringify(tempJson), tCustomSetting: currentModel?.customJson?.additionalSetting,
    });
  }, [currentModel?.schemaJson]);

  function prepareCodeObj(params, customModelList = []) {
    let obj = { ...params };
    if ([TABLE_TYPES.BOOL, '_id'].includes(obj.type) && obj.default !== undefined && obj.default !== null) obj.default = obj.default === 'true';
    else if (obj.filter === 'AS_DEFINED' || (dbType !== DB_TYPE.MONGODB && isNumberType(obj.type, TABLE_TYPES))) {
      obj.default = obj.default ?? undefined;
      // if (obj.type === TABLE_TYPES.NUMBER) obj.default = obj.default ? parseInt(obj.default) : undefined;
      // else obj.default = obj.default || undefined;
    } else if (obj.filter === 'NULL') {
      obj.default = null;
    } else obj.default = undefined;

    if (obj.ref) {
      if (isEmpty(customModelList)) {
        obj.ref = modelList.find((m) => m._id === obj.ref)?.name;
      } else {
        // if already in current model with name exits with different case that time in ref name changes
        const customModelName = customModelList.find((m) => m._id === obj.ref)?.name;
        const createdModelName = modelList.find((m) => m.name.toLowerCase() === customModelName.toLowerCase())?.name;
        obj.ref = createdModelName ?? customModelName;
      }
      delete obj.refName;
    }

    if (obj.type === TABLE_TYPES.VIRTUAL_RELATION && !obj.localField) {
      obj.localField = '_id';
    }

    obj = {
      ...obj,
      minLength: obj.minLength ? parseInt(obj.minLength) : undefined,
      maxLength: obj.maxLength ? parseInt(obj.maxLength) : undefined,
      min: obj.min ? parseInt(obj.min) : undefined,
      max: obj.max ? parseInt(obj.max) : undefined,
    };

    if (obj.type) {
      // data type validation
      const disable = getDisableField(obj.type, { isAutoIncrement: obj.isAutoIncrement }, dbType, {
        currentApplicationCode,
      });
      Object.keys(obj).map((k) => {
        if (disable[k] && (obj?.attr !== '_id' && obj.attr !== 'id')) { // to not remove disabled fields' value if attribute is '_id' or 'id'
          delete obj[k];
        }
        return k;
      });
    }

    obj = omit(obj, ['isExpand', 'key', 'filter', 'attr', 'rowKey']);

    if (dbType !== DB_TYPE.MONGODB) {
      // for sequelize
      if (obj.type === TABLE_TYPES.DATE && dbType === DB_TYPE.POSTRAGSQL && obj.default) {
      // convert DATE to TIMESTAMP for POSTRAGSQL DB
        obj.default = getUnixTimestamp(obj.default);
      } else if ((dbType === DB_TYPE.MYSQL || dbType === DB_TYPE.SQL) && (obj.type === TABLE_TYPES.DATE || obj.type === TABLE_TYPES.TIMESTAMP) && obj.default) {
        obj.default = dateTimeFormatter(obj.default, dateTimeFormat);
      } else if ((obj.type === TABLE_TYPES.DATEONLY) && obj.default) {
        obj.default = dateTimeFormatter(obj.default, dateFormat);
      }
      obj.relType = obj.ref ? obj.relType : undefined;
    } else if (dbType === DB_TYPE.MONGODB && obj.type === TABLE_TYPES.DATE && obj.default) {
      // mongoose store in ISO format
      obj.default = setDateToISO(obj.default);
    }

    // remove extra attribute from json
    obj = getParsedKeys(obj, dbType);
    obj.match = obj.match || undefined;
    return filterObjectUndefinedValues(obj);
  }

  const tableToCodeViewParser = React.useCallback((options = {}) => {
    // convert array to object
    if (activeTab !== SCHEMA_TAB.TABLE_VIEW) return; // parser need only when TABLE_VIEW is active tab

    const newTable = options?.tableArr ? cloneDeep(options?.tableArr) : cloneDeep(tableJson);
    if (newTable?.length <= 0) return;
    const parsedObj = {};
    const tempSetting = {};

    newTable.forEach((x) => {
      const tempSubSetting = {};
      const obj = { ...x };
      if (!obj.attr) return; // attribute is required
      if (dbType === DB_TYPE.MONGODB && (obj.type === TABLE_TYPES.JSON || obj.type === TABLE_TYPES.ARRAY)) {
        // manage sub-rows
        const tempArray = [];
        const tempObj = {};

        if (dbType === DB_TYPE.MONGODB && obj?.type === TABLE_TYPES.ARRAY) {
          // eslint-disable-next-line no-debugger
          if (!options?.isExcludeArrayId && !obj.subRows?.find((s) => s.type === '_id')) { // default value false of__id for type array only
            let idArr = [];
            // exclude _id if no sub-attr
            idArr = [{
              key: `rs${obj.subRows?.length ? obj.subRows.length - 1 : 0}`, attr: '_id', default: 'false', type: '_id', rowKey: obj.key,
            }];
            obj.subRows = extend(obj.subRows || [], idArr);
          // eslint-disable-next-line no-prototype-builtins
          } else if (options?.isExcludeArrayId && obj.subRows?.length === 1 && obj.subRows[0].hasOwnProperty('_id')) {
            delete obj.subRows;
          } else if (options?.isExcludeArrayId && obj.subRows?.length > 0) {
            obj.subRows.push({ _id: false });
            tempObj._id = false;
          }
        }

        obj.subRows?.forEach((rs) => {
          if (!rs.attr) return; // attribute is required
          tempObj[rs.attr] = prepareCodeObj(rs, options?.customModelList);
          if (tempObj[rs.attr]?.enum && tempObj[rs.attr]?.isEnum) {
            // add if isenum is selected
            tempSubSetting[rs.attr] = { enum: tempObj[rs.attr]?.enum, isEnum: true };
          } else if (!tempObj?.[rs.attr]?.isEnum && tempSubSetting?.[rs.attr]?.enum) {
            // remove if isenum is de-selected
            delete tempSubSetting[rs.attr];
          }
          delete tempObj[rs.attr]?.enum;
          delete tempObj[rs.attr]?.isEnum;

          // Mark attribute as private
          // if (tempObj[rs.attr]?.private) {
          // // prepare obj
          //   tempSubSetting[rs.attr] = extend(tempSubSetting[rs.attr], { private: true });
          // } else if (tempSubSetting[rs.attr]?.private && !tempObj[rs.attr]?.private) {
          // // remove from obj
          //   delete tempSubSetting[rs.attr].private;
          // }
        });
        if (obj.subRows?.length > 0 && !isEmpty(tempObj)) {
          tempArray.push(tempObj);
          parsedObj[x.attr] = obj.type === TABLE_TYPES.JSON ? tempObj : tempArray;
          tempSetting[x.attr] = tempSubSetting; // GEN team are not managing array enum
          // tempSetting[x.attr] = obj.type === TABLE_TYPES.JSON ? tempSubSetting : [tempSubSetting];
        } else parsedObj[x.attr] = { type: obj.type };
      } else {
        delete obj.subRows;
        parsedObj[x.attr] = prepareCodeObj(obj, options?.customModelList);
        if (parsedObj[x.attr].enum && parsedObj[x.attr].isEnum) {
          // add if isenum is selected
          tempSetting[x.attr] = extend(tempSetting[x.attr] || {}, { enum: parsedObj[x.attr].enum, isEnum: true });
        } else if (!parsedObj[x.attr].isEnum) {
          // remove if isenum is de-selected
          delete tempSetting[x.attr]?.enum;
          delete tempSetting[x.attr]?.isEnum;
        }
        delete parsedObj[x.attr].enum;
        delete parsedObj[x.attr].isEnum;

        // Mark attribute as private
        // if (parsedObj[x.attr]?.private === true) {
        //   // prepare obj
        //   tempSetting[x.attr] = extend(tempSetting[x.attr], { private: true });
        // } else if (tempSetting[x.attr]?.private === true && !parsedObj[x.attr]?.private) {
        //   // remove from obj
        //   delete tempSetting[x.attr].private;
        // }
      }
    });
    // set state only when unequal
    if (!isEqual(code, JSON.stringify(parsedObj))) {
      // eslint-disable-next-line consistent-return
      if (options?.isReturnJson) return parsedObj;
      setCode(JSON.stringify(parsedObj));
    }
    // if (!isEqual(customSetting, tempSetting)) { commented because not getting updated customSetting
    setCustomSetting(tempSetting);
    // }
    if (options?.isSave) {
      requestAnimationFrame(() => {
        saveJSON({
          tDependency: options.tDependency, loaderCallBack: options.loaderCallBack, msg: options.msg, showMsg: true, tCode: JSON.stringify(parsedObj), tcustomSetting: tempSetting, indexes: options.indexes,
        });
      });
    }
  }, [modelList, tableJson, activeTab, saveJSON, customSetting, dbType, code]);

  React.useMemo(() => {
    prepareTableView({});
  }, [code]);

  React.useMemo(() => {
    if (!dbType) return;
    tableToCodeViewParser();
  }, [tableJson, dbType]);

  const handleTabSelect = React.useCallback((next, cur) => {
    setMainActiveTab(next);
    if (next === cur) return;
    if (cur === TABS.SCHEMA_TAB && activeTab === SCHEMA_TAB.TABLE_VIEW) {
      // tableToCodeViewParser();
    }
  }, [activeTab, tableToCodeViewParser]);

  const value = {
    code,
    setCode,
    tableJson,
    setTableJson,
    tableToCodeViewParser, // table to code view parser
    prepareTableView, // code to table view parser
    activeTab,
    setActiveTab,
    customSetting,
    setCustomSetting,
    modelList,
    currentId,
    currentModel,
    hooks,
    setHooks,
    listRef,
    handleTabSelect,
    saveJSON,
    handleAddRow,
    mainActiveTab,
    TABLE_TYPES,
    dbType,
    ormType,
    setDependency,
    dependency,
    currentApplicationCode,
  };
  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
});

function useEditor() {
  const context = React.useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within a EditorProvider');
  }
  return context;
}
EditorProvider.displayName = 'EditorProvider';
export { EditorProvider, useEditor };
