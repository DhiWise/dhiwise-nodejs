import React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import { Icons } from '@dhiwise/icons';
import { TableViewCss } from '../../../../../../assets/css/tableViewCss';

export const DragHandle = SortableHandle((props) => {
  const { style } = props;
  return (
    <div className={TableViewCss.tableSequence} style={style}>
      <Icons.Sequence />
    </div>
  );
});
