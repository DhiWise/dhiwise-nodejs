/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
import React, { forwardRef, useState } from 'react';
import propTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { classNames, useCombinedRefs } from '../utils';
import './checkbox.css';

/**
 * Primary UI component for Checkbox
 */
export const Checkbox = forwardRef(
  (
    {
      checked,
      disabled = false,
      className = '',
      WrapclassName,
      wrapClass,
      onChange = () => { },
      type = 'checkbox',
      style = {},
      prefixCls = 'spark-checkbox',
      prefixWrapperCls = 'spark-checkbox-wrapper',
      wrapperClassname = '',
      wrapperStyle = {},
      defaultChecked = false,
      children,
      label,
      labelClass,
      name,
      onKeyDown,
      id = '',
      tooltip,
      ...otherProps
    },
    forwardedRef,
  ) => {
    const [value, setValue] = useState(defaultChecked || checked || false);

    React.useEffect(() => {
      setValue(checked);
      // if (onChange) {
      //   onChange(checked);
      // }
    }, [checked]);
    const checkboxClass = classNames(prefixCls, className, {
      [`${prefixCls}-checked`]: value,
      [`${prefixCls}-disabled`]: disabled,
    });
    const wrapperClass = classNames(prefixWrapperCls, wrapperClassname, {
      [`${prefixCls}-wrapper-checked`]: value,
      [`${prefixCls}-wrapper-disabled`]: disabled,
    });

    const handleChange = (event) => {
      if (disabled) return;
      if (onChange) {
        setValue(event.target.checked);
        onChange(event.target.checked, event);
      }
    };
    return (
      <div className={wrapClass}>
        <label
          className={`${wrapperClass} ${WrapclassName}`}
          style={{ ...wrapperStyle, cursor: 'pointer' }}
        >
          <div data-tip data-for={tooltip} className="inline-block">
            {!!tooltip && (
            <ReactTooltip id={tooltip} type="dark">
              {tooltip}
            </ReactTooltip>
            )}
            <span className={checkboxClass} style={style}>
              <input
                type={type}
                disabled={disabled}
                className={`${prefixCls}-input`}
                checked={!!checked || value}
                onChange={handleChange}
                name={name}
                onKeyDown={onKeyDown}
                id={id}
                {...otherProps}
              />
              <span className={`${prefixCls}-inner`} />
            </span>
          </div>
          {(!!children || !!label) && <span className={`text-primary-text text-sm checkboxLabel ${labelClass}`}>{children || label}</span>}
        </label>
      </div>
    );
  },
);
Checkbox.displayName = 'Checkbox';
Checkbox.propTypes = {
  checked: propTypes.bool,
  disabled: propTypes.bool,
  className: propTypes.string,
  onChange: propTypes.func,
  prefixCls: propTypes.string,
  wrapperClassname: propTypes.string,
  defaultChecked: propTypes.bool,
};

Checkbox.defaultProps = {
  checked: true,
};
