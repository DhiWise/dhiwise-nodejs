import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { upsertProjectRoleAccess } from '../../../api/projectRoleAccess';
import { Popup, Input } from '../../../components';
import { useBoolean } from '../../../components/hooks';
import { MAX_INPUT_FIELD_LIMIT } from '../../../constant/common';
import { useToastNotifications } from '../../hooks';
import { nodeKeyRegex } from '../../../utils/regex';
import { getError } from '../../../utils/validationMsgs';
import { ROLE_ACCESS_ACTION_TYPES, useRoleAccess } from '../RoleAccessProvider';

const defaultValues = {
  name: undefined,
  description: undefined,
};

export const AddRole = React.forwardRef(({ addModalRef }) => {
  const [addRoleModal, showAddRoleModal, hideAddRoleModal] = useBoolean(false);
  const applicationId = useSelector((state) => state.projects.currentApplicationId);

  const { addErrorToast, addSuccessToast } = useToastNotifications();

  const {
    isLoading, setLoading, removeLoading, dispatch,
  } = useRoleAccess();

  const {
    handleSubmit, errors, control,
  } = useForm({ defaultValues, mode: 'onChange' });

  React.useImperativeHandle(addModalRef, () => ({ showAddRoleModal }));

  const onSubmit = (roleData) => {
    setLoading();
    const apiData = {
      ...roleData,
      applicationId,
      customJson: [],
    };
    upsertProjectRoleAccess(apiData).then((roleRes) => {
      dispatch({ type: ROLE_ACCESS_ACTION_TYPES.ADD_ROLE, payload: roleRes.data });
      addSuccessToast(roleRes?.message);
      hideAddRoleModal();
    }).catch((err) => {
      addErrorToast(err);
    }).finally(removeLoading);
  };

  return (
    <Popup
      isOpen={addRoleModal}
      handleCancel={hideAddRoleModal}
      handleSubmit={handleSubmit(onSubmit)}
      closeModal={hideAddRoleModal}
      title="Create role"
      isCancel
      cancel="Cancel"
      isSubmit
      submit="Create role"
      submitLoading={isLoading}
      isAutoFocusOnSave
    >
      <div>
        <div className="grid grid-cols-1 gap-5">
          <Controller
            control={control}
            name="name"
            rules={{ required: true }}
            render={(controlProps) => (
              <Input
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...controlProps}
                autoFocus
                label="Add new role*"
                desc="Add a new role for your application."
                placeholder="Enter role"
                maxLength={MAX_INPUT_FIELD_LIMIT.title}
                error={getError(errors, 'name', (errors?.name?.type === 'maxLength') ? MAX_INPUT_FIELD_LIMIT.title : 'Role')}
                customRegex={nodeKeyRegex}
              />
            )}
          />
          {/* <Controller
            control={control}
            name="description"
            rules={{ required: true }}
            render={(controlProps) => (
              <TextArea
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...controlProps}
                maxLength={MAX_INPUT_FIELD_LIMIT.description}
                label="Description*"
                desc="You're a star developer. You know comments go a long way! Write brief about the role."
                placeholder="Enter description"
                error={getError(errors, 'description', (errors?.description?.type === 'maxLength') ? MAX_INPUT_FIELD_LIMIT.description : 'Description')}
              />
            )}
          /> */}
        </div>
      </div>
    </Popup>
  );
});
AddRole.displayName = 'AddRole';
