/* eslint-disable react/jsx-props-no-spreading */
import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Select,
} from '../../../../../../components';

export const SelectEnumValue = ({
  onInputChange, enumObj, disabled, id, onKeyDown, defaultValue,
}) => {
  const selectRef = React.useRef(null);
  const [enumValue, setEnumValue] = React.useState();
  const constantList = useSelector((state) => state.constants.constantList);
  const [options, setOptions] = useState([]);

  React.useMemo(() => {
    if (!enumObj?.enumFile || !enumObj?.enumAttribute || !constantList) return;
    const valOpt = [];
    constantList.map((c) => {
      if (c) {
        if (c?.fileName === enumObj?.enumFile && c?.customJson) {
        // Object.keys(c.customJson)?.map((y) => {
          const attrArr = enumObj?.enumAttribute.split('.');
          let obj = c.customJson || {};
          attrArr.map((a) => {
            obj = obj[a];
            return a;
          });

          if (!isEmpty(obj)) {
            Object.keys(obj).map((v) => {
              valOpt.push({ id: obj[v], name: v });
              return v;
            });
          }
        }
      }
      return c;
    });

    setOptions(valOpt);
  }, [enumObj?.enumFile, enumObj?.enumAttribute, constantList]);

  React.useMemo(() => {
    if (enumValue && !options?.find((x) => x.id === enumValue)) {
      onInputChange('enum', {
        ...enumObj, default: undefined,
      });
      onInputChange('default', '');
    }
  }, [constantList]);

  // React.useEffect(() => { setEnumValue(row?.default); }, [row?.default]);
  React.useEffect(() => { setEnumValue(defaultValue); }, [defaultValue]);

  const handleChange = React.useCallback((value) => {
    setEnumValue(value);
    onInputChange('default', value);
    onInputChange('enum', { ...enumObj, default: options.find((x) => x.id === value)?.name });
  }, [onInputChange, enumObj, options]);

  return (
    <>
      <Select
        ref={selectRef}
        disabled={disabled}
        name="default"
        sizeSmall
        placeholder="Select Default value"
        WrapClassName="w-full mt-1"
        options={options}
        value={enumValue !== undefined && enumValue !== null && options?.find((x) => x.id === enumValue) ? enumValue : null}
        onChange={handleChange}
        inputId={id}
        onKeyDown={(e) => {
          if (e.ctrlKey || e.keyCode === 13) {
            if (e.keyCode === 13 && selectRef?.current?.state?.menuIsOpen) {
              return;
            }
            onKeyDown(e);
            if (e.ctrlKey) e.preventDefault();
          }
        }}
      />
    </>
  );
};
