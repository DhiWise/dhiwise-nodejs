/* eslint-disable react/jsx-props-no-spreading */
import { uniqBy } from 'lodash';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Select, Datepicker, Input,
} from '../../../../../../components';

export const LocalFields = ({
  localField, localRef, onInputChange, rowObj, onKeyDown, id, disabled,
}) => {
  const {
    control, setValue, watch,
  } = useForm({
    shouldUnregister: false,
  });
  const [options, setOptions] = React.useState([]);

  useEffect(() => {
    const temp = [{ id: '_id', name: '_id' }];
    localRef.map((x) => {
      if (x !== rowObj?.attr) temp.push({ id: x, name: x });
      return x;
    });
    setOptions(temp);
  }, [localRef, rowObj]);

  useEffect(() => setValue('localField', localField || '_id'), [localField]);

  return (
    <>

      <Controller
        control={control}
        name="localField"
        render={(controlProps) => (
          <Select
            WrapClassName="mt-1"
            sizeSmall
            {...controlProps}
            isClearable={false}
            placeholder="Select local field"
            options={uniqBy(options, 'id')}
            onChange={(value) => {
              controlProps.onChange(value);
              onInputChange('localField', watch('localField'));
            }}
            onKeyDown={(e) => {
              if (e.ctrlKey || e.keyCode === 13) {
                if (e.keyCode === 13 && controlProps.ref?.current?.state?.menuIsOpen) {
                  return;
                }
                onKeyDown(e, 'localField');
                if (e.ctrlKey) e.preventDefault();
              }
            }}
            inputId={id}
            disabled={disabled}
          />

        )}
      />
    </>
  );
};

export const InnerType = ({
  innerDataType, TYPE_OPTIONS, onInputChange, onKeyDown, id, disabled,
}) => {
  const {
    control, setValue, watch,
  } = useForm({
    shouldUnregister: false,
  });

  useEffect(() => setValue('innerDataType', innerDataType), [innerDataType]);

  return (
    <>
      <Controller
        control={control}
        name="innerDataType"
        render={(controlProps) => (
          <Select
            WrapClassName="mt-1"
            sizeSmall
            {...controlProps}
            isClearable
            placeholder="Select inner type"
            options={TYPE_OPTIONS || []}
            onChange={(value) => {
              controlProps.onChange(value);
              onInputChange('innerDataType', watch('innerDataType'));
            }}
            onKeyDown={(e) => {
              if (e.ctrlKey || e.keyCode === 13) {
                if (e.keyCode === 13 && controlProps.ref?.current?.state?.menuIsOpen) {
                  return;
                }
                onKeyDown(e, 'innerDataType');
                if (e.ctrlKey) e.preventDefault();
              }
            }}
            inputId={id}
            disabled={disabled}
          />
        )}
      />
    </>
  );
};

export const DateTime = ({
  defaultValue, onInputChange, onKeyDown, id, disabled, showTimeSelect,
}) => {
  const { control, setValue } = useForm({
    shouldUnregister: false,
  });

  useEffect(() => setValue('default', defaultValue), [defaultValue]);

  return (
    <>
      <Controller
        control={control}
        name="default"
        render={(controlProps) => (
          <Datepicker
            showTimeSelect={showTimeSelect}
            WrapClassName="mt-1"
            sizeSmall
            {...controlProps}
            isClearable
            size="small"
            placeholder="Select date"
            onChange={(value) => {
              controlProps.onChange(value);
              onInputChange('default', value);
            }}
            onKeyDown={(e) => {
              if (e.ctrlKey || e.keyCode === 13) {
                if (e.keyCode === 13 && controlProps.ref?.current?.state?.menuIsOpen) {
                  return;
                }
                onKeyDown(e, 'default');
                if (e.ctrlKey) e.preventDefault();
              }
            }}
            id={id}
            disabled={disabled}
          />
        )}
      />
    </>
  );
};

export const NumberType = ({
  onInputChange, onKeyDown, id, disabled, defaultValue, type, TABLE_TYPES,
}) => {
  const { control, setValue } = useForm({
    shouldUnregister: false,
  });

  useEffect(() => setValue('default', defaultValue), [defaultValue]);

  const inputProps = {
    size: 'small',
    placeholder: 'Default value',
    WrapClassName: 'w-full mt-1',
    disabled,
    id,
    onKeyDown: (e) => onKeyDown(e, 'default'),
  };

  return (
    <>
      <Controller
        control={control}
        name="default"
        render={(controlProps) => (([TABLE_TYPES.FLOAT, TABLE_TYPES.DOUBLE, TABLE_TYPES.DECIMAL,
          TABLE_TYPES.REAL].includes(type)) ? (
            <Input.Decimal
              {...inputProps}
              allowPosNeg
              value={controlProps.value ? controlProps.value.toString() : ''}
              onChange={(val) => controlProps?.onChange(val === undefined ? undefined : Number(val))}
              onBlur={() => onInputChange('default', controlProps.value === undefined ? undefined : Number(controlProps.value))}
              fixLength={20}
            />
          ) : (
            <Input.Number
              {...inputProps}
              allowInteger
              value={controlProps.value || controlProps.value === 0 ? controlProps.value.toString() : ''}
              onChange={(val) => controlProps?.onChange(val === undefined ? undefined : Number(val))}
              onBlur={() => onInputChange('default', controlProps.value === undefined ? undefined : Number(controlProps.value))}
            />
          ))}
      />
    </>
  );
};
