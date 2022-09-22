import React, { forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { regex } from '../utils';
import { InputCss } from './inputCss';

const getFormattedValue = (value) => value.replace(regex.negative, '');

/**
 * Primary UI component for Input
 */
export const NegativeInput = forwardRef(({
  wrapperClass = '',
  inputWrapperClass = 'spark-input-wrapper',
  label = '',
  placeholder = '',
  type = 'text',
  disabled = false,
  errorClass = 'spark-input-error-text',
  error = '',
  onChange = () => { },
  value = '',
  ...restProps
}, ref) => {
  const [internalValue, setInternalValue] = React.useState(getFormattedValue(value));

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
    const newValue = e.target.value;
    if (!newValue || regex.negative.test(`${newValue}`)) {
      setInternalValue(newValue);
    }
  };

  return (
    <div className={wrapperClasses.join(' ')}>
      {
        !!label && <label className={InputCss.inputLabel}>{label}</label>
      }
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
        {!!error && <span className={errorClass}>{error}</span>}
      </div>
    </div>
  );
});
NegativeInput.displayName = 'NegativeInput';
NegativeInput.propTypes = {
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

NegativeInput.defaultProps = {
  label: '',
  error: '',
  disabled: false,
};
