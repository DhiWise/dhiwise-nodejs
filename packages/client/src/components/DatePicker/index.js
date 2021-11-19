import React from 'react';
import { Icons } from '@dhiwise/icons';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import { datepickerCss } from './datepickerCss';
import { Description } from '../Description';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker.css';

export const Datepicker = ({
  label, desc, placeholder, labelClassName, error, size = 'normal', onChange, WrapClassName, dateTimeFormat = 'MM-dd-yyyy hh:mm:ss a', ...otherProps
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
        {
          !!label && <label className={`${datepickerCss.datepickerLabel}`}>{label}</label>
        }
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
          className="max-w-min h-4 absolute right-3 cursor-pointer flex top-0 bottom-0 m-auto opacity-50"
          onClick={() => handleClickDatepickerIcon()}
        >
          <span className="w-4 block"><Icons.Calender /></span>
        </div>
      </div>
      {!!desc
        && <Description className={datepickerCss.desc}>{desc}</Description>}
      {!!error && <span className={datepickerCss.errorClass}>{error}</span>}
    </div>
  );
};

Datepicker.propTypes = {
  size: PropTypes.oneOf(['normal', 'small', 'medium']),
};
