import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { TextAreaCss } from './textareaCss';
import { Description } from '../Description';
import { InputCss } from '../Input/inputCss';

export const TextArea = forwardRef(
  ({
    desc, label, maxLength = '', children, textareaClass, className, placeholder, error, ...name
  }, ref) => (
    <div className={className}>
      {!!(label || desc) && (
      <div className="">
        {!!label && <label className={TextAreaCss.lebel}>{label}</label>}
      </div>
      )}
      <textarea
        placeholder={placeholder}
        className={`${TextAreaCss.textarea} ${textareaClass}`}
        ref={ref}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...name}
        maxLength={maxLength}
      >
        {children}
      </textarea>
      {!!desc && <Description className={TextAreaCss.desc}>{desc}</Description>}
      {!!error && <span className={InputCss.errorClass}>{error}</span>}
    </div>
  ),
);
TextArea.propTypes = {
  label: PropTypes.string,
  textareaClass: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};
TextArea.displayName = 'TextArea';
