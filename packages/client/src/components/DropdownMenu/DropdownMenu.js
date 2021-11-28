import React, {
  useCallback,
  useEffect,
  useMemo,
  useImperativeHandle,
  useRef,
  forwardRef,
  cloneElement,
} from 'react';
import useOnClickOutside from 'use-onclickoutside';

import { useBoolean } from '../hooks';
import DefaultCss from './Css';

const DropdownMenu = forwardRef((props, ref) => {
  const [open, , setFalse, setToggle] = useBoolean(false);

  const clickRef = useRef();

  useOnClickOutside(clickRef, setFalse);

  useEffect(() => {
    if (open) setToggle();
  }, [props.closeOnSelect]);

  useImperativeHandle(ref, () => ({ hideDropDown: setFalse }));

  const getCss = useCallback(() => {
    const propsCss = { ...props.css };
    const css = { ...DefaultCss };

    if (propsCss) {
      Object.keys(propsCss).forEach((key) => {
        css[key] = { ...DefaultCss[key], ...propsCss[key] };
      });
    }

    return css;
  }, [props.css]);

  const menuStyles = useMemo(() => {
    const css = getCss();
    const menuStyle = JSON.parse(JSON.stringify(css.menuContent)); // Clone the current style
    const position = props.position === undefined ? 'right' : props.position;
    const supportedPositions = ['left', 'center', 'right'];

    if (supportedPositions.indexOf(position.toLowerCase()) === -1) {
      throw new Error(
        "The value for 'position' prop is not supported for DropdownMenu. Try 'left', 'center' or 'right'."
      );
    }

    if (position) {
      let baseWidth = parseInt(
        DefaultCss.menuContent.minWidth.replace('px', ''),
        10
      );
      let offset = 0;
      baseWidth -= 40;

      // We need to use negative numbers as we are offsetting menu to the left
      if (position === 'center') {
        offset = (baseWidth / 2) * -1;
      }
      if (position === 'left') {
        offset = baseWidth * -1;
      }

      menuStyle.left = `${offset.toString()}px`;
      menuStyle.display = open ? 'block' : 'none';
    }

    return menuStyle;
  }, [open, props.position]);

  return (
    <div
      ref={clickRef}
      style={DefaultCss.menu}
      className={`${props.dropdownMenu} inline-block`}
    >
      {cloneElement(props.placeholder(), { onClick: setToggle })}
      <div
        className={`position-div ${props.position} ${props.wrapClass}`}
        style={{ ...menuStyles, ...props.style }}
      >
        {open && props.children}
      </div>
    </div>
  );
});
DropdownMenu.displayName = 'DropdownMenu';
export default DropdownMenu;
