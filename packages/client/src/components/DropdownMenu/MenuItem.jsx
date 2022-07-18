import * as React from 'react';
import PropTypes from 'prop-types';
import DefaultCss from './Css';
import { DropdownCss } from './dropdown';

const MenuItem = (props) => {
  const [linkStyle, setLinkStyle] = React.useState(DefaultCss.pointer);

  React.useEffect(() => {
    // Need to check disabled also, otherwise
    // this might override the disabled useState hook
    if (props.linkStyle && !props.disabled) {
      setLinkStyle(props.linkStyle);
    }
  }, [props.linkStyle]);

  React.useEffect(() => {
    if (props.disabled) {
      setLinkStyle(DefaultCss.disabledItem);
    }
  }, [props.disabled]);

  const getSeparatorCss = () => {
    const resultCss = { ...DefaultCss };
    if (props.css) {
      resultCss.separator = { ...DefaultCss.separator, ...props.css.separator };
    }
    return resultCss;
  };

  if (props.type) {
    if (props.type.toLowerCase() === 'separator') {
      const css = getSeparatorCss();
      return (<hr style={css.separator} />);
    }
    throw new Error("The value for prop 'type' is not supported for MenuItem. The only supported type is 'separator'.");
  } else if (props.location) {
    return (
      <div className={`${props.className} ${DropdownCss.dropdownitemWrap}`}>
        <a
          href={props.location}
          target={props.target}
          onClick={props.onClick}
          style={linkStyle}
          className={DropdownCss.dropdownitem}
        >
          {props.text}
        </a>
      </div>
    );
  } else {
    const selectedClass = props.selected ? 'bg-primary-dark text-defaultWhite' : '';
    return (
      <div className={` ${selectedClass} ${props.className} ${DropdownCss.dropdownitemWrap}`}>
        <div
          onClick={props.onClick}
          style={linkStyle}
          className={`${DropdownCss.dropdownitem}`}
        >
          {props.text}
        </div>
        {!!props.icon && <div onClick={props.iconClick} className="w-4 h-4 ml-2 cursor-pointer">{props.icon}</div>}
      </div>
    );
  }
};

MenuItem.propTypes = {
  // Renders a disabled MenuItem
  disabled: PropTypes.bool,
  // Specifies type of MenuItem
  type: PropTypes.string,
  // Inner Text of MenuItem
  text: PropTypes.string,
  // Navigation Location
  location: PropTypes.string,
  onClick: PropTypes.func,

};

export default MenuItem;
