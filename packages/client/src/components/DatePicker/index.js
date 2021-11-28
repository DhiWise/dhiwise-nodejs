import React from 'react';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import { Icons } from '@dhiwise/icons';

import { Description } from '../Description';
import { datepickerCss } from './datepickerCss';

import 'react-datepicker/dist/react-datepicker.css';
import './datepicker.css';

export const Datepicker = ({
  label,
  desc,
  placeholder,
  labelClassName,
  error,
  size,
  onChange,
  WrapClassName,
  dateTimeFormat,
  ...otherProps
}) => {
  // eslint-disable-next-line no-unused-vars
  // const [startDate, setStartDate] = useState(otherProps.value ? new Date(otherProps.value) : new Date());
  const datepickerRef = React.useRef(null);

  function handleClickDatepickerIcon() {
    // OPENS UP THE DATEPICKER WHEN THE CALENDAR ICON IS CLICKED FOR THE INPUT FIELD
    const datepickerElement = datepickerRef?.current;
    datepickerElement?.setFocus();
  }

  const sizeCss = `${datepickerCss[[`datepicker${size}`]]}`;
  return (
    <div className={`${datepickerCss.datepickerWrap} ${WrapClassName}`}>
      {!!label && (
        <div className={labelClassName}>
          {!!label && (
            <label className={`${datepickerCss.datepickerLabel}`}>
              {label}
            </label>
          )}
        </div>
      )}
      <div className={datepickerCss.datepickerWrapClass}>
        <DatePicker
          ref={datepickerRef} // attach the ref
          placeholderText={placeholder || 'Select date'}
          wrapperClassName="w-full"
          calendarClassName="datepickerBox"
          className={`${datepickerCss.datePickerInput} ${sizeCss}`}
          selected={otherProps.value ? new Date(otherProps.value) : null}
          dateFormat={otherProps.showTimeSelect ? dateTimeFormat : 'MM-dd-yyyy'}
          onChange={(date) => {
            // setStartDate(date);
            onChange?.(date);
          }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...otherProps}
        />
        <div
          className="absolute top-0 bottom-0 flex h-4 m-auto opacity-50 cursor-pointer max-w-min right-3"
          onClick={() => handleClickDatepickerIcon()}
        >
          <span className="block w-4">
            <Icons.Calender />
          </span>
        </div>
      </div>
      {!!desc && (
        <Description className={datepickerCss.desc}>{desc}</Description>
      )}
      {!!error && <span className={datepickerCss.errorClass}>{error}</span>}
    </div>
  );
};

Datepicker.propTypes = {
  size: PropTypes.oneOf(['normal', 'small', 'medium']),
};

Datepicker.defaultProps = {
  size: 'normal',
  dateTimeFormat: 'MM-dd-yyyy hh:mm:ss a',
};
