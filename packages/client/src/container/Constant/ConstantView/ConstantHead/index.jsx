import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isBoolean } from 'lodash';
import { useBoolean } from '../../../../components/hooks';
import { updateConstant } from '../../../../api/applicationConstant';
import { updateCurrentConstant } from '../../../../redux/reducers/constants';
import { InlineHeader } from '../../../../components/InlineHeader';
import { useToastNotifications } from '../../../hooks';
import { nodeConstantName } from '../../../../constant/applicationConstant';

export const ConstantHead = React.memo(({ updateRef, isDisable }) => {
  const [edit, setShowEdit, setHideEdit] = useBoolean(false);
  const { addSuccessToast, addErrorToast } = useToastNotifications();

  const selectedConstant = useSelector((state) => state.constants.currentId);
  const constantList = useSelector((state) => state.constants.constantList);
  const applicationId = useSelector((state) => state.projects.currentApplicationId);

  const dispatch = useDispatch();

  const [state, _setState] = React.useState(() => ({ fileName: '', description: '', isActive: false }));
  const setState = React.useCallback((data) => {
    _setState((prevState) => ({ ...prevState, ...data }));
  }, [_setState]);

  const currentConstantData = constantList.find((d) => d._id === selectedConstant);

  React.useEffect(() => {
    setState({
      fileName: currentConstantData?.fileName,
      description: currentConstantData?.description,
      isActive: currentConstantData?.isActive,
    });
    setHideEdit();
  }, [selectedConstant]);

  const handelConstantProperty = async (key, value, isShowNotification = true) => {
    const data = { [key]: isBoolean(value) ? value : value || currentConstantData?.[key] };
    setState({ ...data });
    const request = {
      ...state,
      customJson: currentConstantData?.customJson || {},
      // TODO:Remove if customJson come in List
      ...data,
      applicationId,
      type: currentConstantData?.type,
    };
    if (value || isBoolean(value)) {
      try {
        const response = await updateConstant(selectedConstant, request);
        if (response.data) {
          if (isShowNotification)addSuccessToast(response.message);
          dispatch(updateCurrentConstant(response.data));
        }
      } catch (error) {
        addErrorToast(error);
        setState({
          fileName: currentConstantData?.fileName,
          description: currentConstantData?.description,
          isActive: currentConstantData?.isActive,
        });
      }
    }
  };

  React.useImperativeHandle(updateRef, () => ({ handelConstantProperty, setHideEdit }));

  return (
    <InlineHeader
      defaultValue={state}
      currentId={selectedConstant}
      onBlurEvent={handelConstantProperty}
      isDisable={isDisable}
      isActiveButton
      edit={edit}
      titleRegex={nodeConstantName}
      setShowEdit={setShowEdit}
      setHideEdit={setHideEdit}
      titlePlaceHolder="Constant"
    />
  );
});
ConstantHead.displayName = 'ConstantHead';
