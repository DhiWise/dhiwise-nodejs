/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { isEmpty } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { TableViewCss } from '../../../../../../assets/css/tableViewCss';
import { Input, Checkbox, Select } from '../../../../../../components';
import { DragHandle } from './Sortable';
import { getError } from '../../../../../../utils/validationMsgs';
import {
  SUB_TOTAL_FIELDS,
  DEFAULT_OPTIONS,
  getDisableField, DEFAULT_VALUES,
  getSubFieldPosition,
  KEYS,
} from '../../../../../../constant/model';
import { AddRelation } from '../AddRelation';
import { LocalFields, NumberType, DateTime } from '../components/index';
import { Enum } from '../Enum';
import { SelectEnumValue } from '../Enum/SelectEnumValue';
import { DeleteRow } from './DeleteRow';
import { MAX_INPUT_FIELD_LIMIT } from '../../../../../../constant/common';
import { modelAttrRegex } from '../../../../../../utils/regex';
import { useEditor } from '../../EditorProvider';
import { ORM_TYPE } from '../../../../../../constant/Project/applicationStep';

const AllCheckBox = ({
  cname, onInputChange, watch, control, disable, onKeyDownHandle, id,
}) => (
  <>
    <Controller
      defaultValue={!!watch(cname)}
      control={control}
      name={cname}
      render={(controlProps) => (
        <Checkbox
          {...controlProps}
          checked={!!watch(cname)}
          disabled={disable[cname]}
          id={id}
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

const TableSubRow = React.memo((props) => {
  const {
    subRow, modelList, currentId, localRef, onAddSubRow, onChange, lengthOfData, onRowKeyDown,
    indexOfRow, rowObj, CONST_VARIABLE, dbType,
  } = props;

  const {
    dependency, setDependency, ormType,
  } = useEditor();

  const { TABLE_TYPES, TYPE_OPTIONS } = CONST_VARIABLE;
  const {
    getValues, control, errors, setValue, watch,
  } = useForm({
    shouldUnregister: false,
  });
  const { FiledPosition } = getSubFieldPosition(props.index);

  const dataTypeOptions = TYPE_OPTIONS.filter((x) => {
    const condi = ![TABLE_TYPES.VIRTUAL_RELATION, TABLE_TYPES.OBJECTID, TABLE_TYPES.JSON,
      TABLE_TYPES.MIXED, TABLE_TYPES.BUFFER, TABLE_TYPES.MAP].includes(x.id);
    // (x.id !== TABLE_TYPES.VIRTUAL_RELATION);
    if (rowObj.type !== TABLE_TYPES.JSON) {
      // if type is not JSON
      return condi && x.id !== TABLE_TYPES.POINT;
    }
    const isTypePointExist = rowObj.subRows.find((s) => s.type === TABLE_TYPES.POINT);
    if (isTypePointExist && isTypePointExist?.key !== subRow.key) {
      // exclude type Point if selected once
      return condi && x.id !== TABLE_TYPES.POINT;
    }
    return condi; // if type is JSON include POINT
  });

  React.useEffect(() => {
    if (rowObj.type !== TABLE_TYPES.JSON && (subRow.type === TABLE_TYPES.POINT)) {
      // reset type field if point is selected
      subRow.type = undefined;
      setValue('type', undefined);
    }
  }, [rowObj.type]);

  const onKeyDownHandle = (e, focusField) => {
    const focusIndex = FiledPosition[focusField];

    switch (e.keyCode) {
      case 38:
      { // up
        let isFocused = false;
        for (let nextIndex = SUB_TOTAL_FIELDS; nextIndex < lengthOfData * SUB_TOTAL_FIELDS; nextIndex += SUB_TOTAL_FIELDS) {
          const field = document.querySelector(`#subrow${indexOfRow}${focusIndex - nextIndex}`);
          if (field && !field?.hasAttribute?.('disabled')) {
            field?.focus();
            isFocused = true;
            break;
          }
        }
        if (!isFocused && props.index === 0) {
          // move to ROW focus
          onRowKeyDown?.({ isUp: true, e, focusField });
          break;
        }
        break; }
      case 40:
      { // down
        let isFocused = false;
        for (let nextIndex = SUB_TOTAL_FIELDS; nextIndex < lengthOfData * SUB_TOTAL_FIELDS; nextIndex += SUB_TOTAL_FIELDS) {
          const field = document.querySelector(`#subrow${indexOfRow}${focusIndex + nextIndex}`);
          if (field && !field?.hasAttribute?.('disabled')) {
            field?.focus();
            isFocused = true;
            break;
          }
        }
        if (!isFocused && props.index === lengthOfData - 1) {
          // move to ROW focus
          onRowKeyDown?.({ isDown: true, e, focusField });
          break;
        }
        break; }
      case 37:
      { // left
        if (e.ctrlKey) {
          let isFocused = false;
          for (let nextIndex = 1; nextIndex !== lengthOfData * SUB_TOTAL_FIELDS; nextIndex += 1) {
            const field = document.querySelector(`#subrow${indexOfRow}${focusIndex - nextIndex}`);
            if (field && !field?.hasAttribute?.('disabled')) {
              field?.focus();
              isFocused = true;
              break;
            }
          }
          if (!isFocused && props.index === 0 && focusField === 'attr') {
            // move to ROW focus
            onRowKeyDown?.({ isPrev: true, e });
            break;
          }
        }
        break; }
      case 39:
      {
        // right
        if (e.ctrlKey) {
          let isFocused = false;
          for (let nextIndex = 1; nextIndex !== lengthOfData * SUB_TOTAL_FIELDS; nextIndex += 1) {
            const field = document.querySelector(`#subrow${indexOfRow}${focusIndex + nextIndex}`);
            if (field && !field?.hasAttribute?.('disabled')) {
              field?.focus();
              isFocused = true;
              break;
            }
          }
          if (!isFocused && props.index === lengthOfData - 1) {
            // move to ROW focus
            onRowKeyDown?.({ isNext: true, focusField: 'attr' });
            break;
          }
        }
        break; }
      case 13:
      {
        // enter
        let isFocused = false;
        for (let nextIndex = 1; nextIndex !== lengthOfData * SUB_TOTAL_FIELDS; nextIndex += 1) {
          const field = document.querySelector(`#subrow${indexOfRow}${focusIndex + nextIndex}`);
          if (field && !field?.hasAttribute?.('disabled')) {
            field?.focus();
            isFocused = true;
            break;
          }
        }
        if (!isFocused && props.index === lengthOfData - 1) {
          // move to ROW focus
          onRowKeyDown?.({ isNext: true, focusField: 'attr' });
          break;
        }
        break; }

      default:
        break;
    }
  };

  const handleAutoFocus = (focusId) => {
    const ele = document.getElementById(focusId);
    ele?.focus();
  };

  const onInputChange = React.useCallback((fieldName, value, focusId) => {
    if (['enum', 'isEnum'].includes(fieldName)) { setValue(fieldName, value); }
    if (fieldName === 'type' || fieldName === 'isEnum') {
      setValue('isAutoIncrement', undefined);
      setValue('default', undefined);
      subRow.default = undefined;
      subRow.isAutoIncrement = undefined;
    }
    if (fieldName === 'attr') {
      if (!isEmpty(value) && !subRow.type) {
        setValue('type', ormType === ORM_TYPE.MONGOOSE ? 'String' : 'STRING');
        onInputChange('type');
      }
    }
    const fieldValue = (value === undefined || value === null) ? getValues(fieldName) : value;
    if (fieldName === 'type' && fieldValue === TABLE_TYPES.BOOL) {
      setValue('filter', undefined);
      subRow.filter = undefined;
    }
    if (fieldName === 'required' && fieldValue && subRow.filter === 'NULL') {
      setValue('filter', undefined);
      subRow.filter = undefined;
    }
    if (fieldName === 'isEnum') {
      // assign value for enum validation
      if (fieldValue && isEmpty(subRow.enum)) {
        subRow.enum = {};
        setValue('enum', {});
      } else if (!fieldValue) {
        subRow.enum = undefined;
        setValue('enum', undefined);
      }
      setValue('default', undefined);
      subRow.default = undefined;
    }

    if (fieldName === KEYS.match && fieldValue) {
      // pattern enable then remove other validation
      [KEYS.minLength, KEYS.maxLength, KEYS.lowercase, KEYS.trim].forEach((x) => {
        subRow[x] = undefined;
        setValue(x, undefined);
      });
    }

    if (fieldValue !== subRow[fieldName]) {
      // on change only when value is updated
      if (dependency) {
        setDependency(dependency.map((x) => {
          if (subRow[fieldName] === x.oldKey) {
            return { ...x, newKey: fieldValue };
          }
          return x;
        }));
      }
      subRow[fieldName] = fieldValue;
      if (fieldName === 'type' && subRow[fieldName] === TABLE_TYPES.POINT) {
        // If type point is selected then add default row having attribute name coordinates and type Array
        if (rowObj.subRows.find((s) => s.type !== TABLE_TYPES.ARRAY)) {
          onAddSubRow({
            isAdd: true,
            dataObj: { type: TABLE_TYPES.ARRAY, attr: 'coordinates' },
          });
          if (props.index + 1 >= rowObj.subRows.length) {
            // if empty row is not added
            requestAnimationFrame(() => onAddSubRow());
          }
        }
      }
      onChange?.({
        key: fieldName, value: fieldValue, index: props.index,
      });
      if (fieldName === 'attr') onAddSubRow();
    }
    if (focusId) {
      requestAnimationFrame(() => {
        handleAutoFocus(focusId);
      });
    }
    // if (isNotFocus) return;
    // requestAnimationFrame(() => {
    //   onAutoFocus?.(fieldName, subRow.key, fieldValue, { index: props.index, isSubRow: true }); // manage auto focus
    // });
  }, [subRow, props?.index, onChange, onAddSubRow, rowObj, dependency]);

  React.useEffect(() => {
    if (subRow) {
      const subRowArr = Object.keys(subRow);
      subRowArr.map((r) => {
        setValue(r, subRow[r]);
        return r;
      });
      if (subRowArr.length === 2) {
        // length 2 for new row (key and rowKey)
        Object.keys(DEFAULT_VALUES).map((x) => {
          setValue(x, subRow[x]);
          return x;
        });
      }
    }
  }, [subRow]);

  const disable = React.useMemo(() => getDisableField(watch('type'), { isAutoIncrement: watch('isAutoIncrement'), match: watch('match') }, dbType), [watch('type'), watch('isAutoIncrement'), dbType, watch('match')]);

  const checkboxProps = {
    onInputChange, watch, control, setValue, disable, onKeyDownHandle,
  };

  const RequiredCheckBox = React.useCallback(() => (
    <AllCheckBox {...checkboxProps} cname="required" id={`subrow${indexOfRow}${FiledPosition.required}`} />
  ), [subRow, disable, watch('required')]);

  const UniqueCheckBox = React.useCallback(() => (
    <AllCheckBox {...checkboxProps} cname="unique" id={`subrow${indexOfRow}${FiledPosition.unique}`} />
  ), [subRow, disable, watch('unique')]);

  const AutoIncCheckBox = React.useCallback(() => (
    <AllCheckBox {...checkboxProps} cname="isAutoIncrement" id={`subrow${indexOfRow}${FiledPosition.isAutoIncrement}`} />
  ), [subRow, disable, watch('isAutoIncrement')]);

  const LowerCheckBox = React.useCallback(() => (
    <AllCheckBox {...checkboxProps} cname="lowercase" id={`subrow${indexOfRow}${FiledPosition.lowercase}`} />
  ), [subRow, disable, watch('lowercase')]);

  const TrimCheckBox = React.useCallback(() => (
    <AllCheckBox {...checkboxProps} cname="trim" id={`subrow${indexOfRow}${FiledPosition.trim}`} />
  ), [subRow, disable, watch('trim')]);

  const PrivateCheckbox = React.useCallback(() => (
    <AllCheckBox cname="private" id={`subrow${indexOfRow}${FiledPosition.private}`} {...checkboxProps} />
  ), [subRow, disable, watch('private')]);

  // const IndexCheckBox = React.useCallback(() => (
  //   <AllCheckBox {...checkboxProps} cname="index" />
  // ), [subRow, disable, watch('index')]);

  return (
    <>
      <tr className={TableViewCss.subTableRow}>
        <DragHandle style={{ zIndex: 1, left: '0px' }} />
        <DeleteRow deleteObj={subRow} isSubRow />
        <td className="flex items-center relative pl-12">
          <div className="tableInputSelect">
            <Controller
              defaultValue={subRow.attr || ''}
              control={control}
              name="attr"
              rules={{ required: true }}
              render={(controlProps) => (
                <Input
                  size="small"
                  dark
                  {...controlProps}
                  placeholder="Attributes"
                  WrapClassName="w-full"
                  id={`subrow${indexOfRow}${FiledPosition.attr}`}
                  maxLength={MAX_INPUT_FIELD_LIMIT.title}
                  customRegex={modelAttrRegex}
                  disabled={watch('type') === '_id'}
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
              defaultValue={subRow.type || null}
              control={control}
              name="type"
              render={(controlProps) => (
                <Select
                  sizeSmall
                  dark
                  {...controlProps}
                  isClearable={false}
                  placeholder="Data type"
                  options={dataTypeOptions}
                  disabled={disable.type}
                  onChange={(value) => {
                    controlProps.onChange(value);
                    onInputChange('type');
                  }}
                  inputId={`subrow${indexOfRow}${FiledPosition.type}`}
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
            {watch('type') === TABLE_TYPES.VIRTUAL_RELATION && (
              <LocalFields
                rowObj={subRow}
                localField={subRow.localField}
                localRef={localRef}
                onInputChange={onInputChange}
                id={`subrow${indexOfRow}${FiledPosition.localField}`}
                onKeyDown={onKeyDownHandle}
              />
            )}
          </div>
        </td>
        <td className="">
          <div className="tableInputSelect">
            {(watch('type') === TABLE_TYPES.STRING || watch('type') === TABLE_TYPES.NUMBER) && (
              <Enum
                disabled={disable.isEnum}
                onInputChange={onInputChange}
                row={subRow}
                id={`subrow${indexOfRow}${FiledPosition.isEnum}`}
                onKeyDown={(e) => onKeyDownHandle(e, 'isEnum')}
              />
            )}
            {(watch('type') === TABLE_TYPES.OBJECTID || watch('type') === TABLE_TYPES.VIRTUAL_RELATION) ? (
              <>
                <AddRelation
                  currentId={currentId}
                  modelList={modelList}
                  onInputChange={onInputChange}
                  model={subRow.ref}
                  foreignKey={subRow.foreignField}
                  isVirtual={watch('type') === TABLE_TYPES.VIRTUAL_RELATION}
                  id={`subrow${indexOfRow}${FiledPosition.relation}`}
                  onKeyDown={(e) => onKeyDownHandle(e, 'relation')}
                  CONST_VARIABLE={CONST_VARIABLE}
                />
              </>
            ) : null}
            {(watch('type') === TABLE_TYPES.OBJECTID || watch('type') === TABLE_TYPES.VIRTUAL_RELATION
              || watch('type') === TABLE_TYPES.STRING || watch('type') === TABLE_TYPES.NUMBER) ? <></> : <>-</>}
          </div>
        </td>
        <td className="">
          <div className={`tableInputSelect ${watch('filter') === 'AS_DEFINED' && ![TABLE_TYPES.BOOL, '_id'].includes(watch('type')) ? '' : '-mt-1'}`}>
            { ![TABLE_TYPES.BOOL, '_id'].includes(watch('type'))
              ? (
                <Controller
                  defaultValue={subRow.filter || null}
                  control={control}
                  name="filter"
                  render={(controlProps) => (
                    <Select
                      dark
                      sizeSmall
                      {...controlProps}
                      placeholder="Default"
                      options={DEFAULT_OPTIONS}
                      disabled={disable.filter}
                      isOptionDisabled={(option) => option.id === 'NULL' && subRow.required}
                      onChange={(value) => {
                        controlProps.onChange(value);
                        onInputChange('filter');
                      }}
                      inputId={`subrow${indexOfRow}${FiledPosition.filter}`}
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
              ) : null}

            { ([TABLE_TYPES.BOOL, '_id'].includes(watch('type')))
              ? (
                <span className="text-center">
                  <Controller
                    defaultValue={subRow.default || null}
                    control={control}
                    name="default"
                    render={(controlProps) => (
                      <Select
                        dark
                        sizeSmall
                        {...controlProps}
                        WrapClassName="mt-1"
                        placeholder="Default value"
                        options={[{ id: 'true', name: 'TRUE' }, { id: 'false', name: 'FALSE' }]}
                        isClearable={watch('type') !== '_id'}
                        disabled={disable.default}
                        onChange={(value) => {
                          controlProps.onChange(value);
                          onInputChange('default');
                        }}
                        inputId={`subrow${indexOfRow}${FiledPosition.default}`}
                        onKeyDown={(e) => {
                          if (e.ctrlKey || e.keyCode === 13) {
                            if (e.keyCode === 13 && controlProps.ref?.current?.state?.menuIsOpen) {
                              return;
                            }
                            onKeyDownHandle(e, 'default');
                            if (e.ctrlKey) e.preventDefault();
                          }
                        }}
                      />
                    )}
                  />
                </span>
              )
              : null}

            {watch('filter') === 'AS_DEFINED'
              && (
              <>
                {
                      (watch('type') === TABLE_TYPES.NUMBER || watch('type') === TABLE_TYPES.PERCENT
                      || watch('type') === TABLE_TYPES.DECIMAL) ? watch('isEnum') ? (
                        <SelectEnumValue
                          defaultValue={subRow?.default}
                          enumObj={watch('enum')}
                          row={subRow}
                          disabled={disable.default}
                          onInputChange={onInputChange}
                          id={`subrow${indexOfRow}${FiledPosition.default}`}
                          onKeyDown={(e) => onKeyDownHandle(e, 'default')}
                        />
                        ) : (
                          <NumberType
                            TABLE_TYPES={TABLE_TYPES}
                            type={watch('type')}
                            disabled={disable.default}
                            id={`subrow${indexOfRow}${FiledPosition.default}`}
                            defaultValue={subRow.default || ''}
                            onInputChange={onInputChange}
                            onKeyDown={onKeyDownHandle}
                          />
                        ) : watch('type') === TABLE_TYPES.STRING && watch('isEnum') ? (
                          <SelectEnumValue
                            defaultValue={subRow?.default}
                            enumObj={watch('enum')}
                            row={subRow}
                            disabled={disable.default}
                            onInputChange={onInputChange}
                            id={`subrow${indexOfRow}${FiledPosition.default}`}
                            onKeyDown={(e) => onKeyDownHandle(e, 'default')}
                          />
                        ) : (watch('type') === TABLE_TYPES.DATE)
                          ? (
                            <DateTime
                              showTimeSelect
                              disabled={disable.default}
                              id={`subrow${indexOfRow}${FiledPosition.default}`}
                              defaultValue={subRow.default}
                              WrapClassName="w-full mt-1"
                              onInputChange={onInputChange}
                              onKeyDown={(e) => onKeyDownHandle(e, 'default')}
                            />
                          ) : (
                            <Controller
                              defaultValue={subRow.default || ''}
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
                                  id={`subrow${indexOfRow}${FiledPosition.default}`}
                                  onKeyDown={(e) => onKeyDownHandle(e, 'default')}
                                />
                              )}
                            />
                          )
                    }
              </>
              )}
          </div>
        </td>
        <td className={TableViewCss.subTableCheckBox}>
          <span className="text-center tableCheck">
            <PrivateCheckbox />
          </span>
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
            { (watch('type') === TABLE_TYPES.NUMBER || watch('type') === TABLE_TYPES.DECIMAL)
              ? (
                <Controller
                  defaultValue={subRow.min || ''}
                  control={control}
                  name="min"
                  render={(controlProps) => (
                    <Input.Number
                      size="small"
                      dark
                      {...controlProps}
                      allowInteger
                      placeholder="Min"
                      disabled={disable.min}
                      onBlur={() => onInputChange('min', controlProps.value)}
                      id={`subrow${indexOfRow}${FiledPosition.minimum}`}
                      onKeyDown={(e) => onKeyDownHandle(e, 'minimum')}
                    />

                  )}
                />
              )
              : (
                <Controller
                  defaultValue={subRow.minLength || ''}
                  control={control}
                  name="minLength"
                  render={(controlProps) => (
                    <Input.Number
                      size="small"
                      dark
                      {...controlProps}
                      placeholder="MinLength"
                      disabled={disable.minLength}
                      onBlur={() => onInputChange('minLength', controlProps.value)}
                      id={`subrow${indexOfRow}${FiledPosition.minimum}`}
                      onKeyDown={(e) => onKeyDownHandle(e, 'minimum')}
                    />

                  )}
                />
              )}
          </div>
        </td>
        <td className="">
          <div className="smallInput">
            {(watch('type') === TABLE_TYPES.NUMBER || watch('type') === TABLE_TYPES.DECIMAL) ? (
              <Controller
                defaultValue={subRow.max || ''}
                control={control}
                name="max"
                render={(controlProps) => (
                  <Input.Number
                    {...controlProps}
                    allowInteger
                    dark
                    size="small"
                    placeholder="Max"
                    disabled={disable.max}
                    onBlur={() => onInputChange('max', controlProps.value)}
                    id={`subrow${indexOfRow}${FiledPosition.maximum}`}
                    onKeyDown={(e) => onKeyDownHandle(e, 'maximum')}
                  />

                )}
              />
            )
              : (
                <Controller
                  defaultValue={subRow.maxLength || ''}
                  control={control}
                  name="maxLength"
                  render={(controlProps) => (
                    <Input.Number
                      dark
                      size="small"
                      {...controlProps}
                      placeholder="MaxLength"
                      disabled={disable.maxLength}
                      onBlur={() => onInputChange('maxLength', controlProps.value)}
                      id={`subrow${indexOfRow}${FiledPosition.maximum}`}
                      onKeyDown={(e) => onKeyDownHandle(e, 'maximum')}
                    />

                  )}
                />
              )}
          </div>
        </td>
        <td className={TableViewCss.subTableCheckBox}>
          <span className="text-center tableCheck">
            <LowerCheckBox />
          </span>
          <span className="text-center tableCheck">
            <TrimCheckBox />
          </span>
          {/*
          <span className="text-center tableCheck">
            <IndexCheckBox />
          </span> */}
        </td>
        <td className="">
          <div className="smallInput">
            <Controller
              defaultValue={subRow.match || ''}
              control={control}
              name="match"
              render={(controlProps) => (
                <Input
                  size="small"
                  dark
                  {...controlProps}
                  placeholder="Pattern"
                  disabled={disable.match}
                  onBlur={() => onInputChange('match', controlProps.value)}
                  id={`subrow${indexOfRow}${FiledPosition.match}`}
                  onKeyDown={(e) => onKeyDownHandle(e, 'match')}
                />
              )}
            />
          </div>
        </td>
      </tr>
    </>
  );
});
export default TableSubRow;
TableSubRow.displayName = 'TableSubRow';
