import React from 'react';
import { cloneDeep } from 'lodash';
import { Icons } from '@dhiwise/icons';
import { ConfirmationAlert } from '../../../../../components';
import { useBoolean, useToastNotifications } from '../../../../hooks';
import { useEditor } from '../../Editor/EditorProvider';
import { useIndex, MODEL_INDEX_ACTION_TYPES } from './IndexProvider';

const DeleteIndex = React.memo(({ deleteObj, mainRow }) => {
  const { modelIndexList, dispatch } = useIndex();
  const { saveJSON } = useEditor();
  const [isDelete, setIsDelete, hideIsDelete] = useBoolean(false);
  const { addSuccessToast } = useToastNotifications();

  const isDeleteDisable = modelIndexList?.length === 1 && !mainRow;

  const handleDeleteRow = React.useCallback(() => {
    // delete row by index
    const newData = cloneDeep(modelIndexList);
    newData.splice(deleteObj.index, 1);
    if (deleteObj?.original?.isExist) saveJSON({ indexes: newData, msg: 'Index has been deleted successfully', showMsg: true });
    else {
      dispatch({ type: MODEL_INDEX_ACTION_TYPES.SET_LIST, payload: newData });
      addSuccessToast('Index has been deleted successfully');
    }
  }, [modelIndexList, deleteObj, saveJSON]);

  const handleDeleteSubRow = React.useCallback(() => {
    // delete sub row by index
    const newData = cloneDeep(modelIndexList);
    const subFields = newData[mainRow.index]?.indexFields || [];
    subFields.splice(deleteObj.index, 1);
    newData[mainRow.index].indexFields = subFields;

    if (deleteObj?.original?.isExist) saveJSON({ indexes: newData, msg: 'Index has been deleted successfully', showMsg: true });
    else {
      dispatch({ type: MODEL_INDEX_ACTION_TYPES.SET_LIST, payload: newData });
      addSuccessToast('Index has been deleted successfully');
    }
  }, [modelIndexList, deleteObj, mainRow, saveJSON]);

  const handleDeleteModal = React.useCallback(() => {
    if (mainRow) handleDeleteSubRow();
    else { handleDeleteRow(); }
    hideIsDelete();
  }, [mainRow, handleDeleteRow, handleDeleteSubRow]);

  return (
    <>
      { isDelete
        ? (
          <ConfirmationAlert
            description="Model index will be deleted permanently and cannot be restored in the future. Are you sure do you want to delete this index?"
            isOpen={isDelete}
            handleSubmit={handleDeleteModal}
            handleClose={hideIsDelete}
          />
        )
        : null}

      <div
        className={`w-4 h-4 ml-2 cursor-pointer ${(isDeleteDisable) ? ' opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => {
          // eslint-disable-next-line no-unused-expressions
          isDeleteDisable ? undefined : setIsDelete();
        }}
      >
        <Icons.Close />
      </div>
    </>
  );
});
DeleteIndex.displayName = 'DeleteIndex';
export { DeleteIndex };
