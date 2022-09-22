import { isEmpty, flatten } from 'lodash';
import React from 'react';
import DropdownTreeSelect from 'react-dropdown-tree-select';
import 'react-dropdown-tree-select/dist/styles.css';
import { ORM_TYPE } from '../../constant/Project/applicationStep';
import { Description } from '../Description';
import { SelectCss } from '../Select/selectCss';

/**
 * mode:multiSelect
hierarchical
simpleSelect
radioSelect
 */

export const defaultAttributes = {
  [ORM_TYPE.MONGOOSE]: {
    _id: { type: 'ObjectId' },
    isActive: { type: 'Boolean' },
    createdAt: { type: 'String' },
    updatedAt: { type: 'String' },
    addedBy: { type: 'ObjectId' },
    updatedBy: { type: 'ObjectId' },
  },
  [ORM_TYPE.SEQUELIZE]: {
    isActive: { type: 'BOOLEAN' },
    createdAt: { type: 'STRING' },
    updatedAt: { type: 'STRING' },
    addedBy: { type: 'STRING' },
    updatedBy: { type: 'STRING' },
  },
};

export const SelectTree = React.memo(({
  placeholder = '',
  disabled,
  label,
  data = {},
  mode = 'multiSelect',
  labelClass,
  handleChange = () => {},
  className = '',
  WrapClassName = '',
  defaultValue = [],
  disabledKey = [], // disable selection for particular key
  noDataMessage = '',
  LeftLabel,
  desc = '',
  error = '',
  id,
  dark,
  size,
  onKeyDown,
  customIconClick = () => {},
  // icon,
  customDataJson = {}, // If  data is custom when data syntax are different

}) => {
  const changeRef = React.useRef({});
  const nodeConversion = React.useCallback((node) => ({ fullName: node?._parentName ? `${node?._parentName}.${node?.label}` : node?.label, singleName: node?.label }), []);
  const handleAttributeChange = ({ currentNode, selectedNode }) => {
    handleChange({
      allSelectedNode: selectedNode?.map((node) => nodeConversion(node)),
      currentSelectedNode: nodeConversion(currentNode),
    });
  };
  changeRef.current = {
    handleAttributeChange,
    defaultValue,
    disabledKey,
  };
  return (
    <div className={WrapClassName}>
      {!!(label || desc)
        && (
        <div className={`${LeftLabel}`}>
          {!!label
          && (
          <div className={labelClass}>
            <label className="mb-1.5 text-primary-text text-sm block w-full font-normal leading-5">{label}</label>
          </div>
          )}
        </div>
        )}
      <div className="SelectTreeDisable">
        <DropDownComponent
          onKeyDown={onKeyDown}
          id={id}
          data={data}
          changeRef={changeRef}
          className={`${className} ${dark && 'darkSelect'} ${size === 'small' && 'smallBox'}`}
          mode={mode}
          noDataMessage={noDataMessage}
          placeholder={placeholder}
          disabled={disabled}
          customDataJson={customDataJson}
          clearData={isEmpty(defaultValue)}
          customIconClick={customIconClick}
          // icon={icon}
          // tagLabel="address.react"
        />
      </div>
      {!!desc
    && <Description className="mt-1">{desc}</Description>}
      {!!error && <span className={SelectCss.erorrClass}>{error}</span>}
    </div>
  );
});
SelectTree.displayName = 'SelectTree';

// expanded
const DropDownComponent = React.memo(({ // icon,
  customIconClick, onKeyDown, changeRef, customDataJson, data, className, mode, placeholder, noDataMessage = '', clearData = false, disabled = false, id,
}) => {
  const [newData, setData] = React.useState({});

  const recursiveTree = (recursiveData, parent = null) => (Object.keys(recursiveData)?.map((mainKey) => (
    recursiveData[mainKey]
   && typeof (recursiveData[mainKey]) === 'object'
    && {
      label: mainKey,
      parent,
      value: mainKey,
      isIcon: recursiveData[mainKey]?.isIcon,
      customKey: recursiveData[mainKey]?.customKey,
      ...(!isEmpty(changeRef.current?.defaultValue) ? {
        expanded: flatten(changeRef.current?.defaultValue?.map((expand) => {
          const parentArray = expand.split('.');
          parentArray.push(parentArray.slice(0, expand.split('.').lastIndexOf('.')).join('.'));
          return parentArray;
        })).includes(parent ? parent + mainKey : mainKey),
      } : {}),
      ...(!isEmpty(changeRef.current.defaultValue) ? { isDefaultValue: changeRef.current.defaultValue?.includes(parent ? `${parent}.${mainKey}` : mainKey) } : {}),
      ...(!isEmpty(changeRef.current.disabledKey) && { disabled: changeRef.current.disabledKey?.includes(parent ? `${parent}.${mainKey}` : mainKey) }),
      ...(Object.values(recursiveData[mainKey])?.findIndex((value) => typeof (value) === 'object') > -1
        ? {
          children: recursiveTree(recursiveData[mainKey], parent ? `${parent}.${mainKey}` : mainKey),
        } : {}), // If Object key value pair
      ...(Array.isArray(recursiveData[mainKey]) ? { children: recursiveTree({ ...recursiveData[mainKey]?.[0] }, parent ? `${parent}.${mainKey}` : mainKey) } : {}), // If array key value pair
    }))).filter((el) => el && el);

  React.useEffect(() => {
    setData(isEmpty(customDataJson) ? recursiveTree(data) : customDataJson);
  }, [changeRef.current?.defaultValue, clearData]);

  return (
    <DropdownTreeSelect
      onKeyDown={onKeyDown}
      id={id}
      onFocus={() => { setData(isEmpty(customDataJson) ? recursiveTree(data) : customDataJson); }}
      mode={mode}
      className={`select-tree ${className}`}
      data={newData}
      disabled={disabled}
      texts={{ placeholder, noMatches: noDataMessage }}
      onChange={changeRef.current.handleAttributeChange}
      noData={isEmpty(data) && isEmpty(customDataJson)}
      customIconClick={customIconClick}
      // icon={icon}
    />
  );
});
DropDownComponent.displayName = 'DropDownComponent';
