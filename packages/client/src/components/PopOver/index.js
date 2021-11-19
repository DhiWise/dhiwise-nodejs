import React from 'react';
import Popover from 'react-popover';

export const PopOver = ({
  data, popOverValue, className, place, dropdownWrapClass, style,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const showPopup = React.useCallback(() => {
    setIsPopoverOpen(!isPopoverOpen);
  });

  return (
    <Popover
      body={[
        <>
          {popOverValue}
        </>,
      ]}
      style={style}
      isOpen={isPopoverOpen}
      onOuterAction={showPopup}
      refreshIntervalMs={10}
      enterExitTransitionDurationMs={10}
      tipSize={10}
      place={place || null}
      className={`popupCustom ${dropdownWrapClass}`}
    >
      <span
        className={className}
        onClick={showPopup}
      >
        {data}
      </span>
    </Popover>
  );
};
