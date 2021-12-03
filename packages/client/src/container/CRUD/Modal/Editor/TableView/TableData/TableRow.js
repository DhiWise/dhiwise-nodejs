/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useSelector } from 'react-redux';
import {
  isEmpty, last,
} from 'lodash';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Controller, useForm } from 'react-hook-form';
import { Icons } from '@dhiwise/icons';
import { TableViewCss } from '../../../../../../assets/css/tableViewCss';
import {
  Input, Checkbox, Select,
} from '../../../../../../components';
// import { TableSubRow } from './TableSubRow';
import { DragHandle } from './Sortable';
import { AddRelation } from '../AddRelation';
import { getError } from '../../../../../../utils/validationMsgs';
import {
  DEFAULT_OPTIONS, getDisableField, DEFAULT_VALUES,
  getSubFieldPosition, SUB_FIELD_SEQ, getFieldPosition, util, DB_TYPE,
  DEFAULT_TYPE_LENGTH, isNumberType, KEYS,
} from '../../../../../../constant/model';
import {
  LocalFields, InnerType, DateTime, NumberType,
} from '../components/index';
import { Enum } from '../Enum';
import { SelectEnumValue } from '../Enum/SelectEnumValue';
import { useEditor } from '../../EditorProvider';
import { DeleteRow } from './DeleteRow';
import RowSuspense from './RowSuspense';
import { modelAttrRegex } from '../../../../../../utils/regex';
import { MAX_INPUT_FIELD_LIMIT } from '../../../../../../constant/common';
import { ORM_TYPE } from '../../../../../../constant/Project/applicationStep';

const TableSubRow = React.lazy(() => new Promise((resolve) => resolve(import('./TableSubRow'))));

const SortableItem = SortableElement(({ subRow, rowIndex, ...otherProps }) => (
  <RowSuspense>
    <div className="relative mb-2" id={subRow.key}>
      <TableSubRow
        index={rowIndex}
        subRow={subRow}
        {...otherProps}
      />
    </div>
  </RowSuspense>
));
const SortableList = SortableContainer(({ items, ...otherProps }) => (
  <div>
    {
      items?.map((rs, index) => (
        <SortableItem key={rs.key} subRow={rs} rowIndex={index} index={index} useDragHandle {...otherProps} />
      ))
    }
  </div>
));

const AllCheckBox = ({
  cname, onInputChange, watch, control, disable, onKeyDownHandle, id,
}) => (
  <>
    <Controller
      control={control}
      name={cname}
      defaultValue={!!watch(cname)}
      render={(controlProps) => (
        <Checkbox
          id={id}
          {...controlProps}
          checked={!!watch(cname)}
          disabled={!!disable[cname]}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              // setValue(cname, !e?.target?.checked);
              controlProps.onChange(!e?.target?.checked);
              onInputChange(cname, !e?.target?.checked, id);
              // requestAnimationFrame(() => {
              //   onKeyDownHandle(e, cname);
              // });
            } else { onKeyDownHandle(e, cname); }
          }}
          onChange={(value) => {
            controlProps.onChange(value);
            onInputChange(cname, value);
          }}
        />
      )}
    />
  </>
);

