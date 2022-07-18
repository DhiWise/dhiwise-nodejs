/* eslint-disable no-param-reassign */
import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useBoolean } from '../../../../../components/hooks';
import { setCurrentModelProperty, updateModelDependency } from '../../../../../redux/reducers/models';
import { InlineHeader } from '../../../../../components/InlineHeader';
import { updateModelApi } from '../../../../../api/models';
import {
  DB_CONST, DB_TYPE,
  //  MODEL_NAME_LENGTH,
  mongoDbModalName, pluralizeTableName, SQL_MODEL_NAME_LENGTH,
} from '../../../../../constant/model';
import { useToastNotifications } from '../../../../hooks';
import { nodeKeyRegex } from '../../../../../utils/regex';

const ModelHeader = React.memo(({
  currentId, currentModel = {}, updateRef,
}) => {
  const dispatch = useDispatch();
  const {
    currentApplicationCode, dbType, applicationId,
  } = useSelector(({ projects }) => ({
    dbType: DB_CONST[projects.applicationDatabase.databaseType],
    currentApplicationCode: projects.currentApplicationCode,
    applicationId: projects.currentApplicationId,
  }), shallowEqual);
  const [edit, setShowEdit, setHideEdit] = useBoolean(false);
  const { addErrorToast, addSuccessToast } = useToastNotifications();

  const handleUpdate = React.useCallback((req = {}) => {
    const modelName = req?.name || currentModel.name;

    updateModelApi({
      description: currentModel.description,
      customJson: currentModel.customJson,
      definitionType: currentApplicationCode,
      ...req,
      name: modelName,
      tableName: pluralizeTableName(modelName, currentApplicationCode),
    }, currentId).then((data) => {
      dispatch(updateModelDependency({
        response: data?.data, request: req, dbType, currentModel,
      }));
      addSuccessToast(data.message);
    }).catch((err) => {
      addErrorToast(err);
    });
  }, [currentModel, applicationId, currentId, currentApplicationCode]);

  const handleModelProperty = React.useCallback((key, value, modelId) => {
    handleUpdate({ [key]: value, ...(key === 'name' && { tableName: pluralizeTableName(value, currentApplicationCode) }) });
    dispatch(setCurrentModelProperty({ modelId, key, value }));
    if (key === 'name') { // set tableName value based on model name
      dispatch(setCurrentModelProperty({ modelId, key: 'tableName', value: pluralizeTableName(value, currentApplicationCode) }));
    }
  }, [currentModel]);

  React.useImperativeHandle(updateRef, () => ({ setHideEdit }));

  return (
    <InlineHeader
      titleRegex={dbType === DB_TYPE.MONGODB ? mongoDbModalName : nodeKeyRegex}
      defaultValue={currentModel}
      currentId={currentId}
      onBlurEvent={handleModelProperty}
      edit={edit}
      setShowEdit={setShowEdit}
      setHideEdit={setHideEdit}
      titlePlaceHolder="Model"
      titleLength={SQL_MODEL_NAME_LENGTH}
      isDisableNameEdit={currentModel?.isDefault}
      showTableName
      dbType={dbType}
      currentApplicationCode={currentApplicationCode}
    />
  );
});
ModelHeader.displayName = 'ModelHeader';
export default ModelHeader;
