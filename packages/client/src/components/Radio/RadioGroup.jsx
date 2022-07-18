/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React, { forwardRef, useState } from 'react';
import { classNames } from '../utils';
import { radioCss } from './radioCss';
import './radiogroup.css';

export const Radio = forwardRef((props, ref) => {
  const {
    children = '',
    value = '',
    isParentDisabled = false,
    disabled = false,
    // labelClass = 'spark-radio-label',
    checked = false,
    name = '',
    prefixCls = 'spark-radio',
    wrapperClass = 'spark-radio-wrapper',
    className = '',
    ...restProps
  } = props;
  const wrapperClasses = classNames(wrapperClass, className, {
    [`${wrapperClass}-checked`]: checked,
    [`${wrapperClass}-disabled`]: disabled || isParentDisabled,
  });

  const radioClass = classNames(prefixCls, {
    [`${prefixCls}-checked`]: checked,
    [`${prefixCls}-disabled`]: disabled || isParentDisabled,

  });

  return (
    <label className={`${wrapperClasses} ${radioCss.radioWrap}`}>
      <span className={radioClass}>
        <input
          role="radio"
          aria-checked={checked}
          checked={checked}
          className={`${prefixCls}-input`}
          type="radio"
          name={name}
          ref={ref}
          disabled={disabled}
          value={value}
          {...restProps}
        />
        <span className={`${prefixCls}-inner`} />
      </span>
      {!!children && <span className={radioCss.radioBoxLabel}>{children}</span>}
    </label>
  );
});

Radio.displayName = 'Radio';

export const RadioGroup = ({
  direction = 'horizontal',
  onChange = () => { },
  prefixCls = 'spark-radio',
  wrapperClassname = '',
  wrapperStyle = {},
  selectedValue,
  children,
  name,
  label = '',
  error = '',
  className,
  errorClass = 'spark-input-radio-text',
  /**
   * disabled on Radiogroup component disables all children
   */
  disabled = false,
}) => {
  const [value, setValue] = useState(selectedValue || '');

  React.useEffect(() => {
    setValue(selectedValue);
  }, [selectedValue]);

  const wrapperClass = classNames(`${prefixCls}-group`, wrapperClassname, {
    'vertical-options': direction === 'vertical',
  });

  const handleChange = (event, val, isDisabled) => {
    if (isDisabled) return;
    setValue(val);
    onChange && onChange(val, event);
  };

  const childrens = React.Children.map(children, (child) => {
    if (child.type === Radio) {
      return React.cloneElement(child, {
        name,
        checked: child.props.value === value,
        isParentDisabled: disabled,
        onChange: (e) => handleChange(e, child.props.value, child.props.disabled),
        direction,
        disabled: child.props.disabled,
      });
    }
    return child;
  });

  return (
    <div className={`${wrapperClass} ${className}`} style={wrapperStyle}>
      {
        !!label && <label className={radioCss.radioLabel}>{label}</label>
      }
      {childrens}

      {!!error && <div><span className={errorClass}>{error}</span></div>}

    </div>
  );
};

RadioGroup.propTypes = {
  name: PropTypes.string,
  direction: PropTypes.oneOf([
    'vertical',
    'horizontal',
  ]),
  children: PropTypes.node.isRequired,
  selectedValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
  /**
   * disabled on Radiogroup component disables all children
   */
  disabled: PropTypes.bool,
};
