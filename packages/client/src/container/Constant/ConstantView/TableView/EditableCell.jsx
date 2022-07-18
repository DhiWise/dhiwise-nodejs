/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { useSelector } from 'react-redux';
import Popover from 'react-popover';
import { uniq } from 'lodash';
import { Icons } from '@dhiwise/icons';
import { Input, Select } from '../../../../components';
import { InputCss } from '../../../../components/Input/inputCss';
import { CONSTANT_GENERATE_TYPE, NODE_DATA_TYPE, NODE_DATA_TYPE_OPTION } from '../../../../constant/applicationConstant';
import { useBoolean } from '../../../hooks';
import { keyBoardShortcut } from '../../../../utils/domMethods';
import { modelAttrRegex, removeLeadingSpace } from '../../../../utils/regex';
import { MAX_INPUT_FIELD_LIMIT } from '../../../../constant/common';

const TotalColumns = 3;
const ArrayOfValue = ({
  onChange, defaultValue = [], isDisable, id, onKeyDown, dark,
}) => {
  const [value, setValue] = React.useState('');
  const [multiValue, setMulti] = React.useState(defaultValue || []);
  const [isMore, setMore, removeMore] = useBoolean(false);
  React.useEffect(() => {
    setMulti(defaultValue || []);
  }, [defaultValue]);
  return (
    <div className=" flex">
      <input
        disabled={isDisable}
        value={value}
        id={id}
        name="value"
        className={`${InputCss.inputBlock} ${dark && InputCss.darkInput} px-2 truncate inputBlock flex`}
        style={{ height: '36px', width: '180px' }}
          // className={`${InputCss.inputBlock} py-1.5 px-2.5 truncate  inputBlock`}
        onChange={(e) => {
          setValue(e.target.value.replace(removeLeadingSpace, ''));
        }}
        placeholder="press `Enter` after input."
        onKeyDown={(e) => {
          onKeyDown(e);
          if (e.code === 'Enter' && e.target.value) {
            const multiValueDemo = [...multiValue];
            const arrayValue = e.target.value;
            // if typef number than store like number
            multiValueDemo.unshift(+arrayValue ? +arrayValue : arrayValue);
            setMulti(uniq(multiValueDemo));
            onChange(uniq(multiValueDemo));
            setValue('');
          }
        }}
      />
      <div className="flex items-center ml-2">
        {multiValue?.slice(0, 2)?.map?.((v) => (
          <>
            <div key={v} className="border-gray-100 border-1 rounded-3 text-xs text-primary-text w-max-w flex items-center my-1 py-0.5 mx-0.5">
              <span className="px-2 truncate block">{v}</span>
              <div
                className="w-2 h-2 mr-2 cursor-pointer"
                onClick={() => {
                  const mulValue = multiValue.findIndex((multiv) => multiv === v);
                  const deleteMul = [...multiValue];
                  deleteMul.splice(mulValue, 1);
                  setMulti([...deleteMul]);
                  onChange([...deleteMul]);
                }}
              >
                <Icons.Close />
              </div>
            </div>
          </>
        ))}
        { multiValue.length > 2 && (
        <Popover
          isOpen={isMore}
          body={[
            <div key={id} className="flex items-center cursor-pointer flex-wrap">
              {multiValue.slice(2)?.map?.((v) => (
                <div key={v} className="border-gray-100 bg-gray-200 border-1 rounded-3 text-xs text-primary-text w-max-w flex items-center my-1 py-0.5 mx-0.5">
                  <span className="px-2 truncate block">{v}</span>
                  <div
                    className="w-2 h-2 mr-2 cursor-pointer"
                    onClick={() => {
                      const mulValue = multiValue.findIndex((multiv) => multiv === v);
                      multiValue.splice(mulValue, 1);
                      setMulti([...multiValue]);
                      onChange([...multiValue]);
                    }}
                  >
                    <Icons.Close />
                  </div>

                </div>
              ))}
            </div>,
          ]}
          onOuterAction={removeMore}
          style={{ maxWidth: '500px' }}
          className="popupCustom"
        >
          <div className="text-primary hover:underline ml-1 cursor-pointer" onClick={setMore}>More</div>
        </Popover>
        )}
      </div>
    </div>
  );
};

