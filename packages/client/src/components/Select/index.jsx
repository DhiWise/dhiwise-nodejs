/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-props-no-multi-spaces */
import React from 'react';
import PropTypes from 'prop-types';
import SelectBox from 'react-select';
import { sortOptions } from '../utils';
import {
  SelectCss, LightSelect, DarkSelect, simlpeSelectCss, SmallDarkSelectCss, SmallSelectCss, MediumSelectCss,
} from './selectCss';
import { Description } from '../Description';

/**
 * This select box is being used from react-select library. For advanced usage check https://react-select.com/home
 */
const formatGroupLabel = (data) => (
  <div className="flex justify-between groupSelect py-2 px-1 bg-gray-300">
    <span className="font-bold text-primary-text">{data.name}</span>
    <span className="font-bold text-primary-text">{data.options.length}</span>
  </div>
);
const Select = React.forwardRef(({
  label = '',
  wrapperClass = '',
  className = '',
  options = [],
  value = [],
  placeholder = 'Select',
  WrapClassName = '',
  disabled = false,
  sortKey = '',
  isSearchable = true,
  noOptionsMessage = 'No options found',
  error = '',
  wrapperStyle = {},
  isClearable = true,
  isMulti = false,
  onChange = null,
  valueKey = 'id',
  labelKey = 'name',
  isLabel,
  isDec,
  desc,
  simpleSelect,
  dark = false,
  sizeSmall,
  sizeMedium,
  groupOptions,
  defaultValue,
  LeftLabel,
  labelClassName,
  htmlDesc,
  components,
  ...restProps
}, ref) => {
  const isFirstTime = React.useRef(true);
  const [selectOptions, setSelectOptions] = React.useState(sortKey ? sortOptions(options, sortKey) : options);

  React.useEffect(() => {
    setSelectOptions(sortKey ? sortOptions(options, sortKey) : options);
  }, [options]);

  const getValue = React.useCallback(() => {
    const defaultChecked = options?.filter((option) => !!option.default);
    if ([undefined, null].includes(value) || (Array.isArray(value) && value.length === 0)) {
      if (isFirstTime.current) {
        isFirstTime.current = false;
        return defaultChecked;
      }
    } else {
      if (isMulti) {
        return options?.filter((option) => value && value.includes(option[valueKey]));
      }
      // eslint-disable-next-line eqeqeq
      return options.find((option) => option[valueKey] == value);
    }
    return null;
  }, [options, value]);

  const handleChange = (data) => {
    if (!onChange) return;
    if (isMulti) {
      onChange(data?.map((d) => d[valueKey]) || null);
    } else {
      onChange([undefined, null].includes(data?.[valueKey]) ? null : data?.[valueKey]);
    }
  };

  let groupClass = 'spark-select';
  if (wrapperClass) {
    groupClass += ` ${wrapperClass}`;
  }
  if (error) {
    groupClass += ' spark-select-error';
  }
  return (
    <div className={`${groupClass} ${disabled && 'cursor-not-allowed'} ${WrapClassName}`} style={{ ...wrapperStyle }}>
      {!!(label || desc)
        && (
          <div className={`${LeftLabel}`}>
            {!!label && <label className={`${SelectCss.selectlabel} ${labelClassName}`}>{label}</label>}
          </div>
        )}
      <SelectBox
        ref={ref}
        className={className}
        classNamePrefix="react-select"
        placeholder={placeholder}
        options={groupOptions || selectOptions}
        formatGroupLabel={formatGroupLabel}
        isSearchable={isSearchable}
        isDisabled={!!disabled}
        noOptionsMessage={() => noOptionsMessage}
        // classNamePrefix={classNamePrefix}
        isClearable={isClearable}
        isMulti={isMulti}
        closeMenuOnSelect={!isMulti}
        onChange={handleChange}
        value={getValue()}
        getOptionLabel={(data) => data[labelKey]}
        getOptionValue={(data) => data[valueKey]}
        isOptionDisabled={(option) => option.isdisabled}
        styles={(dark ? { ...DarkSelect, ...SelectCss, ...sizeSmall && SmallDarkSelectCss }
          : simpleSelect ? { ...simlpeSelectCss, ...SelectCss }
            : sizeMedium ? { ...MediumSelectCss, ...SelectCss } : {
              ...LightSelect, ...SelectCss, ...sizeSmall && SmallSelectCss,
            })}
        defaultValue={defaultValue}
        components={components}
        {...restProps}

      />
      {!!desc && <Description className={SelectCss.desc}>{desc}</Description>}
      {!!htmlDesc
          && <Description className={SelectCss.desc}><div dir="ltr" dangerouslySetInnerHTML={{ __html: htmlDesc }} /></Description> }
      {!!error && <span className={SelectCss.erorrClass}>{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';

export { Select };
Select.propTypes = {
  /**
   * Select label
   */
  label: PropTypes.string,
  /**
   * key in options array to display label
   */
  labelKey: PropTypes.string,
  /**
   * key in options array to get value
   */
  valueKey: PropTypes.string,
  /**
   * options for select box
   */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      name: PropTypes.string.isRequired,
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
      ]),
    }),
  ),
  /**
   * Can seelcted option be cleared?
   */
  isClearable: PropTypes.bool,
  /**
   * Can multiple options be selected?
   */
  isMulti: PropTypes.bool,
  /**
   * Select box placeholder
   */
  placeholder: PropTypes.string,
  /**
   * classname prefix to apply existing styles
   */
  disabled: PropTypes.bool,
  /**
   * can options be searched
   */
  isSearchable: PropTypes.bool,
  /**
   * Message to display when no options found
   */
  noOptionsMessage: PropTypes.string,
  /**
   * Helper text to display at bottom of input
   */
  error: PropTypes.string,
  /**
   * error class
   */
  errorClass: PropTypes.string,
  /**
   * class which wraps whole component, label and select
   */
  wrapperClass: PropTypes.string,
  /**
   * class to apply select component
   */
  className: PropTypes.string,
};
