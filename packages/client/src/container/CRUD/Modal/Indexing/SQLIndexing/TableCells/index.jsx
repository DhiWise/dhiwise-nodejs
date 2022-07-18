/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import omitDeep from 'omit-deep-lodash';
import {
  Select, Input, SelectTree, Checkbox,
} from '../../../../../../components';
import {
  getAssignOperatorOpts, getOperatorOpts, SQL_INDEX, getCollateOpts, SQL_TYPE_OPTIONS, MONGO_TYPE_OPTIONS,
} from '../../../../../../constant/modelIndexing';
import { modelAttrRegex } from '../../../../../../utils/regex';
import { regex } from '../../../../../../components/utils';
import { useEditor } from '../../../Editor/EditorProvider';
import { MAX_INPUT_FIELD_LIMIT } from '../../../../../../constant/common';
import { DB_TYPE, MONGODB_INDEX_NAME_LENGTH } from '../../../../../../constant/model';

// Index Name
export const NameCell = React.memo(({
  onKeyDown, ...otherProps
}) => (
  <div className="min-w-40 w-full">
    <Input
      size="small"
      placeholder="Enter index name"
      customRegex={modelAttrRegex}
      {...otherProps}
      maxLength={otherProps?.isMongoDb ? MONGODB_INDEX_NAME_LENGTH : MAX_INPUT_FIELD_LIMIT.title}
      onKeyDown={(e) => onKeyDown(e, 'name')}
    />
  </div>
));
NameCell.displayName = 'NameCell';
// Index Type
// const TYPE_OPT = getTypeOptions(SQL_INDEX.TYPE) || [];
export const TypeCell = React.memo(({
  onKeyDown, id, ...otherProps
}) => {
  const cellRef = React.useRef(null);
  return (
    <div className="text-left min-w-40 w-full">
      <Select
        ref={cellRef}
        sizeSmall
        placeholder="Enter data type"
        isClearable={false}
        options={SQL_TYPE_OPTIONS.filter((option) => (option))}
        inputId={id}
        {...otherProps}
        onKeyDown={(e) => {
          if (e.ctrlKey || e.keyCode === 13) {
            if (e.keyCode === 13 && cellRef?.current?.state?.menuIsOpen) { return; }
            onKeyDown(e, 'indexType');
            if (e.ctrlKey) e.preventDefault();
          }
        }}
      />
    </div>
  );
});
TypeCell.displayName = 'TypeCell';
// Model Attribute
export const MultiAttrCell = React.memo(({
  value, onChange, onKeyDown, ...otherProps
}) => {
  const { code, dbType } = useEditor();
  const options = omitDeep(JSON.parse(code), dbType === DB_TYPE.MONGODB ? '_id' : 'id');

  const handleChange = (val) => {
    onChange(val?.allSelectedNode?.map((node) => node?.fullName));
  };

  return (
    <>
      <SelectTree
        placeholder="Select attribute"
        noDataMessage="No options found. Please enter model schema"
        size="small"
        data={options}
        defaultValue={value || []} // set value in array as per package
        handleChange={handleChange}
        {...otherProps}
        onKeyDown={(e) => {
          if (e.ctrlKey || e.keyCode === 13) { // 40 is arrow down
            onKeyDown(e, 'fields');
            if (e.keyCode === 13 || e.keyCode === 40) {
              return;
            }
            if (e.ctrlKey || e.keyCode === 13) { e.preventDefault(); }
          }
        }}
      />
    </>
  );
});
MultiAttrCell.displayName = 'MultiAttrCell';
// Model Attribute
export const SingleAttrCell = React.memo(({
  value, onChange, onKeyDown, ...otherProps
}) => {
  const { code, dbType } = useEditor();
  const options = omitDeep(JSON.parse(code), dbType === DB_TYPE.MONGODB ? '_id' : 'id');

  const handleChange = (val) => {
    onChange(val?.allSelectedNode?.[0]?.fullName);
  };

  return (
    <div className="min-w-40">
      <SelectTree
        dark
        mode="radioSelect"
        placeholder="Select attribute"
        noDataMessage="No options found. Please enter model schema"
        size="small"
        data={options}
        defaultValue={value ? [value] : []} // set value in array as per package
        handleChange={handleChange}
        {...otherProps}
        onKeyDown={(e) => {
          if (e.ctrlKey || e.keyCode === 13) { // 40 is arrow down
            onKeyDown(e, 'attribute');
            if (e.keyCode === 13 || e.keyCode === 40) {
              return;
            }
            if (e.ctrlKey || e.keyCode === 13) { e.preventDefault(); }
          }
        }}
      />
    </div>
  );
});
SingleAttrCell.displayName = 'SingleAttrCell';
// Order Type
export const OrderTypeCell = React.memo(({
  onKeyDown, id, ...otherProps
}) => {
  const cellRef = React.useRef(null);
  return (
    <div className="min-w-40 text-left">
      <Select
        isClearable
        dark
        sizeSmall
        placeholder="Select order type "
        options={SQL_INDEX.ORDER_TYPE_OPTIONS}
        inputId={id}
        {...otherProps}
        onKeyDown={(e) => {
          if (e.ctrlKey || e.keyCode === 13) {
            if (e.keyCode === 13 && cellRef?.current?.state?.menuIsOpen) { return; }
            onKeyDown(e, 'order');
            if (e.ctrlKey) e.preventDefault();
          }
        }}
      />
    </div>
  );
});
OrderTypeCell.displayName = 'OrderTypeCell';
// Length
export const LengthCell = React.memo(({
  onKeyDown, ...otherProps
}) => (
  <div className="min-w-40">
    <Input
      dark
      size="small"
      placeholder="Enter length(> 0)"
      {...otherProps}
      customRegex={regex.notZeroPositive}
      value={otherProps.value ? otherProps.value.toString() : ''}
      onChange={(val) => otherProps?.onChange(Number(val))}
      onKeyDown={(e) => onKeyDown(e, 'length')}
    />

  </div>
));
LengthCell.displayName = 'LengthCell';
// Value
export const ValueCell = React.memo(({
  onKeyDown, ...otherProps
}) => (
  <div className="min-w-40">
    <Input
      dark
      size="small"
      placeholder="Enter value"
      {...otherProps}
      onKeyDown={(e) => onKeyDown(e, 'value')}
    />

  </div>
));
ValueCell.displayName = 'ValueCell';
// Collate
export const CollateCell = React.memo(({
  onKeyDown, id, ...otherProps
}) => {
  const TYPE_OPT = getCollateOpts() || [];
  return (
    <div className="min-w-40">
      <Select
        dark
        sizeSmall
        placeholder="Select Collate"
        isClearable
        options={TYPE_OPT}
        inputId={id}
        {...otherProps}
        onKeyDown={(e) => onKeyDown(e, 'fields')}
      />
    </div>
  );
});
CollateCell.displayName = 'CollateCell';
// Assignment Operator (>,<)
export const AssignmentOperatorCell = React.memo(({
  defaultValue, onInputChange, onKeyDown, id, ...otherProps
}) => {
  const TYPE_OPT = getAssignOperatorOpts() || [];
  const cellRef = React.useRef(null);
  return (
    <div className="min-w-40">
      <Select
        WrapClassName="mt-1"
        dark
        sizeSmall
        isClearable
        placeholder="Select operators"
        options={TYPE_OPT}
        value={defaultValue}
        inputId={id}
        {...otherProps}
        onKeyDown={(e) => {
          if (e.ctrlKey || e.keyCode === 13) {
            if (e.keyCode === 13 && cellRef?.current?.state?.menuIsOpen) { return; }
            onKeyDown(e, 'operator');
            if (e.ctrlKey) e.preventDefault();
          }
        }}
      />
    </div>
  );
});
AssignmentOperatorCell.displayName = 'AssignmentOperatorCell';
// Operator (>,<)
export const OperatorCell = React.memo(({
  onKeyDown, ...otherProps
}) => {
  const TYPE_OPT = getOperatorOpts() || [];
  const cellRef = React.useRef(null);
  return (
    <div className="">
      <Select
        dark
        size="small"
        placeholder="Select operator"
        options={TYPE_OPT}
        {...otherProps}
        onKeyDown={(e) => {
          if (e.ctrlKey || e.keyCode === 13) {
            if (e.keyCode === 13 && cellRef?.current?.state?.menuIsOpen) { return; }
            onKeyDown(e, 'operator');
            if (e.ctrlKey) e.preventDefault();
          }
        }}
      />
    </div>
  );
});
OperatorCell.displayName = 'OperatorCell';
// *******MONGO DB******

