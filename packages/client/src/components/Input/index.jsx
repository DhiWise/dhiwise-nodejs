import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { InputCss } from './inputCss';
import { Description } from '../Description';
import { removeLeadingSpace } from '../../utils/regex';

/**
 * Primary UI component for Input
 */
export const Input = forwardRef(({
  wrapperClass = '',
  label = '',
  placeholder = '',
  type = 'text',
  disabled = false,
  error = '',
  onChange = () => { },
  WrapClassName,
  className,
  isDec,
  desc,
  dark,
  value = '',
  extension,
  size = 'normal',
  customRegex,
  labelClassName,
  inputClass,
  htmlDesc,
  isTrim = false,
  maxLength,
  inputClassName,
  ...restProps
}, ref) => {
  const wrapperClasses = [InputCss.inputwrapper];
  const disableClass = disabled ? `${InputCss.inputdisabled}` : '';
  if (error) {
    wrapperClasses.push('spark-error-wrapper');
  }
  if (wrapperClass) {
    wrapperClasses.push(wrapperClass);
  }

  const handleChange = (e) => {
    let targetVal = e.target.value.replace(removeLeadingSpace, '');
    if (isTrim) { targetVal = targetVal.trim(); }
    if (customRegex) {
      if (!targetVal || customRegex.test(targetVal)) onChange && onChange(targetVal);
    } else onChange && onChange(targetVal);
  };
  const sizeCss = `${InputCss[[`input${size}`]]}`;

  return (
    <div className={[wrapperClasses, WrapClassName].join(' ')}>
      {!!(label || desc) && (
      <div className={labelClassName}>
        {
          !!label && <label className={`${InputCss.inputLabel}`}>{label}</label>
        }
      </div>
      )}
      <div className={`${className} ${InputCss.inputWrapperClass}`}>
        <div className="relative">
          <input
            onChange={handleChange}
            type={type}
            className={`${InputCss.inputBlock} truncate ${inputClassName} ${inputClass} ${sizeCss} ${dark && InputCss.darkInput} ${disableClass} inputBlock`}
            ref={ref}
            disabled={disabled}
            placeholder={placeholder}
            value={value}
            maxLength={maxLength}
          // eslint-disable-next-line react/jsx-props-no-spreading
            {...restProps}
          />
          {!!extension && <div className={InputCss.extenstionText}>{extension}</div>}
        </div>
        {!!desc
          && <Description className={InputCss.desc}>{desc}</Description>}
      </div>
      {!!htmlDesc
          && <Description className={InputCss.desc}><div dir="ltr" dangerouslySetInnerHTML={{ __html: htmlDesc }} /></Description> }
      {!!error && <span className={InputCss.errorClass}>{error}</span>}
    </div>
  );
});
Input.displayName = 'Input';
Input.propTypes = {
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

Input.defaultProps = {
  label: '',
  error: '',
  disabled: false,
};
