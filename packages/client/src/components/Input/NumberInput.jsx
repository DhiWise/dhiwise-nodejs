import React, { forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { regex } from '../utils';
import { InputCss } from './inputCss';
import { Description } from '../Description';

const getFormattedValue = (value = '', customRegex, regexToValidate) => (customRegex ? value.replace(customRegex, '') : value.replace(regexToValidate, ''));

/**
 * Primary UI component for Input
 */
export const NumberInput = forwardRef(({
  wrapperClass = '',
  label = '',
  placeholder = '',
  type = 'text',
  disabled = false,
  error = '',
  onChange = () => { },
  value = '',
  WrapClassName,
  inputClassName = '',
  className,
  fixLength,
  desc,
  size = 'normal',
  dark,
  customRegex,
  extetion,
  allowInteger = false,
  ...restProps
}, ref) => {
  const regexToValidate = allowInteger ? regex.integer : regex.positive;
  // const [internalValue, setInternalValue] = React.useState(getFormattedValue(value, customRegex));
  const [internalValue, setInternalValue] = React.useState();

  const wrapperClasses = ['spark-input'];
  const inputClasses = [InputCss.inputBlock];
  const disableClass = disabled ? `${InputCss.inputdisabled}` : '';

  if (error) {
    wrapperClasses.push('spark-error-wrapper');
  }
  if (wrapperClass) {
    wrapperClasses.push(wrapperClass);
  }
  if (inputClassName) {
    inputClasses.push(inputClassName);
  }

  useEffect(() => {
    function setNumValue() {
      if (regexToValidate.test(`${value}`)) setInternalValue(value);
      else setInternalValue(getFormattedValue(value, customRegex, regexToValidate));
    }
    if (fixLength) {
      if ((value?.length <= fixLength)) setNumValue();
    } else setNumValue();
  }, [value, fixLength, customRegex]);

  // useEffect(() => {
  //   onChange && onChange(internalValue);
  // }, [internalValue]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (!newValue || (regexToValidate.test(`${newValue}`))) {
      if (fixLength) {
        if (newValue.length <= fixLength) {
          setInternalValue(newValue);
          onChange && onChange(newValue);
        }
      } else {
        setInternalValue(newValue);
        onChange && onChange(newValue);
      }
    }
  };
  const sizeCss = `${InputCss[[`input${size}`]]}`;

  return (
    <div className={[wrapperClasses, WrapClassName].join(' ')}>
      {!!(label || desc) && (
      <div className="">
        {
        !!label && <label className={InputCss.inputLabel}>{label}</label>
      }
      </div>
      )}
      <div className={`${className} ${InputCss.inputWrapperClass}`}>
        <div className="relative">
          <input
            className={`${InputCss.inputBlock} ${inputClassName} ${sizeCss} ${dark && InputCss.darkInput} ${disableClass} inputBlock`}
            onChange={handleChange}
            type={type}
            ref={ref}
            disabled={disabled}
            placeholder={placeholder}
            value={internalValue}
          // eslint-disable-next-line react/jsx-props-no-spreading
            {...restProps}
          />
          {!!extetion && <div className={InputCss.extenstionText}>{extetion}</div>}
        </div>
      </div>
      {!!desc
        && <Description className={InputCss.desc}>{desc}</Description>}
      {!!error && <span className={InputCss.errorClass}>{error}</span>}
    </div>
  );
});
NumberInput.displayName = 'NumberInput';
NumberInput.propTypes = {
  /**
   * Input label
   */
  label: PropTypes.string,
  size: PropTypes.oneOf(['normal', 'small', 'medium']),
  /**
   * class which wraps whole component, label and input
   */
  wrapperClass: PropTypes.string,
  /**
   * class which wraps input
   */
  inputWrapperClass: PropTypes.string,
  /**
   * does input have any error
   */
  error: PropTypes.string,
  /**
   * is Input disabled
   */
  disabled: PropTypes.bool,
  /**
   * Helper text class
   */
  errorClass: PropTypes.string,
};

NumberInput.defaultProps = {
  label: '',
  error: '',
  disabled: false,
};
