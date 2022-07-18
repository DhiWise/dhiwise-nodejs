/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Input } from '../../../../../components';

function EditableCell({ row: { original }, column: { id } }) {
  return (
    <div className={`w-full text-left${id === 'description' && 'min-w-40'}`}>
      <Input
        {...(id === 'description' && { className: 'truncate' })}
        size="small"
        {...(original?.original?.[id] && 'dark')}
        WrapClassName="flex-grow"
        disabled
        value={original[id] || original?.original?.[id]}
      />
    </div>
  );
}

export default EditableCell;
