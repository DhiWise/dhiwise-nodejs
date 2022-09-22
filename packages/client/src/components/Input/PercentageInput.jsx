import React, { forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { regex } from '../utils';
import { InputCss } from './inputCss';
import { Description } from '../Description';

const getFormattedValue = (value) => value.replace(regex.percentage, '');

/**
 * Primary UI component for Input
 */
export const PercentageInput = forwardRef(({
  wrapperClass = '',
  inputWrapperClass = 'spark-input-wrapper',
  label = '',
  placeholder = '',
  type = 'text',
  disabled = false,
  errorClass = 'spark-input-error-text',
  error = '',
  desc,
  onChange = () => { },
  value = '',
  ...restProps
}, ref) => {
  const [internalValue, setInternalValue] = React.useState(() => getFormattedValue(value));

  const wrapperClasses = ['spark-input'];
  if (error) {
    wrapperClasses.push('spark-error-wrapper');
  }
  if (wrapperClass) {
    wrapperClasses.push(wrapperClass);
  }

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    onChange && onChange(internalValue);
  }, [internalValue]);

  const handleChange = (e) => {
    let currentValue = e.target.value;

    if (currentValue === '.') { currentValue = '0.'; }
    const isDot = currentValue.indexOf('.') === (currentValue.length - 1);
    const intValue = +currentValue;
    if (isDot || (!Number.isNaN(intValue) && (intValue >= 0 && intValue <= 100))) {
      const formatted = currentValue.match(/^\d+\.?\d{0,2}/);
      setInternalValue((formatted && formatted[0]) || '');
    }
  };

  return (
    <div className={wrapperClasses.join(' ')}>
      {!!(label || desc) && (
      <div className="">
        {
        !!label && <label className={InputCss.inputLabel}>{label}</label>
      }
      </div>
      )}
      <div className={inputWrapperClass}>
        <input
          onChange={handleChange}
          type={type}
          ref={ref}
          disabled={disabled}
          placeholder={placeholder}
          value={internalValue}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...restProps}
        />
      </div>
      {!!desc
    && <Description className={InputCss.desc}>{desc}</Description>}
      {!!error && <span className={errorClass}>{error}</span>}
    </div>
  );
});
PercentageInput.displayName = 'PercentageInput';
PercentageInput.propTypes = {
  /**
   * Input label
   */
  label: PropTypes.string,
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

PercentageInput.defaultProps = {
  label: '',
  error: '',
  disabled: false,
};
