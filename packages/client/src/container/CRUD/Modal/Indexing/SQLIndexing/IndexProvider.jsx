/* eslint-disable no-param-reassign */
import React from 'react';
import { cloneDeep } from 'lodash';
import update from 'immutability-helper';
import { useSelector } from 'react-redux';
import { useBoolean } from '../../../../../components/hooks';
import {
  SQL_INDEX, getFieldPosition, getSubFieldPosition, MONGO_INDEX,
} from '../../../../../constant/modelIndexing';
import { DB_CONST, DB_TYPE } from '../../../../../constant/model';

export const IndexContext = React.createContext();

export const MODEL_INDEX_ACTION_TYPES = {
  FETCH_LIST: 'FETCH_LIST',
  EDIT_DATA: 'EDIT_DATA',
  SET_LIST: 'SET_LIST',
  MOVE_ROW: 'MOVE_ROW',
  MOVE_SUB_ROW: 'MOVE_SUB_ROW',
  ADD_ROW: 'ADD_ROW',
  ADD_SUB_ROW: 'ADD_SUB_ROW',
  EXPAND: 'EXPAND',
};

function modelIndexReducer(state, { type, payload = {} }) {
  switch (type) {
    case MODEL_INDEX_ACTION_TYPES.FETCH_LIST: {
      // to fetch model index list
      return { ...state, modelIndexList: payload };
    }
    case MODEL_INDEX_ACTION_TYPES.SET_LIST: {
      // to fetch model index list
      // eslint-disable-next-line no-param-reassign
      // state.modelIndexList = payload;
      // return state;
      return { ...state, modelIndexList: payload };
    }
    case MODEL_INDEX_ACTION_TYPES.EDIT_DATA: {
      // to edit model index data
      const modelIndexList = state?.modelIndexList?.map((modelIndex) => {
        if (modelIndex?.name === payload?.prevName) {
          // eslint-disable-next-line no-param-reassign
          delete payload?.prevName;
          return payload;
        }
        return modelIndex;
      });
      return { ...state, modelIndexList };
    }
    case MODEL_INDEX_ACTION_TYPES.MOVE_ROW: {
      // to fetch model index list
      const { dragIndex, hoverIndex } = payload;
      const dragRecord = state.modelIndexList[dragIndex];
      const recs = update(state.modelIndexList, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRecord],
        ],
      });
      return { ...state, modelIndexList: recs };
    }
    case MODEL_INDEX_ACTION_TYPES.MOVE_SUB_ROW: {
      // to fetch model index list
      const { dragIndex, hoverIndex, mainRow } = payload;
      const newData = cloneDeep(state.modelIndexList);
      const newFields = newData[mainRow.index]?.indexFields;
      const dragRecord = newFields?.[dragIndex];
      newData[mainRow.index].indexFields = update(newFields, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRecord],
        ],
      });
      return { ...state, modelIndexList: newData };
    }
    case MODEL_INDEX_ACTION_TYPES.ADD_ROW: {
      // add new row
      return { ...state, modelIndexList: state?.onAddRow({ indexList: state.modelIndexList }) };
    }
    case MODEL_INDEX_ACTION_TYPES.ADD_SUB_ROW: {
      // add new row
      return { ...state, modelIndexList: state?.onAddRow({ indexList: state.modelIndexList, mainRow: payload?.mainRow }) };
    }
    case MODEL_INDEX_ACTION_TYPES.EXPAND: {
      // add new row
      const newData = cloneDeep(state.modelIndexList);
      newData[payload.row.index].isExpanded = !payload.row.original.isExpanded;
      return { ...state, modelIndexList: newData };
    }
    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
}
const DEFAULT = {
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
  MONGO_ROW_OBJ: {
    isExpanded: false,
    name: '',
    ttl: '',
    expireAfterSeconds: '',
    indexFields: [],
  },
  MONGO_SUB_OBJ: {
    attribute: '',
    indexType: '',
  },
};
const IndexProvider = ({ children }) => {
  const currentId = useSelector((state) => state.models.currentId);
  const modelList = useSelector((state) => state.models.modelList) || [];
  const currentModel = React.useMemo(() => modelList.find((model) => model._id === currentId), [currentId, modelList]);
  const dbType = useSelector((state) => DB_CONST[state.projects.applicationDatabase.databaseType]);

  const handleAddRow = ({ indexList, mainRow }) => {
    // indexList: indexFields, indexFields:subrow, mainRow: main table row
    const newData = cloneDeep(indexList) || [];
    if (mainRow) {
      // sub-row
      if (dbType === DB_TYPE.MONGODB) {
        // mongo
        newData[mainRow.index]?.indexFields?.push(DEFAULT.MONGO_SUB_OBJ);
      } else if (mainRow?.indexType === SQL_INDEX.TYPE.BTREE || mainRow?.indexType === SQL_INDEX.TYPE.PARTIAL
        || mainRow?.original?.indexType === SQL_INDEX.TYPE.BTREE || mainRow?.original?.indexType === SQL_INDEX.TYPE.PARTIAL) {
        // sql
        newData[mainRow.index]?.indexFields?.push(DEFAULT.SUB_OBJ);
      }
    } else {
      const obj = cloneDeep(DEFAULT.MONGO_ROW_OBJ);
      if (obj.indexFields?.length <= 0) {
        obj.indexFields.push(DEFAULT.MONGO_SUB_OBJ);
      }
      newData.push(dbType === DB_TYPE.MONGODB ? obj : DEFAULT.ROW_OBJ);
    }
    return newData;
  };

  const [stateData, dispatch] = React.useReducer(modelIndexReducer, {
    modelIndexList: [],
    onAddRow: handleAddRow,
  });
  const [modelIndexLoader, showModelIndexLoader, hideModelIndexLoader] = useBoolean(false);

  const prepareData = () => {
    if (currentModel?.modelIndexes?.length > 0) {
      let temp = cloneDeep(currentModel.modelIndexes);

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
          obj.indexFields = (tempFields?.length >= MONGO_INDEX.MAX_SUB_ROWS_ALLOWED) ? tempFields : tempFields.concat([DEFAULT.MONGO_SUB_OBJ]);
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
              x.indexFields = x.indexFields.concat([DEFAULT.SUB_OBJ]);
            }
          } else if (x.indexType === SQL_INDEX.TYPE.GIN) {
            x.indexFields = [{ operator: x.operator, isExist: true }];
          } else if (x.indexType && x.indexType !== SQL_INDEX.TYPE.UNIQUE) x.indexFields = [DEFAULT.SUB_OBJ];
          return { ...x, isExist: true, isExpanded: false };
        });
      }

      temp = temp.concat(handleAddRow({}));
      dispatch({ type: MODEL_INDEX_ACTION_TYPES.FETCH_LIST, payload: cloneDeep(temp) });
    } else { dispatch({ type: MODEL_INDEX_ACTION_TYPES.FETCH_LIST, payload: handleAddRow({}) }); }
  };

  React.useMemo(() => {
    if (dbType && currentModel?.modelIndexes) { prepareData(); }
  }, [currentModel?.modelIndexes, dbType]);

  // common function for both indexing
  const handleRowToSubFocus = ({
    focusField, prevRow, prevIndex, downIndex, downRow, mainRow, index, ...opt
  }) => {
    // handle row to subrow focus
    if (opt?.isDown) {
      const subField = getSubFieldPosition(0, dbType); // 1st sub row
      const focusIndex = subField.FiledPosition[focusField];
      for (let nextIndex = 0; nextIndex <= downRow.indexFields?.length; nextIndex += 1) {
        const field = document.querySelector(`#srcell${downIndex}${focusIndex - nextIndex} ${focusField === 'attribute' ? '[tabindex="0"]' : ''}`);
        if (field && !field?.hasAttribute?.('disabled')) {
          field?.focus();
          break;
        }
      }
    } else if (opt?.isUp) {
      const subField = getSubFieldPosition(prevRow?.indexFields?.length - 1, dbType);// last sub row
      const focusIndex = subField.FiledPosition[focusField];
      const field = document.querySelector(`#srcell${prevIndex}${focusIndex} ${focusField === 'attribute' ? '[tabindex="0"]' : ''}`);
      if (field && !field?.hasAttribute?.('disabled')) {
        field?.focus();
      }
    } else if (opt?.isPrev) {
      const { FiledPosition } = getSubFieldPosition(downRow?.indexFields?.length - 1, dbType);// last sub row
      const field = document.querySelector(`#srcell${downIndex}${FiledPosition[focusField]}`);
      if (field && !field?.hasAttribute?.('disabled')) {
        field?.focus();
      }
    } else if (opt?.isNext) {
      // next row=>sub
      const field = document.querySelector(`#srcell${index}${SQL_INDEX.SUB_FIELD_SEQ.attribute} [tabindex="0"]`);
      field?.focus();
    }
  };

  // common function for both indexing
  const handleSubToRowFocus = ({
    focusField, prevRow, prevIndex, downIndex, downRow, index, mainRow, ...opt
  }) => {
    // handle subrow to row focus
    if (opt?.isPrev) {
      const { FiledPosition } = getFieldPosition(mainRow?.index, null, dbType);// last sub row
      const field = document.querySelector(`#rcell${FiledPosition[focusField]} ${focusField === 'fields' ? '[tabindex="0"]' : ''}`);
      if (field && !field?.hasAttribute?.('disabled')) {
        field?.focus();
      }
    } else if (opt?.isNext) {
      // next sub=>row
      const { FiledPosition } = getFieldPosition(mainRow.index + 1, null, dbType);// next row
      const field = document.querySelector(`#rcell${FiledPosition.name}`);
      field?.focus();
    } else if (opt?.isDown) {
      // next sub=>row
      const { FiledPosition } = getFieldPosition(mainRow.index + 1, null, dbType);// next row
      const field = document.querySelector(`#rcell${FiledPosition[focusField]} ${focusField === 'fields' ? '[tabindex="0"]' : ''}`);
      field?.focus();
    } else if (opt?.isUp) {
      // next sub=>row
      const { FiledPosition } = getFieldPosition(mainRow.index, null, dbType);// same row
      const field = document.querySelector(`#rcell${FiledPosition[focusField]} ${focusField === 'fields' ? '[tabindex="0"]' : ''}`);
      field?.focus();
    }
  };

  const handleMongoKeyDown = (e, focusField, {
    index, idPrefix, mainRow, lengthOfData, dataArray, FiledPosition, focusIndex,
  }) => {
    // handle keyboard shortcuts for mongo indexing
    switch (e.keyCode) {
      case 38:
      { // up
        let isFocused = false;
        if (dataArray[index - 1]?.isExpanded) {
        // row => subrow
          for (let nextIndex = index - 1; nextIndex >= 0; nextIndex -= 1) {
            if (dataArray[nextIndex]?.isExpanded) {
            // row => subrow
              isFocused = true;
              handleRowToSubFocus({
                isUp: true, focusField: 'attribute', prevRow: dataArray[nextIndex], prevIndex: nextIndex, mainRow,
              });
              break;
            }
          }
        }
        if (!isFocused) {
          for (let nextIndex = MONGO_INDEX.TOTAL_FIELDS; nextIndex < lengthOfData * MONGO_INDEX.TOTAL_FIELDS; nextIndex += MONGO_INDEX.TOTAL_FIELDS) {
            let isTabIndex = false;
            if ([FiledPosition.attribute].includes(focusIndex - nextIndex)) isTabIndex = true;
            let query = `#${idPrefix}${focusIndex - nextIndex}  ${isTabIndex ? '[tabindex="0"]' : ''}`;
            if (mainRow) { query = `#${idPrefix}${focusIndex - MONGO_INDEX.SUB_TOTAL_FIELDS}  ${focusField === 'attribute' ? '[tabindex="0"]' : ''}`; }
            const field = document.querySelector(query);
            if (field && !field?.hasAttribute?.('disabled')) {
              field?.focus();
              break;
            } else if (mainRow?.original?.indexFields?.length - 1 === mainRow?.index && mainRow?.original?.isExpanded) {
            // sub=>row
              handleSubToRowFocus({ isUp: true, mainRow, focusField: 'name' });
            }
          }
        }
        break; }
      case 40:
      { // down
        let isFocused = false;
        if (dataArray[index]?.isExpanded) {
        // row => subrow
          const nextIndex = index;
          if (dataArray[nextIndex]?.isExpanded) {
            isFocused = true;
            handleRowToSubFocus({
              isDown: true, focusField: 'attribute', downIndex: nextIndex, downRow: dataArray[nextIndex], mainRow,
            });
            break;
          }
        // }
        }
        if (!isFocused) {
          for (let nextIndex = MONGO_INDEX.TOTAL_FIELDS; nextIndex < lengthOfData * MONGO_INDEX.TOTAL_FIELDS; nextIndex += MONGO_INDEX.TOTAL_FIELDS) {
            let query = `#${idPrefix}${focusIndex + nextIndex} ${focusField === 'attribute' ? '[tabindex="0"]' : ''}`;
            if (mainRow) { query = `#${idPrefix}${FiledPosition[focusField] + MONGO_INDEX.SUB_TOTAL_FIELDS} ${focusField === 'attribute' ? '[tabindex="0"]' : ''}`; }
            const field = document.querySelector(query);
            if (field && !field?.hasAttribute?.('disabled')) {
              isFocused = true;
              field?.focus();
              break;
            } else if (mainRow?.original?.indexFields?.length - 1 === index) {
            // sub=>row
              handleSubToRowFocus({ isDown: true, mainRow, focusField: 'name' });
            }
            if (isFocused) break;
          }
        }
        break; }
      case 37:
      { // left
        if (e.ctrlKey) {
          let isFocused = false;
          if (!mainRow && dataArray[index - 1]?.isExpanded && focusField === 'name') {
          // row => subrow
            isFocused = true;
            handleRowToSubFocus({
              isPrev: true, focusField: 'type', downIndex: index - 1, downRow: dataArray[index - 1], mainRow,
            });
            break;
          } else {
            for (let nextIndex = 1; nextIndex !== lengthOfData * MONGO_INDEX.TOTAL_FIELDS; nextIndex += 1) {
              const field = document.querySelector(`#${idPrefix}${focusIndex - nextIndex}  ${focusField === 'type' ? '[tabindex="0"]' : ''}`);
              if (field && !field?.hasAttribute?.('disabled')) {
                field?.focus();
                isFocused = true;
                break;
              } else if (!isFocused && mainRow && index === 0 && focusField === 'attribute') {
              // sub=>row
                handleSubToRowFocus({ isPrev: true, mainRow, focusField: 'unique' });
              }
            }
          }
        }
        break; }
      case 39:
      {
        // right
        if (e.ctrlKey) {
          if (dataArray[index].isExpanded && focusField === 'unique') {
          // row => subrow
            handleRowToSubFocus({ isNext: true, index });
          } else {
            for (let nextIndex = 1; nextIndex !== lengthOfData * MONGO_INDEX.TOTAL_FIELDS; nextIndex += 1) {
              let isTabIndex = false;
              // (sub) => sub;
              if (MONGO_INDEX.SUB_TOTAL_FIELDS * FiledPosition.attribute === focusIndex) isTabIndex = true;
              const query = `#${idPrefix}${focusIndex + nextIndex}  ${isTabIndex ? '[tabindex="0"]' : ''}`;
              const field = document.querySelector(query);
              if (field && !field?.hasAttribute?.('disabled')) {
                field?.focus();
                break;
              } else if ((focusField === 'type') && mainRow?.original?.indexFields?.length - 1 === index) {
              // sub=>row
                handleSubToRowFocus({ isNext: true, mainRow });
              }
            }
          }
        }
        break; }
      case 13:
      {
        // enter => same as next
        if (dataArray[index].isExpanded && focusField === 'unique') {
          // row => subrow
          handleRowToSubFocus({ isNext: true, index });
        } else {
          for (let nextIndex = 1; nextIndex !== lengthOfData * MONGO_INDEX.TOTAL_FIELDS; nextIndex += 1) {
            let isTabIndex = false;
            // (sub) => sub;
            if (MONGO_INDEX.SUB_TOTAL_FIELDS * FiledPosition.attribute === focusIndex) isTabIndex = true;
            const query = `#${idPrefix}${focusIndex + nextIndex}  ${isTabIndex ? '[tabindex="0"]' : ''}`;
            const field = document.querySelector(query);
            if (field && !field?.hasAttribute?.('disabled')) {
              field?.focus();
              break;
            } else if ((focusField === 'type') && mainRow?.original?.indexFields?.length - 1 === index) {
              // sub=>row
              handleSubToRowFocus({ isNext: true, mainRow });
            }
          }
        }
        break; }

      default:
        break;
    }
  };

  const onKeyDownHandle = (e, focusField, { index, idPrefix, mainRow }) => {
    const { FiledPosition } = getFieldPosition(index, !!mainRow, dbType);
    const dataArray = mainRow?.original?.indexFields?.length > 0 ? mainRow.original.indexFields : stateData.modelIndexList;
    const lengthOfData = dataArray.length;
    const focusIndex = FiledPosition[focusField];
    if (dbType === DB_TYPE.MONGODB) {
      // manage keydown handle for mongo db
      handleMongoKeyDown(e, focusField, {
        index, idPrefix, mainRow, lengthOfData, dataArray, FiledPosition, focusIndex,
      });
    } else {
      switch (e.keyCode) {
        case 38:
        { // up
          let isFocused = false;
          if (dataArray[index - 1]?.isExpanded) {
          // row => subrow
            for (let nextIndex = index - 1; nextIndex >= 0; nextIndex -= 1) {
              if (dataArray[nextIndex]?.isExpanded) {
              // row => subrow
                isFocused = true;
                let tempFocusField = '';
                if (focusField === 'name') tempFocusField = 'attribute';
                else if (focusField === 'indexType') tempFocusField = SQL_INDEX.TYPE.BTREE === dataArray[nextIndex].indexType ? 'order' : 'operator';
                else if (focusField === 'name') tempFocusField = SQL_INDEX.TYPE.BTREE === dataArray[nextIndex].indexType ? 'length' : 'value';
                handleRowToSubFocus({
                  isUp: true, focusField: tempFocusField, prevRow: dataArray[nextIndex], prevIndex: nextIndex, mainRow,
                });
                break;
              }
            }
          }
          if (!isFocused) {
            for (let nextIndex = SQL_INDEX.TOTAL_FIELDS; nextIndex < lengthOfData * SQL_INDEX.TOTAL_FIELDS; nextIndex += SQL_INDEX.TOTAL_FIELDS) {
              let isTabIndex = focusField === 'fields' || false;
              if ([FiledPosition.fields, FiledPosition.attribute].includes(focusIndex - nextIndex)) isTabIndex = true;
              let query = `#${idPrefix}${focusIndex - nextIndex}  ${isTabIndex ? '[tabindex="0"]' : ''}`;
              if (mainRow) { query = `#${idPrefix}${focusIndex - SQL_INDEX.SUB_TOTAL_FIELDS}  ${focusField === 'attribute' ? '[tabindex="0"]' : ''}`; }
              const field = document.querySelector(query);
              if (field && !field?.hasAttribute?.('disabled')) {
                field?.focus();
                break;
              } else if (mainRow?.original?.indexFields?.length - 1 === mainRow?.index && mainRow?.original?.isExpanded) {
              // sub=>row
                let tempFocusField = '';
                if (focusField === 'attribute') tempFocusField = 'name';
                else if (focusField === 'order' || focusField === 'operator') tempFocusField = 'indexType';
                else if (focusField === 'length' || focusField === 'value') tempFocusField = 'fields';
                handleSubToRowFocus({ isUp: true, mainRow, focusField: tempFocusField });
              }
            }
          }
          break; }
        case 40:
        { // down
          let isFocused = false;
          if (dataArray[index]?.isExpanded) {
          // row => subrow
            const nextIndex = index;
            // for (let nextIndex = index; nextIndex <= lengthOfData; nextIndex += 1) {
            if (dataArray[nextIndex]?.isExpanded) {
              isFocused = true;
              let tempFocusField = '';
              if (focusField === 'name') tempFocusField = 'attribute';
              else if (focusField === 'indexType') tempFocusField = SQL_INDEX.TYPE.BTREE === dataArray[nextIndex].indexType ? 'order' : 'operator';
              else if (focusField === 'fields') tempFocusField = SQL_INDEX.TYPE.BTREE === dataArray[nextIndex].indexType ? 'length' : 'value';
              handleRowToSubFocus({
                isDown: true, focusField: tempFocusField, downIndex: nextIndex, downRow: dataArray[nextIndex], mainRow,
              });
              break;
            }
          // }
          }
          if (!isFocused) {
            for (let nextIndex = SQL_INDEX.TOTAL_FIELDS; nextIndex < lengthOfData * SQL_INDEX.TOTAL_FIELDS; nextIndex += SQL_INDEX.TOTAL_FIELDS) {
              let isTabIndex = false;
              if ([FiledPosition.fields, FiledPosition.attribute].includes(focusIndex + nextIndex)) isTabIndex = true;
              let query = `#${idPrefix}${focusIndex + nextIndex} ${isTabIndex || focusField === 'fields' ? '[tabindex="0"]' : ''}`;
              if (mainRow) { query = `#${idPrefix}${FiledPosition[focusField] + SQL_INDEX.SUB_TOTAL_FIELDS} ${isTabIndex || focusField === 'attribute' ? '[tabindex="0"]' : ''}`; }
              const field = document.querySelector(query);
              if (field && !field?.hasAttribute?.('disabled')) {
                isFocused = true;
                field?.focus();
                break;
              } else if (mainRow?.original?.indexFields?.length - 1 === index) {
              // sub=>row
                let tempFocusField = '';
                if (focusField === 'attribute') tempFocusField = 'name';
                else if (focusField === 'order' || focusField === 'operator') tempFocusField = 'indexType';
                else if (focusField === 'length' || focusField === 'value') tempFocusField = 'fields';
                handleSubToRowFocus({ isDown: true, mainRow, focusField: tempFocusField });
              }
              if (isFocused) break;
            }
          }
          break; }
        case 37:
        { // left
          if (e.ctrlKey) {
            let isFocused = false;
            if (!mainRow && dataArray[index - 1]?.isExpanded && focusField === 'name') {
            // row => subrow
              isFocused = true;
              const tempFocusField = dataArray[index - 1].indexType === SQL_INDEX.TYPE.BTREE ? 'length' : 'value';
              handleRowToSubFocus({
                isPrev: true, focusField: tempFocusField, downIndex: index - 1, downRow: dataArray[index - 1], mainRow,
              });
              break;
            } else {
              for (let nextIndex = 1; nextIndex !== lengthOfData * SQL_INDEX.TOTAL_FIELDS; nextIndex += 1) {
                let isTabIndex = false;
                if (([SQL_INDEX.TYPE.BTREE, SQL_INDEX.TYPE.PARTIAL].includes(dataArray[index].indexType)
              || [SQL_INDEX.TYPE.BTREE, SQL_INDEX.TYPE.PARTIAL].includes(mainRow?.original?.indexType))
              && (focusField === 'operator' || focusField === 'order' || focusField === 'name')) isTabIndex = true;
                const field = document.querySelector(`#${idPrefix}${focusIndex - nextIndex}  ${isTabIndex ? '[tabindex="0"]' : ''}`);
                if (field && !field?.hasAttribute?.('disabled')) {
                  field?.focus();
                  isFocused = true;
                  break;
                } else if (!isFocused && mainRow && index === 0 && focusField === 'attribute') {
                // sub=>row
                  const tempFocusField = mainRow?.original?.indexType === SQL_INDEX.TYPE.BTREE ? 'indexType' : 'fields';
                  handleSubToRowFocus({ isPrev: true, mainRow, focusField: tempFocusField });
                }
              }
            }
          }
          break; }
        case 39:
        {
        // right
          if (e.ctrlKey) {
            if (dataArray[index].isExpanded && (
              (focusField === 'indexType' && dataArray[index].indexType === SQL_INDEX.TYPE.BTREE)
          || (focusField === 'fields'
           && [SQL_INDEX.TYPE.UNIQUE, SQL_INDEX.TYPE.PARTIAL, SQL_INDEX.TYPE.GIN].includes(dataArray[index].indexType)))
            ) {
            // row => subrow
              handleRowToSubFocus({ isNext: true, index });
            } else {
              for (let nextIndex = 1; nextIndex !== lengthOfData * SQL_INDEX.TOTAL_FIELDS; nextIndex += 1) {
                let isTabIndex = false;
                if ([FiledPosition.fields, FiledPosition.attribute].includes(focusIndex + nextIndex)) isTabIndex = true;
                // (sub) => sub;
                if (SQL_INDEX.SUB_TOTAL_FIELDS * FiledPosition.attribute === focusIndex) isTabIndex = true;
                const query = `#${idPrefix}${focusIndex + nextIndex}  ${isTabIndex ? '[tabindex="0"]' : ''}`;
                const field = document.querySelector(query);
                if (field && !field?.hasAttribute?.('disabled')) {
                  field?.focus();
                  break;
                } else if ((focusField === 'value' || focusField === 'length') && mainRow?.original?.indexFields?.length - 1 === index) {
                // sub=>row
                  handleSubToRowFocus({ isNext: true, mainRow });
                }
              }
            }
          }
          break; }
        case 13:
        {
        // enter same as Next
          if (dataArray[index].isExpanded && (
            (focusField === 'indexType' && dataArray[index].indexType === SQL_INDEX.TYPE.BTREE)
        || (focusField === 'fields'
         && [SQL_INDEX.TYPE.UNIQUE, SQL_INDEX.TYPE.PARTIAL, SQL_INDEX.TYPE.GIN].includes(dataArray[index].indexType)))
          ) {
          // row => subrow
            handleRowToSubFocus({ isNext: true, index });
          } else {
            for (let nextIndex = 1; nextIndex !== lengthOfData * SQL_INDEX.TOTAL_FIELDS; nextIndex += 1) {
              let isTabIndex = false;
              if ([FiledPosition.fields, FiledPosition.attribute].includes(focusIndex + nextIndex)) isTabIndex = true;
              // (sub) => sub;
              if (SQL_INDEX.SUB_TOTAL_FIELDS * FiledPosition.attribute === focusIndex) isTabIndex = true;
              const query = `#${idPrefix}${focusIndex + nextIndex}  ${isTabIndex ? '[tabindex="0"]' : ''}`;
              const field = document.querySelector(query);
              if (field && !field?.hasAttribute?.('disabled')) {
                field?.focus();
                break;
              } else if ((focusField === 'value' || focusField === 'length') && mainRow?.original?.indexFields?.length - 1 === index) {
              // sub=>row
                handleSubToRowFocus({ isNext: true, mainRow });
              }
            }
          }
          break; }

        default:
          break;
      }
    }
  };

  const handleAutoFocus = ({ mainRow, focusField, idPrefix }) => {
    const index = mainRow ? stateData.modelIndexList[mainRow.index]?.indexFields?.length : stateData.modelIndexList.length;
    const { FiledPosition } = getFieldPosition(index, mainRow, dbType);
    let isTabIndex = false;
    if (mainRow && focusField === 'attribute') { isTabIndex = true; }
    const nextfield = document.querySelector(`#${idPrefix}${FiledPosition[focusField]}  ${isTabIndex ? '[tabindex="0"]' : ''}`);
    nextfield?.focus();
  };

  const value = {
    dispatch,
    modelIndexLoader,
    showModelIndexLoader,
    hideModelIndexLoader,
    modelIndexList: stateData.modelIndexList,
    editModelIndexData: stateData.editModelIndexData,
    handleAddRow,
    onKeyDownHandle,
    handleAutoFocus,
  };

  return <IndexContext.Provider value={value}>{children}</IndexContext.Provider>;
};

function useIndex() {
  const context = React.useContext(IndexContext);
  if (context === undefined) {
    throw new Error('useIndex must be used within a IndexProvider');
  }
  return context;
}

export { IndexProvider, useIndex };
