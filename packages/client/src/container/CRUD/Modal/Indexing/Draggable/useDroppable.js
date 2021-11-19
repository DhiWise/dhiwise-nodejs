import React from 'react';
import { useDrop } from 'react-dnd';

const DND_ITEM_TYPE = 'row';
export const useDroppable = ({ index, moveRow, type }) => {
  const dropRef = React.useRef(null);

  const [, drop] = useDrop({
    accept: type || DND_ITEM_TYPE,
    hover(item, monitor) {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveRow(dragIndex, hoverIndex);
      // eslint-disable-next-line no-param-reassign
      item.index = hoverIndex;
    },
  });

  return { drop, dropRef };
};
