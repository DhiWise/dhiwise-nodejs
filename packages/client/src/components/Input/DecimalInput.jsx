import React, { forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { regex } from '../utils';
import { InputCss } from './inputCss';
import { Description } from '../Description';

const getFormattedValue = (value = '', regexToValidate) => (value.replace(regexToValidate, ''));

/**
 * Primary UI component for Input
 */

export const MAX_VALUE = {
  DOUBLE: 1.79769313486231570e+308,
  FLOAT: 3.40282346638528860e+38,
};

export const DecimalInput = forwardRef(({
  wrapperClass = '',
  label = '',
  placeholder = '',
  disabled = false,
  error = '',
  onChange = () => { },
  value = '',
  WrapClassName,
  inputClassName = '',
  fixLength,
  size = 'normal',
  desc,
  dark,
  maxValue,
  allowPosNeg = false, // allow positive negative both value
  ...restProps
}, ref) => {
  const regexToValidate = allowPosNeg ? regex.posNegDecimalFloatDouble : regex.decimalFloatDouble;
  // const [internalValue, setInternalValue] = React.useState(getFormattedValue(value));
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
      else setInternalValue(getFormattedValue(value, regexToValidate));
    }
    if (maxValue) {
      if ((value <= MAX_VALUE[maxValue])) setNumValue();
    } else if (fixLength) {
      if ((value?.length <= fixLength)) setNumValue();
    } else setNumValue();
  }, [value, fixLength, maxValue]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (!newValue || regexToValidate.test(`${newValue}`)) {
      if (maxValue) {
        if ((value <= MAX_VALUE[maxValue])) {
          setInternalValue(newValue);
          onChange && onChange(newValue);
        }
      } else if (fixLength) {
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
      {
        !!label && <label className={InputCss.inputLabel}>{label}</label>
      }
      {!!desc
        && <Description className={InputCss.desc}>{desc}</Description>}
      <div className={InputCss.inputWrapperClass}>
        <input
          className={`${InputCss.inputBlock} ${sizeCss} ${dark && InputCss.darkInput} ${disableClass} inputBlock`}
          onChange={handleChange}
          type="number"
          ref={ref}
          disabled={disabled}
          placeholder={placeholder}
          value={internalValue}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...restProps}
        />
        {!!error && <span className={InputCss.errorClass}>{error}</span>}
      </div>
    </div>
  );
});
DecimalInput.displayName = 'DecimalInput';
DecimalInput.propTypes = {
  /**
   * Input label
   */
  label: PropTypes.string,
  size: PropTypes.oneOf(['normal', 'small']),
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

DecimalInput.defaultProps = {
  label: '',
  error: '',
  disabled: false,
};