// TTL
export const TTLCell = React.memo(({
  onChange, onKeyDown, value, ...otherProps
}) => (
  <>
    <Checkbox
      wrapClass=" flex-shrink-0"
      checked={!!value}
      {...otherProps}
      onChange={(val) => onChange(val, 'ttl')}
      onKeyDown={(e) => {
        if (e.keyCode === 13) {
          onChange(!e?.target?.checked, 'ttl');
        } else onKeyDown(e, 'ttl');
      }}
    />
  </>
));
TTLCell.displayName = 'TTLCell';
// TTL Input in seconds
export const InputTTLCell = React.memo(({
  onChange, value, onKeyDown, ...otherProps
}) => (
  <>
    <Input.Number
      WrapClassName="flex-grow mr-12"
      size="small"
      extetion="Seconds"
      {...otherProps}
      value={value ? value.toString() : ''}
      onChange={(val) => onChange(Number(val), 'expireAfterSeconds')}
      onKeyDown={(e) => onKeyDown(e, 'expireAfterSeconds')}
    />
  </>
));
InputTTLCell.displayName = 'InputTTLCell';

// Unique index
export const UniqueCell = React.memo(({
  value, onChange, onKeyDown, ...otherProps
}) => (
  <>
    <div className="w-full min-w-40  pr-6 min-w-max text-left">
      <Checkbox
        checked={!!value}
        {...otherProps}
        onChange={(val) => onChange(val, 'unique')}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            onChange(!e?.target?.checked, 'unique');
          } else { onKeyDown(e, 'unique'); }
        }}
      />
    </div>
  </>
));
UniqueCell.displayName = 'UniqueCell';
// Index Type
export const MongoIndexTypeCell = React.memo(({
  onKeyDown, id, ...otherProps
}) => {
  const cellRef = React.useRef(null);
  return (
    <div className="w-full min-w-40">
      <Select
        WrapClassName="w-full"
        sizeSmall
        dark
        ref={cellRef}
        placeholder="Select index type"
        isClearable={false}
        options={MONGO_TYPE_OPTIONS}
        inputId={id}
        {...otherProps}
        onKeyDown={(e) => {
          if (e.ctrlKey || e.keyCode === 13) {
            if (e.keyCode === 13 && cellRef?.current?.state?.menuIsOpen) { return; }
            onKeyDown(e, 'type');
            if (e.ctrlKey) e.preventDefault();
          }
        }}
      />
    </div>
  );
});
MongoIndexTypeCell.displayName = 'MongoIndexTypeCell';
