import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, ConfirmationAlert } from '../../components';
import { deletePolicy } from '../../api/applicationPolicy';
import { deleteCurrentPolicy } from '../../redux/reducers/policy';
import { useBoolean, useToastNotifications } from '../hooks';

function DeletePolicy({ selectedPolicy, isDisable }) {
  const dispatch = useDispatch();

  const [isDelete, setDelete, removeSetDelete] = useBoolean(false);
  const [isLoading, setLoading, removeLoading] = useBoolean(false);
  const { addErrorToast, addSuccessToast } = useToastNotifications();

  const handelDelete = React.useCallback(() => {
    setLoading();
    deletePolicy({ id: selectedPolicy, isHardDelete: true }).then((response) => {
      addSuccessToast(response.message);
      dispatch(deleteCurrentPolicy());
    }).catch((err) => {
      addErrorToast(err);
    }).finally(() => {
      removeLoading();
      removeSetDelete();
    });
  }, [selectedPolicy]);

  return (
    <>
      {isDelete && (
        <ConfirmationAlert
          description="Middleware file will be deleted permanently and cannot be restored in the future.Are you sure do you want to delete this middleware file?"
          handleSubmit={handelDelete}
          isOpen={isDelete}
          handleClose={removeSetDelete}
          isLoading={isLoading}
        // description="Do you want to delete this constant ?"
        />
      )}

      {!isDisable && (

        <Button
          variant="outline"
          className="ml-2"
          size="medium"
          shape="rounded"
          onClick={setDelete}
        >
          Delete
        </Button>

      )}

    </>
  );
}

export default DeletePolicy;
