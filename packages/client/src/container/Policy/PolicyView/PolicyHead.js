import React from 'react';
import { isBoolean, isEmpty, replace } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { updatePolicy } from '../../../api/applicationPolicy';
import { updateCurrentPolicy } from '../../../redux/reducers/policy';
import { InlineHeader } from '../../../components/InlineHeader';
import { useBoolean, useToastNotifications } from '../../hooks';

export const PolicyHead = React.memo(({
  updateRef, isDisable, setLoading, hideLoading,
}) => {
  const [edit, setShowEdit, setHideEdit] = useBoolean(false);
  const { addErrorToast, addSuccessToast } = useToastNotifications();

  const selectedPolicy = useSelector((state) => state.policy.currentId);
  const policyList = useSelector((state) => state.policy.policyList);
  const applicationId = useSelector((state) => state.projects.currentApplicationId);
  const dispatch = useDispatch();

  const currentPolicyData = policyList.find((d) => d._id === selectedPolicy);

  const [state, _setState] = React.useState(() => ({
    fileName: '',
    description: '',
    isActive: false,
  }));

  const setState = React.useCallback(
    (data) => {
      _setState((prevState) => ({ ...prevState, ...data }));
    },
    [_setState],
  );

  let fileName = '';
  if (/\s/.test(currentPolicyData?.fileName)) {
    fileName = replace(currentPolicyData.fileName, / /g, '_');
  } else {
    fileName = currentPolicyData?.fileName;
  }

  React.useEffect(() => {
    setState({
      fileName,
      description: currentPolicyData?.description,
      isActive: currentPolicyData?.isActive,
    });
    setHideEdit();
  }, [selectedPolicy]);

  const handelPolicyProperty = (key, value) => {
    const data = {
      [key]: isBoolean(value) ? value : value ?? currentPolicyData?.[key],
    };
    setState({ ...data });
    const request = {
      ...state,
      customJson: currentPolicyData?.customJson || {},
      // TODO:Remove if customJson come in List
      ...data,
      applicationId,
      type: currentPolicyData?.type,
    };

    if (isEmpty(request?.customJson)) {
      addErrorToast('Enter Middleware Code');
      return;
    }
    if (value || isBoolean(value)) {
      setLoading();
      updatePolicy(selectedPolicy, request)
        .then((response) => {
          addSuccessToast(response.message);
          dispatch(updateCurrentPolicy(response.data));
        })
        .catch((error) => {
          addErrorToast(error);
          setState({
            fileName: currentPolicyData?.fileName,
            description: currentPolicyData?.description,
            isActive: currentPolicyData?.isActive,
          });
        }).finally(hideLoading);
    }
  };

  React.useImperativeHandle(updateRef, () => ({ handelPolicyProperty, setHideEdit }));

  return (
    <InlineHeader
      defaultValue={state}
      currentId={selectedPolicy}
      onBlurEvent={handelPolicyProperty}
      isDisable={isDisable}
      isActiveButton
      edit={edit}
      setShowEdit={setShowEdit}
      setHideEdit={setHideEdit}
      titlePlaceHolder="Middleware"
    />
  );
});
PolicyHead.displayName = 'PolicyHead';
