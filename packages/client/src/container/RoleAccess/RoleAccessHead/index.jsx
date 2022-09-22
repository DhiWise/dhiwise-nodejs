import React from 'react';
import { isBoolean } from 'lodash';
import { useSelector } from 'react-redux';
import { upsertProjectRoleAccess } from '../../../api/projectRoleAccess';
import { InlineHeader } from '../../../components/InlineHeader';
import { useBoolean } from '../../../components/hooks';
import { useToastNotifications } from '../../hooks';
import { ROLE_ACCESS_ACTION_TYPES, useRoleAccess } from '../RoleAccessProvider';

export const RoleAccessHead = React.memo(({
  updateRef, setLoading, hideLoading,
}) => {
  const [edit, setShowEdit, setHideEdit] = useBoolean(false);
  const { addErrorToast, addSuccessToast } = useToastNotifications();

  const {
    selectedRoleData, selectedRole, dispatch,
  } = useRoleAccess();
  const applicationId = useSelector((state) => state.projects.currentApplicationId);

  const [state, _setState] = React.useState(() => ({
    name: '',
    description: '',
  }));

  const setState = React.useCallback(
    (data) => {
      _setState((prevState) => ({ ...prevState, ...data }));
    },
    [_setState],
  );

  React.useEffect(() => {
    setState({
      name: selectedRoleData?.name,
      description: selectedRoleData?.description,
    });
    setHideEdit();
  }, [selectedRole]);

  const handelRoleAccess = (key, value) => {
    const data = {
      [key]: isBoolean(value) ? value : value || selectedRoleData?.[key],
    };
    setState({ ...data });
    const apiData = {
      ...state,
      customJson: selectedRoleData?.customJson || [],
      id: selectedRole,
      ...data,
      applicationId,
    };
    if (value || isBoolean(value)) {
      setLoading();
      upsertProjectRoleAccess(apiData)
        .then((response) => {
          addSuccessToast(response?.message);
          dispatch({ type: ROLE_ACCESS_ACTION_TYPES.EDIT_SELECTED_ROLE_DATA, payload: response?.data });
        })
        .catch((error) => {
          addErrorToast(error);
          setState({
            name: selectedRoleData?.name,
            description: selectedRoleData?.description,
          });
        }).finally(hideLoading);
    }
  };

  React.useImperativeHandle(updateRef, () => ({ handelRoleAccess, setHideEdit }));

  return (
    <InlineHeader
      defaultValue={state}
      currentId={selectedRole}
      onBlurEvent={handelRoleAccess}
      edit={edit}
      setShowEdit={setShowEdit}
      setHideEdit={setHideEdit}
      titlePlaceHolder="Role"
    />
  );
});
RoleAccessHead.displayName = 'RoleAccessHead';
