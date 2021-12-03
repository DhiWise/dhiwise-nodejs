import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icons } from '@dhiwise/icons';
import { deleteModel } from '../../../api/models';
import {
  ConfirmationAlert, Description, IconBox, TagGroup,
} from '../../../components';
import { useBoolean, useToastNotifications } from '../../hooks';
import { deleteCurrentModel } from '../../../redux/reducers/models';
import { useModel } from './Editor/ModelProvider';

const DeleteModel = React.memo(({ currentId, className, isDeleteWhiteIcon }) => {
  const dispatch = useDispatch();
  const [visibleDelete, setVisibleDelete, hideVisibleDelete] = useBoolean(false);
  const [deleteLoader, setDeleteLoader, hideDeleteLoader] = useBoolean(false);
  const { addErrorToast, addSuccessToast } = useToastNotifications();
  const { setModelErrors } = useModel();
  const modelList = useSelector((state) => state.models.modelList);
  const currentApplicationCode = useSelector(({ projects }) => (projects.currentApplicationCode));
  const [delData, setDelData] = useState();

  const handleModelDelete = React.useCallback(({ isDependencyInfo }) => {
    !isDependencyInfo && setDeleteLoader();
    const request = {
      id: currentId,
      isHardDelete: true,
      definitionType: currentApplicationCode,
      isDependencyInfo,
    };
    deleteModel(request).then((data) => {
      if (data?.code === 'OK') {
        if (isDependencyInfo) {
          // check for dependency
          const tagList = data.data.map((x) => ({
            title: `${x.modelName}-${x.key}`,
            size: 'small',
            variant: 'coolGray',
          }));
          setDelData(tagList);
          setVisibleDelete();
        } else {
          // delete model
          if (data?.message) addSuccessToast(data.message);
          dispatch(deleteCurrentModel({ delId: currentId }));
          setModelErrors((modelErrors) => modelErrors?.filter((error) => !modelList?.map((model) => model?.name)?.includes(error?.modelName))); // delete model errors if model is deleted
          hideVisibleDelete();
        }
      } else if (data?.message) {
        addErrorToast(data.message);
        hideVisibleDelete();
      }
      // dispatch(deleteCurrentModel());
    }).catch((err) => {
      hideVisibleDelete();
      addErrorToast(err);
    }).finally(hideDeleteLoader);
  }, [currentId]);

  const handleConfirmation = () => {
    handleModelDelete({ isDependencyInfo: true });
  };

  const text = (
    <div>
      {
        delData?.length > 0 ? (
          <>
            <Description className="mt-2 w-10/12 m-auto">
              You want to delete this model with all the below mention relationships as well as any references of this model in routes, custom query and model permission will be deleted permanently and cannot be restored in the future.
            </Description>
            <div className="mt-2">
              <TagGroup
                className="cursor-text"
                titleKey="title"
                TagList={delData}
              />
            </div>
          </>
        ) : (
          <Description className="mt-2 w-10/12 m-auto">
            You want to delete this model with all its references from relationships, routes, custom query and model permission permanently. Also, the deleted models cannot be restored in the future.
          </Description>
        )
}
    </div>
  );

  return (
    <>
      {
        visibleDelete
        && (
        <ConfirmationAlert
          isOpen={visibleDelete}
          isLoading={deleteLoader}
          size="w-6/12 xxl:w-5/12"
          handleSubmit={handleModelDelete}
          handleClose={hideVisibleDelete}
        >
          {text}
        </ConfirmationAlert>
        )
      }
      {/* Remove */}
      <IconBox
        className={className}
        onClick={handleConfirmation}
        variant="ghost"
        size="small"
        icon={isDeleteWhiteIcon ? <Icons.Close color="#ffffff" /> : <Icons.Close />}
      />
    </>
  );
});

export default DeleteModel;
DeleteModel.displayName = 'DeleteModel';
