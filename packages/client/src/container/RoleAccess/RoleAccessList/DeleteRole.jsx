import React from 'react';
import { deleteProjectRoleAccess } from '../../../api/projectRoleAccess';
import { Button, ConfirmationAlert } from '../../../components';
import { useBoolean, useToastNotifications } from '../../hooks';
import { ROLE_ACCESS_ACTION_TYPES, useRoleAccess } from '../RoleAccessProvider';

function DeleteRole() {
  const [isDelete, setDelete, removeSetDelete] = useBoolean(false);
  const [isLoading, setLoading, removeLoading] = useBoolean(false);
  const { addErrorToast, addSuccessToast } = useToastNotifications();

  const { selectedRole, dispatch } = useRoleAccess();

  const handelDelete = React.useCallback(() => {
    setLoading();
    deleteProjectRoleAccess({ id: selectedRole }).then((response) => {
      addSuccessToast(response.message);
      dispatch({ type: ROLE_ACCESS_ACTION_TYPES.DELETE_ROLE });
    }).catch((err) => {
      addErrorToast(err);
    }).finally(() => {
      removeLoading();
      removeSetDelete();
    });
  }, [selectedRole]);

  return (
    <>
      {isDelete && (
        <ConfirmationAlert
          description="Created role will be deleted permanently and cannot be restored in the future."
          handleSubmit={handelDelete}
          isOpen={isDelete}
          handleClose={removeSetDelete}
          isLoading={isLoading}
        />
      )}
      <Button
        variant="outline"
        className="ml-2"
        size="medium"
        shape="rounded"
        onClick={setDelete}
      >
        Delete
      </Button>
    </>
  );
}

export default DeleteRole;
