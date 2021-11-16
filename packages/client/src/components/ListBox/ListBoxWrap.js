import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ListBoxCss } from './listboxCss';

export const ListBoxWrap = ({
  children, className, onClick, isSelected, variant, popupList, key,
}) => {
  const variantClass = `${ListBoxCss[[`list${variant}`]]}`;
  const [isSelect, setIsSelect] = useState(false);
  const selectBox = () => {
    setIsSelect(!isSelect);
  };
  // ${isSelect && ListBoxCss.listSelected}
  return (
    <div
      key={key}
      className={`${popupList ? ListBoxCss.listWrapPopup : ListBoxCss.listWrap} ${className} ${variantClass}`}
      onClick={isSelected ? selectBox : onClick}
    >
      {children}
    </div>
  );
};

ListBoxWrap.propTypes = {
  /**
     * List Variant?
     */
  variant: PropTypes.oneOf(['normal', 'headBox', 'flat', 'bottomOutline', 'popupBox', 'small']),
};
ListBoxWrap.defaultProps = {
  variant: 'normal',
};
