import React from 'react';
import { Icons } from '@dhiwise/icons';
import PropTypes from 'prop-types';
import { CardCss } from './cardCss';
import './card.css';
import { Tag } from '../Tag';

export const CardView = ({
  icon,
  title,
  dec,
  imgClassName,
  onClick,
  children,
  className,
  leftCard,
  isSelect,
  svg,
  code,
  preview,
  showPreview,
  imgSmall,
  previewClass,
  isComingSoon,
  cardTag,
  svgClass,
  imageSpace,
  variantHover = 'hover',
}) => {
  const varinatHoverClass = `${CardCss[[`card${variantHover}`]]}`;
  return (
  // ${isSelect && 'border-primary-dark'}
    <div className={`${CardCss.cardBox} ${varinatHoverClass} ${isComingSoon && 'cursor-not-allowed'} ${isSelect && 'border-primary-dark'} ${leftCard ? '' : 'text-center '} ${className} relative`} onClick={onClick}>
      {!!icon && (
      <div className={CardCss.cardImgBlock}>
        <img className={`${CardCss.cardImg}  ${imgSmall ? CardCss.cardImgSmall : CardCss.cardImgBig} ${imgClassName}`} src={icon} alt="Images" />
      </div>
      )}
      {isComingSoon
    && <div className="coming-soon"><span>Coming soon</span></div>}
      {!!preview
        && (
          <div className={`${CardCss.cardCodeView} ${previewClass}`} onClick={showPreview}>
            {code}
            <div className={`${CardCss.CardPerview}`}>
              <div className="w-10 h-10">
                <Icons.EyeOpen />
              </div>
            </div>
          </div>
        )}
      {!!svg
    && (
    <div className={`${CardCss.cardImgBlock} ${imageSpace && 'sm:mb-0'}`}>
      <div className={`${CardCss.cardImg} ${svgClass} ${imgSmall ? CardCss.cardImgSmall : CardCss.cardImgBig}`}>
        {svg}
      </div>
    </div>
    )}
      {!!title && (
      <h2 className={CardCss.cardTitle}>
        <span className={`relative ${cardTag && 'mr-9'}`}>
          {title}
          {!!cardTag && <Tag variant="primary" className="absolute" size="xxs" title={cardTag} />}
        </span>
      </h2>
      )}
      {!!dec && <p className={CardCss.cardDesc}>{dec}</p>}
      {children}
    </div>
  );
};
CardView.propTypes = {
  variantHover: PropTypes.oneOf([
    'hover',
    'default',
  ]),
  onClick: PropTypes.func,
  icon: PropTypes.string,
  title: PropTypes.string,
  dec: PropTypes.string,
  imgClassName: PropTypes.string,
};
CardView.defaultProps = {
  variantHover: 'hover',
};
