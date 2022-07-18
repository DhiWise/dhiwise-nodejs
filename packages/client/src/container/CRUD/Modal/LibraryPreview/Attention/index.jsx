import React from 'react';
import Drawer from 'rc-drawer';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import omitDeep from 'omit-deep-lodash';
import { isArray, isEmpty } from 'lodash';
import {
  Checkbox,
  Description, DrawerClose, DrawerFooter, DrawerHead, ListBoxWrap, ListTitle,
} from '../../../../../components';
import { useBoolean } from '../../../../../components/hooks';
import { useLibrary } from '../LibraryProvider';
import { createMultipleModels } from '../../../../../api/models';
import { useToastNotifications } from '../../../../hooks';
import { addMultipleModel } from '../../../../../redux/reducers/models';

export const Attention = ({
  attentionRef, checkedDataJson, getRelationTableData, setPanel, checkedIndexData, checkedRefIndexes,
}) => {
  const [mapRelation, setMapRelation] = React.useState([]);

  const [isOpen, handelOpen, handelClose] = useBoolean(false);
  const [isSubmit, setSubmit, hideSubmit] = useBoolean(false);
  // const { prepareTableView, tableToCodeViewParser } = useEditor();

  const { libraryModelList, selectedModel } = useLibrary();
  const { addSuccessToast, addErrorToast } = useToastNotifications();
  const { applicationId, currentApplicationCode } = useSelector(({ projects }) => ({
    applicationId: projects.currentApplicationId,
    currentApplicationCode: projects.currentApplicationCode,
  }), shallowEqual);
  const dispatch = useDispatch();

  React.useImperativeHandle(attentionRef, () => ({ handelOpen }));

  React.useEffect(() => {
    if (isOpen) {
      const relationTableData = getRelationTableData();
      // map relationdata ref to name
      setMapRelation(libraryModelList.map((model) => (relationTableData.includes(model._id) ? { ...model, schemaJson: omitDeep(model.schemaJson, 'description'), checked: true } : false)).filter((el) => el && el));
    }
  }, [isOpen]);

  const onSelectAll = (checked) => {
    setMapRelation(mapRelation.map((r) => ({ ...r, checked })));
  };
  const onChecked = (checked, index) => {
    mapRelation[index].checked = checked;
    setMapRelation([...mapRelation]);
  };
  const handleSubmit = () => {
    setSubmit();
    const mainModel = checkedDataJson();
    const mainIndexes = isArray(checkedRefIndexes?.current) ? checkedIndexData() : selectedModel.modelIndexes;
    const models = [{
      modelName: selectedModel.name,
      description: selectedModel.description,
      schemaJson: mainModel,
      hooks: selectedModel.hooks ?? [],
      modelIndexes: mainIndexes ?? [],
    }, ...mapRelation.filter((rel) => rel.checked).map((model) => ({
      modelName: model.name,
      description: model.description,
      schemaJson: model.schemaJson,
      hooks: model.hooks,
      modelIndexes: model.modelIndexes,
    }))];
    const request = { currentApplicationCode, applicationId, models };
    createMultipleModels(request).then((res) => {
      addSuccessToast(res.message);
      hideSubmit();
      res.data?.success && dispatch(addMultipleModel(res.data.success.filter((model) => !isEmpty(Object.values(model)))));
      setPanel();
    }).catch((error) => {
      addErrorToast(error);
      hideSubmit();
    });
  };
  return (
    <Drawer
      open={isOpen}
      ease
      level={null}
      handler={false}
      placement="right"
      wrapperClassName=""
    >
      <DrawerHead title="Your attention is required!" />
      <DrawerClose onClick={handelClose} />
      <div className="flex-grow overflow-auto p-5 smallCheckbox">
        <Description>The model that you have selected is carrying relationships from the below model(s). You need to add the below model(s) to avoid errors. Selected model(s) will be directly added to the custom model list that you can further modify based on your requirements.</Description>
        <div className="mt-4">
          <div className="pb-3">
            <Checkbox onChange={onSelectAll} checked={!(mapRelation.findIndex((r) => !r.checked) >= 0)}>Select all</Checkbox>
          </div>
          {mapRelation.map((relation, index) => (
            <ListBoxWrap key={relation._id} className="flex" variant="small" onClick={() => { onChecked(!relation.checked, index); }}>
              <Checkbox checked={relation.checked} />
              <div className="flex-grow ml-1">
                <ListTitle title={relation.name} />
                <Description>{relation.description}</Description>
              </div>
            </ListBoxWrap>
          ))}
        </div>
      </div>
      <DrawerFooter
        handleCancel={handelClose}
        cancelTitle="Cancel"
        handleSubmit={handleSubmit}
        submitTitle="Create model(s)"
        isSubmitting={isSubmit}
      />
    </Drawer>
  );
};
