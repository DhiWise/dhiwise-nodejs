import React from 'react';
import { Controller, useForm, useFormContext } from 'react-hook-form';
import {
  Popup, Input,
} from '../../../../../components';
import { useBoolean } from '../../../../../components/hooks';
import { ROUTE_VALIDATION_MESSAGE } from '../../../../../constant/routes';
import useToastNotifications from '../../../../hooks/useToastNotifications';
import { nodeKeyRegex } from '../../../../../utils/regex';
import { getError } from '../../../../../utils/validationMsgs';
// import { useAddRoute } from '../AddRouteProvider';
import { useQueryResponse } from './ResponseProvider';

export const AddResponse = ({ addModalRef }) => {
  const [responseModal, showResponseModal, hideResponseModal] = useBoolean(false);

  const methods = useFormContext();
  const {
    getValues, setValue,
  } = methods;
  const { addErrorToast } = useToastNotifications();
  const defaultQueryBuilder = getValues('queryBuilder');
  // const [loading,,, setToggle] = useBoolean();

  React.useImperativeHandle(addModalRef, () => ({ showResponseModal }));
  const {
    errors, control, handleSubmit,
  } = useForm({ mode: 'all' });
  const { setResponseId } = useQueryResponse();
  const onSubmit = (data) => {
    const queryBuilderData = defaultQueryBuilder;
    const newQueryBuilderData = queryBuilderData ? [...queryBuilderData, { outputVariable: data.outputVariable, _id: queryBuilderData.length, filterJson: { id: Math.random(), type: 'group' } }]
      : [{ outputVariable: data.outputVariable, _id: 0, filterJson: { id: Math.random(), type: 'group' } }];
    const queryName = queryBuilderData?.map((q) => q.outputVariable) ?? [];
    if (queryName.includes(data.outputVariable)) {
      addErrorToast(ROUTE_VALIDATION_MESSAGE.uniqResponseKey);
      hideResponseModal();
      return;
    }
    // queryBuilderData ? [,
    //   ...queryBuilderData]
    //   : [{
    //     queryMode: 'find', outputVariable: data.outputVariable, _id: 0, filterJson: undefined,
    //   }];

    setValue('queryBuilder', newQueryBuilderData);
    setResponseId(newQueryBuilderData.length - 1);
    hideResponseModal();

    // // TODO:maintain loading state isSuccess flag manage
    // loadingCallBack(({ isLoading = false, isFailed = false }) => {
    //   setToggle(); if (!isLoading) {
    //     hideResponseModal();
    //     if (isFailed) { setValue('queryBuilder', newQueryBuilderData.splice(0, newQueryBuilderData.length - 1)); } else {
    //       setResponseId(newQueryBuilderData.length - 1);
    //     }
    //   }
    // });
    // handleSave();
  };
  return (
    <div>
      <Popup
        // submitLoading={loading}
        isOpen={responseModal}
        handleSubmit={handleSubmit(onSubmit)}
        closeModal={hideResponseModal}
        handleCancel={hideResponseModal}
        title="Create response"
        cancel="Cancel"
        submit="Create response"
        bodyClass="xxl:max-h-110 overflow-auto xl:max-h-96"
        isAutoFocusOnSave
      >
        <div>
          <div className="grid grid-cols-1 gap-5">
            <Controller
              control={control}
              name="outputVariable"
              rules={{ required: true }}
              render={(controlProps) => (
                <Input
                // eslint-disable-next-line react/jsx-props-no-spreading
                  {...controlProps}
                  autoFocus
                  label="Add response *"
                  desc="Give a name to your query logic you are trying to add."
                  placeholder="Enter response"
                  error={!controlProps.value && getError(errors, 'outputVariable', 'Response')}
                  customRegex={nodeKeyRegex}
                />
              )}
            />
          </div>
        </div>
      </Popup>
    </div>
  );
};
