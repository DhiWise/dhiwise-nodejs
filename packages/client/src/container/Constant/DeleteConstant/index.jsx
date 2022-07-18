import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteConstant } from '../../../api/applicationConstant';
import { Button, ConfirmationAlert } from '../../../components';
import { useBoolean, useToastNotifications } from '../../hooks';
import { deleteCurrentConstant } from '../../../redux/reducers/constants';

function DeleteConstant({ selectedConstant, isDisable }) {
  const dispatch = useDispatch();

  const [isDelete, setDelete, removeSetDelete] = useBoolean(false);
  const [isLoading, setLoading, removeLoading] = useBoolean(false);
  const { addErrorToast, addSuccessToast } = useToastNotifications();

  const handelDelete = React.useCallback(() => {
    setLoading();
    deleteConstant({ id: selectedConstant, isHardDelete: true }).then((response) => {
      addSuccessToast(response.message);
      dispatch(deleteCurrentConstant());
    }).catch((err) => {
      addErrorToast(err);
    }).finally(() => {
      removeSetDelete();
      removeLoading();
    });
  }, [selectedConstant]);

  return (
    <>
      {isDelete && (
      <ConfirmationAlert
        description="Constant file will be deleted permanently and cannot be restored in the future. Are you sure do you want to delete this constant file?"
        handleSubmit={handelDelete}
        isOpen={isDelete}
        handleClose={removeSetDelete}
        isLoading={isLoading}
        // description="Do you want to delete this constant ?"
      />
      )}

      {!isDisable && (

      <Button
        size="medium"
        variant="outline"
        className="ml-2"
        shape="rounded"
        onClick={setDelete}
      >
        Delete
      </Button>

      )}

    </>
  );
}

export default DeleteConstant;
