import { useMemo, useState } from 'react';

const noop = () => { };

const createEventHandler = (options) => (dataTransfer, event) => {
  if (dataTransfer.files && dataTransfer.files.length) {
    (options.onFiles || noop)(Array.from(dataTransfer.files), event);
  }
};

const registerDropEvents = (eventHandler, setIsHovering) => ({
  onDragOver: (event) => {
    event.preventDefault();
    setIsHovering(true);
  },
  onDragEnter: (event) => {
    event.preventDefault();
    setIsHovering(true);
  },
  onDragLeave: () => {
    setIsHovering(false);
  },
  onDrop: (event) => {
    event.preventDefault();
    event.persist();
    setIsHovering(false);
    eventHandler(event.dataTransfer, event);
  },
  onPaste: (event) => {
    event.persist();
    eventHandler(event.clipboardData, event);
  },
});

const useDrop = (options) => {
  const { onFiles } = options;
  const [isHovering, setIsHovering] = useState(false);
  const eventHandler = useMemo(() => createEventHandler(options), [onFiles]);
  const eventProps = useMemo(
    () => registerDropEvents(eventHandler, setIsHovering), [eventHandler, setIsHovering],
  );

  return [eventProps, { isHovering }];
};

export default useDrop;
