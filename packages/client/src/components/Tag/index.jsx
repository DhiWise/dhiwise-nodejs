import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '@dhiwise/icons';
import { TagCss } from './tagCss';

export const variantConstant = {
  primary: 'primary',
  secondary: 'secondary',
  coolGray: 'coolGray',
  active: 'active',
  deactive: 'deactive',
};

export const TagGroup = ({
  spaceNone, titleKey = 'tag', onClick = () => {}, valueKey = '', disabled = false, disabledTag = [], TagList = [], className,
}) => (
  <div className={`${spaceNone ? 'mt-0' : 'mt-4'}`}>
    { [...disabledTag, ...TagList]?.map((t, index) => (
      <Tag
        size={t.size}
        title={t[titleKey]}
        key={t[titleKey]}
        variant={t.tagVariant}
        close={t.close}
        className={`mr-1 mb-1 ${className} ${(disabled || !!disabledTag?.find((tag) => tag[titleKey] === t[titleKey])) && TagCss.disabledTag} whitespace-nowrap`}
        onClick={(disabled || !!disabledTag?.find((tag) => tag[titleKey] === t[titleKey])) ? undefined : onClick}
        value={t[valueKey] || index}
      />
    ))}
  </div>
);

export const Tag = ({
  title, variant, className, size, close, onClick = () => { }, value,
}) => {
  const variantClass = `${TagCss[[`tag${variant}`]]}`;
  const sizeClass = `${TagCss[[`tag${size}`]]}`;
  return (
    <div className={[TagCss.tagWrap, sizeClass, className, variantClass].join(' ')} onClick={() => onClick(value)}>
      {title}
      {!!close
      && (
      <div className="w-3 h-3 ml-2">
        <Icons.Close />
      </div>
      )}
    </div>
  );
};
Tag.propTypes = {
  /**
     * How large should the button be?
     */
  variant: PropTypes.oneOf(['primary', 'secondary', 'coolGray', 'active', 'deactive', 'ghost']),
  size: PropTypes.oneOf(['normal', 'small', 'xxs']),
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};

Tag.defaultProps = {
  variant: 'coolGray',
  size: 'normal',
  onClick: undefined,
};