const TableRow = React.memo((props) => {
  const {
    row, onAddSubRow, onSubSortEnd, onExpand, onChange, localRef, style, onSubRowChange, lengthOfData,
    tableJson,
  } = props;

  const rowStyle = React.useMemo(() => ({
    ...style,
    overflowX: 'visible',
  }), [style]);

  const {
    modelList, currentId, dbType, ormType, TABLE_TYPES, dependency, setDependency,
  } = useEditor();
  const { isExpand } = row;
  const isMongoDb = React.useMemo(() => dbType === DB_TYPE.MONGODB, [dbType]);
  const currentApplicationCode = useSelector((state) => state.projects.currentApplicationCode);
  const TYPE_OPTIONS = React.useMemo(() => util.getTypeOptions(dbType, currentApplicationCode), [dbType, currentApplicationCode]);
  const CONST_VARIABLE = { TABLE_TYPES, TYPE_OPTIONS };

  const {
    getValues, control, errors, setValue, watch,
  } = useForm({
    shouldUnregister: false,
  });

  const disable = React.useMemo(() => getDisableField(watch('type'),
    {
      isAutoIncrement: watch('isAutoIncrement'), match: watch('match'), unique: watch('unique'), default: watch('default'), filter: watch('filter'),
    }, dbType,
    { // opts
      attr: (watch('attr') === '_id' || watch('attr') === 'id') ? watch('attr') : '',
      currentApplicationCode,
    }),
  [watch('type'), watch('isAutoIncrement'), dbType, watch('attr'), watch('match'), watch('default'), watch('unique'), watch('filter')]);
  const { TOTAL_FIELDS, FIELD_SEQ, FiledPosition } = getFieldPosition(props.index, dbType, currentApplicationCode);

  const handleAutoFocus = (focusId) => {
    const ele = document.getElementById(focusId);
    ele?.focus();
  };

  const onInputChange = React.useCallback((fieldName, value, focusId) => {
    if (['enum', 'isEnum', 'refAttribute', 'innerDataType', 'relType'].includes(fieldName)) { setValue(fieldName, value); }
    if (fieldName === 'default' && (row.type === TABLE_TYPES.DATE || row.type === TABLE_TYPES.DATEONLY || row.type === TABLE_TYPES.DATETIME || row.type === TABLE_TYPES.TIMESTAMP)) { setValue('default', value); }
    if (fieldName === 'type') {
      setValue('isAutoIncrement', undefined);
      setValue('default', undefined);
      setValue('unique', undefined);
      row.default = undefined;
      row.isAutoIncrement = undefined;
      row.unique = undefined;
    }
    if (fieldName === 'attr') {
      if (!isEmpty(value) && !row.type) {
        setValue('type', ormType === ORM_TYPE.MONGOOSE ? 'String' : 'STRING');
        onInputChange('type');
      }
    }
    const fieldValue = (value === undefined || value === null) ? getValues(fieldName) : value;
    if (fieldName === 'filter' && !fieldValue) { // clear default value if there are no options selected in default
      setValue('default', undefined);
      row.default = undefined;
    }
    if (fieldName === 'type' && (fieldValue === TABLE_TYPES.BOOL) && !row.default) {
      setValue('default', 'true');
      row.default = 'true';
    }
    if (fieldName === 'type' && (fieldValue === TABLE_TYPES.BOOL || (!isMongoDb && isNumberType(fieldValue, TABLE_TYPES)))) {
      setValue('filter', undefined);
      row.filter = undefined;
    }
    if (fieldName === 'required' && fieldValue && row.filter === 'NULL') {
      setValue('filter', undefined);
      row.filter = undefined;
    }
    if (fieldName === 'isEnum') {
      // assign value for enum validation
      if (fieldValue && isEmpty(row.enum)) {
        row.enum = {};
        setValue('enum', {});
      } else if (!fieldValue) {
        row.enum = undefined;
        setValue('enum', undefined);
      }
      setValue('default', undefined);
      row.default = undefined;
    }
    if (fieldName === 'type' && [TABLE_TYPES.ARRAY, TABLE_TYPES.JSON].includes(fieldValue) && isMongoDb) {
      setValue('private', false);
      row.private = false;
    }

    if (fieldName === KEYS.match && fieldValue) {
      // pattern enable then remove other validation
      [KEYS.minLength, KEYS.maxLength, KEYS.lowercase, KEYS.trim].forEach((x) => {
        row[x] = undefined;
        setValue(x, undefined);
      });
    }

    if (fieldValue !== row[fieldName]) {
      // on change only when value is updated
      setDependency(dependency.map((x) => {
        if (row[fieldName] === x.oldKey) {
          return { ...x, newKey: fieldValue };
        }
        return x;
      }));
      row[fieldName] = fieldValue;
      onChange?.({
        key: fieldName, value: fieldValue, row, index: props.index,
      });
    }
    // if (isNotFocus) return; // remove focus onBlur
    if (focusId) {
      requestAnimationFrame(() => {
        handleAutoFocus(focusId);
        // handleAutoFocus(fieldName, row.key, fieldValue, { index: props.index }); // manage auto focus
      });
    }
  }, [row, props?.index, onChange, dependency]);

  React.useEffect(() => {
    if (row) {
      const rowArr = Object.keys(row);
      Object.keys(DEFAULT_VALUES).map((r) => {
        setValue(r, row[r]);
        return r;
      });
      if (rowArr.length === 1) {
        // for blank row
        Object.keys(DEFAULT_VALUES).map((x) => {
          setValue(x, row[x]);
          return x;
        });
      }
    }
  }, [row]);

  const showSub = React.useCallback((str) => {
    onExpand(row, str);
  }, [row, onExpand]);

  const handleRowToSubFocus = ({
    focusField, prevRow, prevIndex, downIndex, downRow, ...opt
  }) => {
    // handle row to subrow focus

    if (opt?.isDown) {
      const subField = getSubFieldPosition(0); // 1st sub row
      let focusIndex = subField.FiledPosition[focusField];
      for (let nextIndex = 0; nextIndex <= downRow.subRows?.length; nextIndex += 1) {
        if (focusField === 'subAttr') {
          if (downRow.subRows[nextIndex]?.type === TABLE_TYPES.OBJECTID || downRow.subRows[nextIndex]?.type === TABLE_TYPES.VIRTUAL_RELATION) {
            focusIndex = subField.FiledPosition.relation;
          } else if (downRow.subRows[nextIndex]?.type === TABLE_TYPES.STRING || downRow.subRows[nextIndex]?.type === TABLE_TYPES.NUMBER) {
            focusIndex = subField.FiledPosition.isEnum;
          }
        }
        const field = document.querySelector(`#subrow${downIndex}${focusIndex - nextIndex}`);
        if (field && !field?.hasAttribute?.('disabled')) {
          field?.focus();
          break;
        }
      }
    } else if (opt?.isUp) {
      const subField = getSubFieldPosition(prevRow?.subRows?.length - 1);// last sub row
      let focusIndex = subField.FiledPosition[focusField];
      for (let nextIndex = prevRow.subRows?.length - 1; nextIndex >= 0; nextIndex -= 1) {
        if (focusField === 'subAttr') {
          if (prevRow.subRows[nextIndex]?.type === TABLE_TYPES.OBJECTID || prevRow.subRows[nextIndex]?.type === TABLE_TYPES.VIRTUAL_RELATION) {
            focusIndex = subField.FiledPosition.relation;
          } else if (prevRow.subRows[nextIndex]?.type === TABLE_TYPES.STRING || prevRow.subRows[nextIndex]?.type === TABLE_TYPES.NUMBER) {
            focusIndex = subField.FiledPosition.isEnum;
          }
        }
        const field = document.querySelector(`#subrow${prevIndex}${focusIndex}`);
        if (field && !field?.hasAttribute?.('disabled')) {
          field?.focus();
          break;
        }
      }
    } else if (opt?.isPrev) {
      const subField = getSubFieldPosition(prevRow?.subRows?.length - 1);// last sub row
      const focusIndex = subField.FiledPosition.match;
      for (let nextIndex = 0; nextIndex !== lengthOfData * TOTAL_FIELDS; nextIndex += 1) {
        const field = document.querySelector(`#subrow${props.index - 1}${focusIndex - nextIndex}`);
        if (field && !field?.hasAttribute?.('disabled')) {
          field?.focus();
          break;
        }
      }
    } else if (opt?.isNext) {
      // next
      const field = document.querySelector(`#subrow${props.index}${SUB_FIELD_SEQ.attr}`);
      if (field?.disabled) {
        let isFoc = false;
        Object.keys(SUB_FIELD_SEQ).forEach((s) => {
          const field1 = document.querySelector(`#subrow${props.index}${SUB_FIELD_SEQ[s]}`);
          if (!field1?.disabled && field1?.focus && !isFoc) {
            isFoc = true;
            field1.focus();
          }
        });
      } else { field?.focus(); }
    }
  };

  const onKeyDownHandle = (e, focusField, defaultFocusIndex) => {
    const focusIndex = defaultFocusIndex !== undefined ? defaultFocusIndex : FiledPosition[focusField];
    switch (e.keyCode) {
      case 38:
      { // up
        let isFocused = false;
        if (isMongoDb && (tableJson[props.index - 1]?.type === TABLE_TYPES.ARRAY
            || tableJson[props.index - 1]?.type === TABLE_TYPES.JSON)) {
          // row => subrow
          for (let nextIndex = props.index - 1; nextIndex >= 0; nextIndex -= 1) {
            if (tableJson[nextIndex]?.isExpand) {
              // row => subrow
              isFocused = true;
              handleRowToSubFocus({
                isUp: true, focusField, prevRow: tableJson[nextIndex], prevIndex: nextIndex,
              });
              break;
            }
          }
        }
        if (!isFocused) {
          for (let nextIndex = TOTAL_FIELDS; nextIndex < lengthOfData * TOTAL_FIELDS; nextIndex += TOTAL_FIELDS) {
            const field = document.querySelector(`#row${focusIndex - nextIndex}`);
            if (field && !field?.hasAttribute?.('disabled')) {
              field?.focus();
              break;
            }
          }
        }
        break;
      }
      case 40:
      { // down
        let isFocused = false;
        if (isMongoDb && (tableJson[props.index]?.type === TABLE_TYPES.ARRAY
            || tableJson[props.index]?.type === TABLE_TYPES.JSON)) {
          // row => subrow
          for (let nextIndex = props.index; nextIndex <= lengthOfData; nextIndex += 1) {
            if (tableJson[nextIndex]?.isExpand) {
              isFocused = true;
              handleRowToSubFocus({
                isDown: true, focusField, downIndex: nextIndex, downRow: tableJson[nextIndex],
              });
              break;
            }
          }
        }
        if (!isFocused) {
          for (let nextIndex = TOTAL_FIELDS; nextIndex < lengthOfData * TOTAL_FIELDS; nextIndex += TOTAL_FIELDS) {
            const field = document.querySelector(`#row${focusIndex + nextIndex}`);
            if (field && !field?.hasAttribute?.('disabled')) {
              isFocused = true;
              field?.focus();
              break;
            } else if (isMongoDb) {
              // row=>sub-row: if row having sub-attribute and field is disabled
              const index = (focusIndex - FIELD_SEQ[focusField]) / TOTAL_FIELDS;
              for (let nextIndex1 = index; nextIndex1 <= lengthOfData; nextIndex1 += 1) {
                if ((tableJson[nextIndex1]?.type === TABLE_TYPES.ARRAY
                    || tableJson[nextIndex1]?.type === TABLE_TYPES.JSON) && tableJson[nextIndex1]?.isExpand) {
                  // row => subrow
                  isFocused = true;
                  handleRowToSubFocus({
                    isDown: true, focusField, downIndex: nextIndex1, downRow: tableJson[nextIndex1],
                  });
                  break;
                }
              }
            }
            if (isFocused) break;
          }
        }
        break;
      }
      case 37:
      { // left
        if (e.ctrlKey) {
          if (isMongoDb && tableJson[props.index - 1]?.isExpand && focusField === 'attr') {
            // row => subrow
            handleRowToSubFocus({ isPrev: true, prevRow: tableJson[props.index - 1] });
          } else {
            for (let nextIndex = 1; nextIndex !== lengthOfData * TOTAL_FIELDS; nextIndex += 1) {
              const field = document.querySelector(`#row${focusIndex - nextIndex}`);
              if (field && !field?.hasAttribute?.('disabled')) {
                field?.focus();
                break;
              }
            }
          }
        }
        break;
      }
      case 39:
      {
        // right
        if (e.ctrlKey) {
          if (isMongoDb && focusField === 'subAttr' && tableJson[props.index].isExpand) {
            // row => subrow
            handleRowToSubFocus({ isNext: true });
          } else {
            for (let nextIndex = 1; nextIndex !== lengthOfData * TOTAL_FIELDS; nextIndex += 1) {
              const field = document.querySelector(`#row${focusIndex + nextIndex}`);
              if (field && !field?.hasAttribute?.('disabled')) {
                field?.focus();
                break;
              }
            }
          }
        }
        break;
      }
      case 13:
      {
        // enter
        if (isMongoDb && focusField === 'subAttr' && !tableJson[props.index].isExpand) {
          // focus on sub-row
          showSub('sub-attr');
          requestAnimationFrame(() => {
            handleRowToSubFocus({ isNext: true });
          });
        } else {
          if (isMongoDb && focusField === 'subAttr' && tableJson[props.index].isExpand) {
            // collapse subattr
            showSub('sub-attr');
          }
          for (let nextIndex = 1; nextIndex !== lengthOfData * TOTAL_FIELDS; nextIndex += 1) {
            const field = document.querySelector(`#row${focusIndex + nextIndex}`);
            if (field && !field?.hasAttribute?.('disabled')) {
              field?.focus();
              break;
            }
          }
        }
        break;
      }

      default:
        break;
    }
  };

  const handleSubrowFocus = (opt) => {
    // sub-row to row focus
    if (opt?.isPrev) {
      // prev
      onKeyDownHandle(opt.e, 'default');
    } else if (opt?.isUp) {
      // up (index * total) + colseq
      for (let nextIndex = props.index; nextIndex >= 0; nextIndex -= 1) {
        const fIndex = (nextIndex * TOTAL_FIELDS) + (FIELD_SEQ[opt.focusField]);
        if (fIndex < 0) break;
        if (tableJson[nextIndex - 1]?.isExpand && disable[opt.focusField]) {
          // expanded sub row and move subrow=>subrow
          handleRowToSubFocus({
            isUp: true, focusField: opt.focusField, prevRow: tableJson[nextIndex - 1], prevIndex: nextIndex - 1,
          });
          break;
        } else {
          // is not expanded
          const field = document.querySelector(`#row${fIndex}`);
          if (field && !field?.hasAttribute?.('disabled')) {
            field?.focus();
            break;
          }
        }
      }
    } else if (opt?.isDown) {
      // down (index+1 * total) + colseq
      for (let nextIndex = props.index + 1; nextIndex < lengthOfData; nextIndex += 1) {
        const fIndex = (nextIndex * TOTAL_FIELDS) + (FIELD_SEQ[opt.focusField]);
        if (fIndex < 0) break;
        if (tableJson[nextIndex]?.isExpand && disable[opt.focusField]) {
          // expanded sub row and move subrow=>subrow
          handleRowToSubFocus({
            isDown: true, focusField: opt.focusField, downRow: tableJson[nextIndex], downIndex: nextIndex,
          });
          break;
        } else {
          // is not expanded
          const field = document.querySelector(`#row${fIndex}`);
          if (field && !field?.hasAttribute?.('disabled')) {
            field?.focus();
            break;
          }
        }
      }
    } else {
      // next
      const calcIndex = (props.index + 1) * TOTAL_FIELDS;
      let fIndex;
      if (opt.focusField === 'attr') { fIndex = calcIndex + 1; }
      if (fIndex < 0) return;
      const field = document.querySelector(`#row${fIndex}`);
      field?.focus();
    }
  };

  const checkboxProps = {
    onInputChange, watch, control, setValue, disable, onKeyDownHandle,
  };

  const RequiredCheckBox = React.useCallback(() => (
    <AllCheckBox cname="required" id={`row${FiledPosition.required}`} {...checkboxProps} />
  ), [row, disable, watch('required')]);

  const UniqueCheckBox = React.useCallback(() => (
    <AllCheckBox cname="unique" id={`row${FiledPosition.unique}`} {...checkboxProps} />
  ), [row, disable, watch('unique')]);

  const AutoIncCheckBox = React.useCallback(() => (
    <AllCheckBox cname="isAutoIncrement" id={`row${FiledPosition.isAutoIncrement}`} {...checkboxProps} />
  ), [row, disable, watch('isAutoIncrement')]);

  const LowerCheckBox = React.useCallback(() => (
    <AllCheckBox cname="lowercase" id={`row${FiledPosition.lowercase}`} {...checkboxProps} />
  ), [row, disable, watch('lowercase')]);

  const TrimCheckBox = React.useCallback(() => (
    <AllCheckBox cname="trim" id={`row${FiledPosition.trim}`} {...checkboxProps} />
  ), [row, disable, watch('trim')]);

  const PrimaryCheckBox = React.useCallback(() => (
    <AllCheckBox cname="primary" id={`row${FiledPosition.primary}`} {...checkboxProps} />
  ), [row, disable, watch('primary')]);

  // const TinyCheckBox = React.useCallback(() => (
  //   <AllCheckBox cname="tiny" id={`row${FiledPosition.tiny}`} {...checkboxProps} />
  // ), [row, disable, watch('tiny')]);

  const PrivateCheckbox = React.useCallback(() => (
    <AllCheckBox cname="private" id={`row${FiledPosition.private}`} {...checkboxProps} />
  ), [row, disable, watch('private')]);

  // const IndexCheckBox = React.useCallback(() => (
  //   <AllCheckBox cname="index" {...checkboxProps} />
  // ), [row, disable, watch('index')]);

  return (
    <>
      <div className="border-t border-gray-200 py-2" id={row.key} style={rowStyle}>
        {
           (
             <div className="relative">
               <div className="relative pl-8">
                 <tr className={`${TableViewCss.tableRow}`}>
                   <DragHandle />
                   { isMongoDb
                    && (watch('type') === TABLE_TYPES.ARRAY || watch('type') === TABLE_TYPES.JSON)
                     ? (
                       <>
                         {isExpand
                           ? (
                             <div className={TableViewCss.tableCollapse} onClick={showSub}>
                               <Icons.DownArrow />
                             </div>
                           )
                           : (
                             <div className={TableViewCss.tableCollapse} onClick={() => showSub('sub-attr')}>
                               <Icons.RightArrow />
                             </div>
                           )}
                       </>
                     )
                     : null}

                   <DeleteRow
                     deleteObj={row}
                     disabled={(lengthOfData === 1 && Object.keys(tableJson)?.length <= 2) || (dbType === DB_TYPE.MONGODB && watch('attr') === '_id') || (dbType !== DB_TYPE.MONGODB && watch('attr') === 'id')}
                   />
                   <td className="relative pl-12">
                     <div className="tableInputSelect">
                       <Controller
                         defaultValue={row.attr || ''}
                         control={control}
                         name="attr"
                         render={(controlProps) => (
                           <Input
                             {...controlProps}
                             id={`row${FiledPosition.attr}`}
                             size="small"
                             placeholder="Attributes"
                             WrapClassName="w-full"
                             maxLength={MAX_INPUT_FIELD_LIMIT.title}
                             customRegex={modelAttrRegex}
                             disabled={disable.attr}
                             onBlur={() => onInputChange('attr', controlProps.value)}
                             onKeyDown={(e) => onKeyDownHandle(e, 'attr')}
                             error={getError(errors, 'attr', 'Attribute')}
                           />
                         )}
                       />
                     </div>
                   </td>
                   <td className="">
                     <div className={`tableInputSelect ${watch('type') === TABLE_TYPES.VIRTUAL_RELATION && ''}`}>
                       <Controller
                         defaultValue={row.type || ''}
                         control={control}
                         name="type"
                         render={(controlProps) => (
                           <Select
                             sizeSmall
                             inputId={`row${FiledPosition.type}`}
                             {...controlProps}
                             isClearable={false}
                             placeholder="Data type"
                             options={TYPE_OPTIONS.filter((x) => x.id !== TABLE_TYPES.POINT)}
                             disabled={disable.type}
                             onChange={(value) => {
                               controlProps.onChange(value);
                               onInputChange('type');
                             }}
                             onKeyDown={(e) => {
                               if (e.ctrlKey || e.keyCode === 13) {
                                 if (e.keyCode === 13 && controlProps.ref?.current?.state?.menuIsOpen) {
                                   return;
                                 }
                                 onKeyDownHandle(e, 'type');
                                 if (e.ctrlKey) e.preventDefault();
                               }
                             }}
                           />
                         )}
                       />

                       {isMongoDb && watch('type') === TABLE_TYPES.VIRTUAL_RELATION && (
                       <>
                         <LocalFields
                           disabled={disable.localField}
                           id={`row${FiledPosition.localField}`}
                           rowObj={row}
                           localField={row.localField}
                           localRef={localRef}
                           onInputChange={onInputChange}
                           onKeyDown={onKeyDownHandle}
                         />
                       </>
                       )}
                     </div>
                   </td>
                   <td className="">
                     <div className="tableInputSelect">
                       {((!isMongoDb && watch('type') === TABLE_TYPES.ENUM)
                        || (isMongoDb && (watch('type') === TABLE_TYPES.STRING || watch('type') === TABLE_TYPES.NUMBER)))
                        && (
                          <Enum
                            disabled={disable.isEnum}
                            onInputChange={onInputChange}
                            row={row}
                            id={`row${FiledPosition.isEnum}`}
                            onKeyDown={(e) => onKeyDownHandle(e, 'isEnum')}
                          />
                        )}

                       {isMongoDb && (watch('type') === TABLE_TYPES.ARRAY || watch('type') === TABLE_TYPES.JSON) && (
                       <span
                         id={`row${FiledPosition.subAttr}`}
                         name="sub-attr"
                         tabIndex="0"
                          //  onKeyDown={(e) => onKeyDownHandle(e, 'sub-attr')}
                         onClick={() => showSub('sub-attr')}
                         onKeyDown={(e) => {
                           onKeyDownHandle(e, 'subAttr');
                         }}
                         className={TableViewCss.addValue}
                       >
                         <div className="w-4 h-4 mr-2">
                           <Icons.Add />
                         </div>
                         Add sub attributes
                       </span>
                       )}
                       {isMongoDb && (watch('type') === TABLE_TYPES.OBJECTID || watch('type') === TABLE_TYPES.VIRTUAL_RELATION)
                        && (
                          <AddRelation
                            currentId={currentId}
                            modelList={modelList}
                            onInputChange={onInputChange}
                            model={row.ref}
                            foreignKey={row.foreignField}
                            isVirtual={watch('type') === TABLE_TYPES.VIRTUAL_RELATION}
                            id={`row${FiledPosition.relation}`}
                            onKeyDown={(e) => onKeyDownHandle(e, 'relation')}
                            CONST_VARIABLE={CONST_VARIABLE}
                          />
                        )}
                       {
                        !isMongoDb && row.type && (watch('type') === TABLE_TYPES.ARRAY || watch('type') === TABLE_TYPES.RANGE)
                        && (
                          <InnerType
                            disabled={disable.innerDataType}
                            id={`row${FiledPosition.innerDataType}`}
                            TYPE_OPTIONS={TYPE_OPTIONS}
                            innerDataType={row.innerDataType}
                            onInputChange={onInputChange}
                            onKeyDown={onKeyDownHandle}
                          />
                        )
                      }
                       {isMongoDb && row.type && (watch('type') === TABLE_TYPES.ARRAY || watch('type') === TABLE_TYPES.JSON
                        || watch('type') === TABLE_TYPES.OBJECTID || watch('type') === TABLE_TYPES.VIRTUAL_RELATION
                        || watch('type') === TABLE_TYPES.STRING || watch('type') === TABLE_TYPES.NUMBER) ? <></>
                         : !isMongoDb && row.type && (watch('type') === TABLE_TYPES.ARRAY || watch('type') === TABLE_TYPES.RANGE
                          || watch('type') === TABLE_TYPES.ENUM) ? <></> : <>-</>}
                     </div>
                   </td>

                   <td className="">
                     <div className={`tableInputSelect ${watch('filter') === 'AS_DEFINED'
                      && watch('type') !== TABLE_TYPES.BOOL
                      && (!isNumberType(watch('type'), TABLE_TYPES) || (isMongoDb)) ? '' : '-mt-1'}`}
                     >
                       {watch('type') !== TABLE_TYPES.BOOL
                        && ((!isMongoDb && !isNumberType(watch('type'), TABLE_TYPES)) || (isMongoDb))
                         ? (
                           <Controller
                             defaultValue={row.filter || ''}
                             control={control}
                             name="filter"
                             render={(controlProps) => (
                               <Select
                                 inputId={`row${FiledPosition.filter}`}
                                 sizeSmall
                                 {...controlProps}
                                 placeholder="Default"
                                 options={DEFAULT_OPTIONS}
                                 isOptionDisabled={(option) => option.id === 'NULL' && row.required}
                                 disabled={disable.filter}
                                 onChange={(value) => {
                                   controlProps.onChange(value);
                                   onInputChange('filter');
                                 }}
                                 onKeyDown={(e) => {
                                   if (e.ctrlKey || e.keyCode === 13) {
                                     if (e.keyCode === 13 && controlProps.ref?.current?.state?.menuIsOpen) {
                                       return;
                                     }
                                     onKeyDownHandle(e, 'filter');
                                     if (e.ctrlKey) e.preventDefault();
                                   }
                                 }}
                               />
                             )}
                           />
                         )
                         : null}

                       {watch('type') === TABLE_TYPES.BOOL
                         ? (
                           <span className="text-center">
                             <Controller
                               defaultValue={row.default || ''}
                               control={control}
                               name="default"
                               render={(controlProps) => (
                                 <Select
                                   sizeSmall
                                   {...controlProps}
                                   WrapClassName="mt-1"
                                   placeholder="Default value"
                                   options={[{ id: 'true', name: 'TRUE' }, { id: 'false', name: 'FALSE' }]}
                                   disabled={disable.default}
                                   onChange={(value) => {
                                     controlProps.onChange(value);
                                     onInputChange('default');
                                   }}
                                   inputId={`row${FiledPosition.default}`}
                                   onKeyDown={(e) => {
                                     if (e.keyCode === 13 && controlProps.ref?.current?.state?.menuIsOpen) {
                                       return;
                                     }
                                     if (e.ctrlKey || e.keyCode === 13) {
                                       onKeyDownHandle(e, 'default');
                                       if (e.ctrlKey) e.preventDefault();
                                     }
                                   }}
                                 />
                               )}
                             />
                           </span>
                         )
                         : ((!isMongoDb && isNumberType(watch('type'), TABLE_TYPES))
                          || (isMongoDb && watch('filter') === 'AS_DEFINED' && !watch('isEnum')
                            && (watch('type') === TABLE_TYPES.NUMBER || watch('type') === TABLE_TYPES.DECIMAL || watch('type') === TABLE_TYPES.PERCENT)))
                           ? (
                             <NumberType
                               TABLE_TYPES={TABLE_TYPES}
                               type={watch('type')}
                               disabled={disable.default}
                               id={`row${FiledPosition.default}`}
                               defaultValue={row.default}
                               onInputChange={onInputChange}
                               onKeyDown={onKeyDownHandle}
                             />
                           ) : watch('filter') === 'AS_DEFINED' ? (
                             <>
                               {watch('isEnum')
                                && [TABLE_TYPES.STRING, TABLE_TYPES.ENUM, TABLE_TYPES.NUMBER].includes(row.type) ? (
                                  <SelectEnumValue
                                    defaultValue={row?.default}
                                    isEnum={watch('isEnum')}
                                    enumObj={watch('enum')}
                                    row={row}
                                    disabled={disable.default}
                                    onInputChange={onInputChange}
                                    id={`row${FiledPosition.default}`}
                                    onKeyDown={(e) => onKeyDownHandle(e, 'default')}
                                  />
                                 )
                                 : (watch('type') === TABLE_TYPES.DATE || watch('type') === TABLE_TYPES.DATEONLY || watch('type') === TABLE_TYPES.DATETIME || watch('type') === TABLE_TYPES.TIMESTAMP)
                                   ? (
                                     <DateTime
                                       showTimeSelect={watch('type') === TABLE_TYPES.DATE || watch('type') === TABLE_TYPES.DATETIME || watch('type') === TABLE_TYPES.TIMESTAMP}
                                       disabled={disable.default}
                                       id={`row${FiledPosition.default}`}
                                       defaultValue={row.default}
                                       WrapClassName="w-full mt-1"
                                       onInputChange={onInputChange}
                                       onKeyDown={(e) => onKeyDownHandle(e, 'default')}
                                     />
                                   ) : (watch('type') === TABLE_TYPES.TINYSTRING
                                    || watch('type') === TABLE_TYPES.STRING
                                    || watch('type') === TABLE_TYPES.TEXT
                                    || watch('type') === TABLE_TYPES.CHAR) ? (
                                      <Controller
                                        defaultValue={row.default || ''}
                                        control={control}
                                        name="default"
                                        render={(controlProps) => (
                                          <Input
                                            {...controlProps}
                                            maxLength={DEFAULT_TYPE_LENGTH.STRING}
                                            size="small"
                                            placeholder="Default value"
                                            WrapClassName="w-full mt-1"
                                            disabled={disable.default}
                                            onBlur={() => onInputChange('default', controlProps.value)}
                                            id={`row${FiledPosition.default}`}
                                            onKeyDown={(e) => onKeyDownHandle(e, 'default')}
                                          />
                                        )}
                                      />
                                     )
                                     : isMongoDb ? (
                                       <Controller
                                         defaultValue={row.default || ''}
                                         control={control}
                                         name="default"
                                         render={(controlProps) => (
                                           <Input
                                             {...controlProps}
                                             size="small"
                                             placeholder="Default value"
                                             WrapClassName="w-full mt-1"
                                             disabled={disable.default}
                                             onBlur={() => onInputChange('default', controlProps.value)}
                                             id={`row${FiledPosition.default}`}
                                             onKeyDown={(e) => onKeyDownHandle(e, 'default')}
                                           />
                                         )}
                                       />
                                     ) : null}
                             </>
                           ) : null}
                     </div>
                   </td>
                   {
                     !isMongoDb && (
                     <td className="">
                       <div className="tableInputSelect">
                         { (watch('type') === TABLE_TYPES.STRING || watch('type') === TABLE_TYPES.INTEGER || watch('type') === TABLE_TYPES.UnsignedBigInt)
                           ? (
                             <AddRelation
                               isSql
                               refAttribute={row.refAttribute}
                               relType={row.relType}
                               currentId={currentId}
                               modelList={modelList}
                               onInputChange={onInputChange}
                               model={row.ref}
                               id={`row${FiledPosition.relation}`}
                               onKeyDown={(e) => onKeyDownHandle(e, 'relation')}
                               CONST_VARIABLE={CONST_VARIABLE}
                               type={watch('type')}
                               row={row}
                               tableJson={tableJson}
                               disabled={watch('attr') === '_id' || watch('attr') === 'id'}
                               currentApplicationCode={currentApplicationCode}
                             />
                           )
                           : '-'}
                       </div>
                     </td>
                     )
                   }

                   <td className={`check ${TableViewCss.tableCheckBox}`}>
                     <span className="text-center tableCheck">
                       <PrivateCheckbox />
                     </span>
                     {!isMongoDb && (
                     <span className="text-center tableCheck">
                       <PrimaryCheckBox />
                     </span>
                     )}
                     {/* { !isMongoDb && (
                     <span className="text-center tableCheck">
                       <TinyCheckBox />
                     </span>
                     ) } */}
                     <span className="text-center tableCheck">
                       <RequiredCheckBox />
                     </span>
                     <span className="text-center tableCheck">
                       <UniqueCheckBox />
                     </span>
                     <span className="text-center tableCheck">
                       <AutoIncCheckBox />
                     </span>
                   </td>
                   <td className="">
                     <div className="smallInput">
                       <div className="smallInput">
                         {isNumberType(watch('type'), TABLE_TYPES)
                           ? (
                             <Controller
                               defaultValue={row.min || ''}
                               control={control}
                               name="min"
                               render={(controlProps) => (
                                 <Input.Number
                                   {...controlProps}
                                   allowInteger
                                   size="small"
                                   placeholder="Min"
                                   disabled={disable.min}
                                   onBlur={() => onInputChange('min', controlProps.value)}
                                   id={`row${FiledPosition.minimum}`}
                                   onKeyDown={(e) => onKeyDownHandle(e, 'minimum')}
                                 />

                               )}
                             />
                           )
                           : (
                             <Controller
                               defaultValue={row.minLength || ''}
                               control={control}
                               name="minLength"
                               render={(controlProps) => (
                                 <Input.Number
                                   {...controlProps}
                                   size="small"
                                   placeholder="MinLength"
                                   disabled={disable.minLength}
                                   onBlur={() => onInputChange('minLength', controlProps.value)}
                                   id={`row${FiledPosition.minimum}`}
                                   onKeyDown={(e) => onKeyDownHandle(e, 'minimum')}
                                 />
                               )}
                             />
                           )}
                       </div>
                     </div>
                   </td>
                   <td className="">
                     <div className="smallInput">
                       {isNumberType(watch('type'), TABLE_TYPES)
                         ? (
                           <Controller
                             defaultValue={row.max || ''}
                             control={control}
                             name="max"
                             render={(controlProps) => (
                               <Input.Number
                                 size="small"
                                 {...controlProps}
                                 allowInteger
                                 placeholder="Max"
                                 disabled={disable.max}
                                 onBlur={() => onInputChange('max', controlProps.value)}
                                 id={`row${FiledPosition.maximum}`}
                                 onKeyDown={(e) => onKeyDownHandle(e, 'maximum')}
                               />
                             )}
                           />
                         )
                         : (
                           <Controller
                             defaultValue={row.maxLength || ''}
                             control={control}
                             name="maxLength"
                             render={(controlProps) => (
                               <Input.Number
                                 size="small"
                                 {...controlProps}
                                 placeholder="MaxLength"
                                 disabled={disable.maxLength}
                                 onBlur={() => onInputChange('maxLength', controlProps.value)}
                                 id={`row${FiledPosition.maximum}`}
                                 onKeyDown={(e) => onKeyDownHandle(e, 'maximum')}
                               />
                             )}
                           />
                         )}

                     </div>
                   </td>

                   <td className={`check ${TableViewCss.tableCheckBox}`}>
                     <span className="text-center tableCheck">
                       <LowerCheckBox />
                     </span>
                     {dbType === DB_TYPE.MONGODB && (
                     <span className="text-center tableCheck">
                       <TrimCheckBox />
                     </span>
                     )}
                   </td>
                   <td className="">
                     <div className="smallInput">
                       <Controller
                         defaultValue={row.match || ''}
                         control={control}
                         name="match"
                         render={(controlProps) => (
                           <Input
                             {...controlProps}
                             placeholder="Pattern"
                             size="small"
                             disabled={disable.match}
                             onBlur={() => onInputChange('match', controlProps.value)}
                             id={`row${FiledPosition.match}`}
                             onKeyDown={(e) => onKeyDownHandle(e, 'match')}
                           />
                         )}
                       />
                     </div>
                   </td>
                 </tr>
               </div>
               {isMongoDb && isExpand && (watch('type') === TABLE_TYPES.ARRAY || watch('type') === TABLE_TYPES.JSON)
                && (
                  <div className={TableViewCss.subTable}>
                    <>
                      {
                        row?.subRows
                          ? (
                            <SortableList
                              useDragHandle
                              items={row.subRows}
                              onSortEnd={(ev) => onSubSortEnd(ev, row)}
                              currentId={currentId}
                              modelList={modelList}
                              localRef={localRef}
                              onAddSubRow={(opt) => {
                                if (opt?.isAdd) onAddSubRow(row, false, opt);
                                else if (last(row.subRows).attr?.length > 0) onAddSubRow(row);
                              }}
                              onChange={(d) => onSubRowChange({ ...d, rowIndex: props.index })}
                              lengthOfData={row.subRows?.length}
                              onRowKeyDown={handleSubrowFocus}
                              indexOfRow={props.index}
                              rowObj={row}
                              CONST_VARIABLE={CONST_VARIABLE}
                              dbType={dbType}
                            />
                          )
                          : null
                      }
                      <div className={TableViewCss.addValue} onClick={() => onAddSubRow(row, true)}>
                        <div className="w-4 h-4 mr-2">
                          <Icons.Add />
                        </div>
                        Add row
                      </div>
                    </>
                  </div>
                )}
             </div>
          )
        }
      </div>
    </>
  );
});
export default TableRow;
TableRow.displayName = 'TableRow';
