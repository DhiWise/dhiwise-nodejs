import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '@dhiwise/icons';
import { InformessageCss } from './informessageCss';

export const MessageNotify = ({
  messageType,
  className,
  isInfo,
  isWarring,
  isAlert,
  children,
  isClose,
  closeClick,
  messageCloseClass,
  size,
}) => {
  const messageTypeCss = `${InformessageCss[[`message${messageType}`]]}`;
  const messageSizeCss = `${InformessageCss[[`message${size}`]]}`;
  const messageSizeText = `${InformessageCss[[`messageText${size}`]]}`;
  const messageSizeImg = `${InformessageCss[[`messageImg${size}`]]}`;
  return (
    <div className={className}>
      <div className={`${isClose && 'pr-12'} ${[InformessageCss.messagebox, messageTypeCss, messageSizeCss].join(' ')}`}>
        {(isInfo || isWarring || isAlert) && (
          <div className={`${InformessageCss.messageimg} ${messageSizeImg}`}>
            {isInfo && <><Icons.Info color="#4289fd" /></>}
            {isWarring && <><Icons.Warring color="#ffbe00" /></>}
            {isAlert && <><Icons.Alert color="#E24C4B" /></>}
          </div>
        )}
        <p className={`${InformessageCss.messagedec} ${messageSizeText}`}>{children}</p>
        {isClose && (
          <div className={`${InformessageCss.messageclose} ${messageCloseClass}`} onClick={closeClick}>
            <Icons.CloseBlack color="#232323" />
          </div>
        )}
      </div>
    </div>
  );
};
MessageNotify.propTypes = {
  /** * warring true false */
  isWarring: PropTypes.bool,
  /** * alert true false */
  isAlert: PropTypes.bool,
  /** * info true false */
  isInfo: PropTypes.bool,
  /** * close true false */
  isClose: PropTypes.bool,
  /** * How large should the button be? */
  messageType: PropTypes.oneOf(['info', 'warring', 'alert']),
  size: PropTypes.oneOf(['normal', 'small']),
  /**
   * Additional classname
   */
  className: PropTypes.string,
};
MessageNotify.defaultProps = {
  size: 'normal',
};
