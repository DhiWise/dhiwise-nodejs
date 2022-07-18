import React from 'react';
import PropTypes from 'prop-types';
// import mobileScreen from '@assets/images/7.svg';
import ReactTooltip from 'react-tooltip';
import { Icons } from '@dhiwise/icons';
import { CardCss } from './cardCss';
import { IconBox } from '../IconBox';

export const ThumbnailCard = ({
  isSelect,
  size = 'sm',
  image = '',
  title = 'Screen',
  className,
  children,
  imgClass,
  imgWrapClass,
  isClosable = false,
  CardBoxClass,
  onClick = () => {},
  onIconClick = () => {},
  isLabel,
}) => {
  const sizeClass = `${CardCss[[`thumb${size}`]]}`;
  const textClass = `${CardCss[[`thumbText${size}`]]}`;
  return (
    <div className={`text-center cursor-pointer relative ${className}`} onClick={onClick}>
      {isClosable && <IconBox onClick={onIconClick} className="absolute -right-3 -top-1 bg-gray-200" size="extraSmall" shape="roundedFull" variant="outline" icon={<Icons.Close />} />}
      {isLabel
    && <div className="coming-soon z-100"><span>Splash</span></div>}
      <div
        className={`border-1 border-gray-100 p-2 rounded-3 hover:bg-gray-100 ${
          isSelect && 'border-primary-dark'
        } ${sizeClass} ${CardBoxClass} ${imgWrapClass}`}
      >
        <img
          src={image}
          className={`h-full object-contain w-full rounded-3 ${imgClass}`}
          alt=""
        />
      </div>
      {!!title && (
      <span
        data-tip
        data-for={`tooltip${title}`}
        className={`text-primary-text block mt-3 truncate ${textClass}`}
      >
        {title}
        <ReactTooltip id={`tooltip${title}`} type="dark">
          {title}
        </ReactTooltip>
      </span>
      )}
      {children}
    </div>
  );
};
ThumbnailCard.propTypes = {
  /**
   * How large should the avatar be?
   */
  size: PropTypes.oneOf(['xl', 'lg', 'md', 'sm', 'xs', 'auto']),
  image: PropTypes.string,
  title: PropTypes.string,
};
