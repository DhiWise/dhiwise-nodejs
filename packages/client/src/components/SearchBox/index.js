/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Icons } from '@dhiwise/icons';
import { RecentSearch } from './RecentSearch';
import { SearchBoxCss } from './searchBoxCss';

export const SearchBox = ({
  children,
  className = '',
  size,
  placeholder,
  isRecentsearch,
  isSearch,
  header,
  onSearch,
  value = '',
  searchOnEnter = false,
  serachOnIconClick = false,
  // backgroundColor,
  ...props
}) => {
  const [internalValue, setInternalValue] = React.useState(value);

  const delayedCallback = debounce((event) => {
    onSearch(event.target.value);
  }, 1500);

  const handleSearchValue = (event) => {
    event.persist();
    delayedCallback(event);
  };

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    !searchOnEnter && handleSearchValue(e);
    setInternalValue(newValue);
  };
  const handleKeyPress = (e) => {
    if (searchOnEnter && e.key === 'Enter') {
      onSearch(internalValue);
    }
  };
  const onClear = () => {
    setInternalValue('');
    onSearch('');
  };
  return (
    <div
      className={[SearchBoxCss.wrapper, size, className].join(' ')}
      {...props}
    >
      {isRecentsearch && <RecentSearch />}
      <input
        {...props}
        className={`${header && SearchBoxCss.HeaderSearchCss} truncate ${SearchBoxCss.InputBox} ${isRecentsearch ? 'pl-8' : 'pl-3'}`}
        placeholder={placeholder}
        onChange={handleChange}
        value={internalValue}
        onKeyPress={handleKeyPress}
      />
      {!internalValue
        ? <div className={SearchBoxCss.IconBox} onClick={() => serachOnIconClick && searchOnEnter && onSearch(internalValue)}><Icons.Search /></div>
        : <div className={SearchBoxCss.IconBox} onClick={() => onClear()}><Icons.Close /></div>}
    </div>
  );
};

SearchBox.propTypes = {
  /**
   * What background color to use
   */
  // backgroundColor: PropTypes.string,
  /**
   * How large should the button be?
   */
  variant: PropTypes.oneOf(['primary', 'outline']),
  /**
   * Shape of button
   */
  shape: PropTypes.oneOf(['square', 'rounded']),
  /**
   * is Button disabled
   */
  disabled: PropTypes.bool,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
  /**
   * Additional classname
   */
  className: PropTypes.string,
};

SearchBox.defaultProps = {
  // backgroundColor: null,
  onClick: undefined,
};
