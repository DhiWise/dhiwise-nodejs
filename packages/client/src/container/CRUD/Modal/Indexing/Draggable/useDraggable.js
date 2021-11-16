// import React from 'react';
import { useDrag } from 'react-dnd';

const DND_ITEM_TYPE = 'row';
export const useDraggable = ({ index, type }) => {
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: type || DND_ITEM_TYPE, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return {
    isDragging, preview, drag,
  };
};