const ValueComponent = ({
  type, value, onChange, isDisable, dark = false, id, onKeyDown,
}) => {
  switch (type) {
    case 'string':
      return (
        <div style={{ width: '180px' }}>
          <Input
            disabled={isDisable}
            id={id}
            name="value"
            onKeyDown={onKeyDown}
            dark={dark}
            placeholder="Value"
            onChange={onChange}
            value={value || ''}
            size="small"
          />
        </div>
      );
    case 'number': return (
      <div style={{ width: '180px' }}>
        <Input.Decimal
          placeholder="Value"
          disabled={isDisable}
          id={id}
          name="value"
          onKeyDown={onKeyDown}
          dark={dark}
          size="small"
          fixLength={20}
          value={![null, undefined].includes(value) ? value.toString() : ''}
          onChange={(val) => {
            onChange(val ? +val : null);
          }}
        />
      </div>
    );
    case 'array': return (
      <ArrayOfValue
        onChange={onChange}
        onKeyDown={onKeyDown}
        id={id}
        isDisable={isDisable}
        dark={dark}
        defaultValue={value}
      />
      // <TagNameSelect
      //   isMulti
      //   options={[]}
      //   onChange={(val) => {
      //     console.log('value', val);
      //     setState();
      //   }}
      // />
    );
    default:
      return <div style={{ width: '180px' }}>-</div>;
  }
};

function EditableCell({
  value: initialValue,
  row: { index, original },
  column: { id },
  onInputChange,
  totalRowCount,
  ...rest
}) {
  const FiledPosition = {
    attribute: +original?.focusIndex + 1,
    type: +original?.focusIndex + 2,
    value: +original?.focusIndex + 3,
  };
  const handleAutoFocus = (focusFiled) => {
    const field = document.querySelector(`#r${FiledPosition[focusFiled]}`);
    field?.focus();
  };
  const onKeyDownHandel = (e, focusField) => {
    keyBoardShortcut({
      keyEvent: e,
      focusIndex: FiledPosition[focusField || e.target.name],
      totalColumns: TotalColumns,
      totalRows: +totalRowCount,
    });
  };
  const [value, setValue] = React.useState(initialValue);
  const isDisable = useSelector(({ constants }) => constants.constantList.find((d) => d._id === constants.currentId)?.type === CONSTANT_GENERATE_TYPE.AUTO);
  // const onBlur = () => {
  //   onInputChange(index, id, value);
  // };
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onChange = (val, focusFiled) => {
    if (value === val) return;
    setValue(val);
    onInputChange(index, id, val, rest?.mainRowIndex);
    if (focusFiled === 'type' && val === NODE_DATA_TYPE.JSON) return;
    requestAnimationFrame(() => {
      if (focusFiled) handleAutoFocus(focusFiled); // manage auto focus
    });
  };
  switch (id) {
    case 'attribute': return (
      <div className="w-48">
        <Input
          {...(rest?.isSubRow && { dark: true })}
          size="small"
          disabled={isDisable}
          customRegex={modelAttrRegex}
          name="attribute"
          onKeyDown={onKeyDownHandel}
          id={`r${FiledPosition.attribute}`}
          // dark
          maxLength={MAX_INPUT_FIELD_LIMIT.key}
          defaultValue={initialValue}
          value={value}
          placeholder="Key"
          onChange={(e) => { onChange(e, 'attribute'); }}
        />
      </div>
    );
    case 'type': return (
      <div className="w-48">
        <Select
          sizeSmall
          {...(rest?.isSubRow && { dark: true })}
          valueKey="value"
          onKeyDown={(e) => {
            if (e.ctrlKey || e.keyCode === 13) {
              onKeyDownHandel(e, 'type');
              if (e.ctrlKey) e.preventDefault();
            }
          }}
          disabled={isDisable}
          inputId={`r${FiledPosition.type}`}
          isClearable={false}
          defaultValue={initialValue}
          value={value}
          options={rest?.isSubRow ? NODE_DATA_TYPE_OPTION.filter((opt) => opt.value !== NODE_DATA_TYPE.JSON) : NODE_DATA_TYPE_OPTION}
          onChange={(e) => { onChange(e, 'type'); }}
        />
      </div>
    );
    case 'value': return (
      <ValueComponent
        isDisable={isDisable}
        onKeyDown={onKeyDownHandel}
        type={original.type}
        id={`r${FiledPosition.value}`}
        {...(rest?.isSubRow && { dark: true })}
        value={value}
        onChange={(e) => { onChange(e, 'value'); }}

      />

    );

    default: return null;
  }
}

export default EditableCell;
