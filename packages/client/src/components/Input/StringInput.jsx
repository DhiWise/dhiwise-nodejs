import React, { forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { regex } from '../utils';
import { InputCss } from './inputCss';
import { Description } from '../Description';
// import './input.css';

/**
 * Primary UI component for Input
 */
export const StringInput = forwardRef(({
  wrapperClass = '',
  className,
  // inputWrapperClass = 'spark-input-wrapper',
  label = '',
  placeholder = '',
  type = 'text',
  disabled = false,
  error = '',
  onChange = () => { },
  value = '',
  minLength,
  desc,
  dark,
  size = 'normal',
  inputClassName = [],
  customRegex,
  ...restProps
}, ref) => {
  const [internalValue, setInternalValue] = React.useState(value);

  const wrapperClasses = [InputCss.inputwrapper];
  const disableClass = disabled ? `${InputCss.inputdisabled}` : '';
  const inputClasses = [InputCss.inputBlock, disableClass];
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
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    onChange && onChange(internalValue);
  }, [internalValue]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (customRegex) {
      if (!newValue || customRegex.test(newValue)) setInternalValue(newValue);
    } else if (!newValue || (regex.string.test(newValue) && newValue[0].match(regex.firstSpace))) {
      setInternalValue(newValue);
    }
  };
  const sizeCss = `${InputCss[[`input${size}`]]}`;

  return (
    <div className={wrapperClasses.join(' ')}>
      {!!(label || desc) && (
      <div className={!desc && 'mb-2'}>
        {
        !!label && <label className={InputCss.inputLabel}>{label}</label>
      }
      </div>
      )}
      <div className={`${className} ${InputCss.inputWrapperClass}`}>
        <input
          onChange={handleChange}
          type={type}
          ref={ref}
          className={`${InputCss.inputBlock} ${sizeCss} ${dark && InputCss.darkInput} ${disableClass} inputBlock`}
          disabled={disabled}
          placeholder={placeholder}
          value={internalValue}
          minLength={minLength}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...restProps}
        />
      </div>
      {!!desc
        && <Description className={InputCss.desc}>{desc}</Description>}
      {!!error && <span className={InputCss.errorClass}>{error}</span>}
    </div>
  );
});
StringInput.displayName = 'StringInput';
StringInput.propTypes = {
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

StringInput.defaultProps = {
  label: '',
  error: '',
  disabled: false,
};
