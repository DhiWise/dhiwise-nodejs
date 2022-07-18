/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  Input, Popup, Select,
} from '../../../components';
import { getError } from '../../../utils/validationMsgs';
import { createConstant } from '../../../api/applicationConstant';
import { CONSTANT_GENERATE_TYPE } from '../../../constant/applicationConstant';
import useToastNotifications from '../../hooks/useToastNotifications';
import { useBoolean } from '../../../components/hooks';
import { addConstant } from '../../../redux/reducers/constants';
import { nodeKeyRegex } from '../../../utils/regex';
import { MAX_INPUT_FIELD_LIMIT } from '../../../constant/common';

const defaultValues = {
  fileName: undefined,
  modelId: undefined,
  description: undefined,
};

export const AddConstant = React.memo(({ addModalRef }) => {
  const dispatch = useDispatch();
  const [constantModal, showConstantModal, hideConstantModal] = useBoolean(false);

  const { applicationId, modelList } = useSelector(({ projects, models }) => ({
    applicationId: projects.currentApplicationId,
    modelList: models.modelList,
    applicationCode: projects.currentApplicationCode,
  }), shallowEqual);
  const {
    handleSubmit, errors, control, setValue, trigger,
  } = useForm({ defaultValues, mode: 'all' });
  const { addErrorToast, addSuccessToast } = useToastNotifications();
  const [isSubmitting, setSubmitting, removeSetSubmitting] = useBoolean(false);

  React.useImperativeHandle(addModalRef, () => ({ showConstantModal }));
  const onSubmit = (constantData) => {
    if (isSubmitting) { return; }
    setSubmitting();
    const apiData = {
      ...constantData,
      applicationId,
      type: CONSTANT_GENERATE_TYPE.MANUAL,
      customJson: {},
    };
    createConstant(apiData).then((response) => {
      addSuccessToast(response.message);
      dispatch(addConstant(response.data));
      hideConstantModal();
    }).catch((error) => {
      addErrorToast(error || 'Record with same route already exists');
    }).finally(removeSetSubmitting);
  };

  return (
    <Popup
      isOpen={constantModal}
      handleCancel={hideConstantModal}
      closeModal={hideConstantModal}
      handleSubmit={handleSubmit(onSubmit)}
      title="Create constant"
      isCancel
      cancel="Cancel"
      isSubmit
      submit="Create constant"
      bodyClass="xxl:max-h-110 overflow-auto xl:max-h-96"
      submitLoading={isSubmitting}
      isAutoFocusOnSave
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-5">

          <Controller
            control={control}
            name="modelId"
            render={(controlProps) => (
              <Select
                {...controlProps}
                autoFocus
                onChange={(modelId) => {
                  setValue('modelId', modelId ?? undefined);
                  if (modelId) {
                    setValue('fileName', modelList.find((d) => d._id === modelId)?.name);
                    trigger('fileName');
                  }
                }}
                placeholder="Select model"
                desc="Select a model name you wanted to create a constant file for."
                options={modelList}
                label="Select model for constant"
                valueKey="_id"
              />
            )}
          />

          <Controller
            control={control}
            name="fileName"
            rules={{ required: true }}
            render={(controlProps) => (
              <Input
                {...controlProps}
                {...({ autoFocus: true })}
                placeholder="Enter constant name"
                maxLength={MAX_INPUT_FIELD_LIMIT.title}
                desc="Give your constant an appropriate name."
                label="Constant name*"
                error={getError(errors, 'fileName', (errors?.fileName?.type === 'maxLength') ? MAX_INPUT_FIELD_LIMIT.title : 'Constant name')}
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
                placeholder="Enter description"
                label="Description*"
                defaultValues={controlProps.value}
                maxLength={MAX_INPUT_FIELD_LIMIT.description}
                // desc="Briefly describe your constant."
                error={getError(errors, 'description', (errors?.description?.type === 'maxLength') ? MAX_INPUT_FIELD_LIMIT.description : 'Description')}
              />
            )}
          /> */}
        </div>
      </form>
    </Popup>
  );
});
AddConstant.displayName = 'AddConstant';
