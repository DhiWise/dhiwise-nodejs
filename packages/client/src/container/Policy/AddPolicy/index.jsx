import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import {
  Input, Popup,
} from '../../../components';
import { POLICY_GENERATE_TYPE } from '../../../constant/policy';
import { createPolicy } from '../../../api/policy';
import { getError } from '../../../utils/validationMsgs';
import { useBoolean } from '../../../components/hooks';
import { addPolicy } from '../../../redux/reducers/policy';
import { nodeKeyRegex } from '../../../utils/regex';
import { MAX_INPUT_FIELD_LIMIT } from '../../../constant/common';
import { useToastNotifications } from '../../hooks';

const defaultValues = {
  fileName: undefined,
  modelId: undefined,
  description: undefined,
};

export const AddPolicy = React.memo(({ addModalRef }) => {
  const dispatch = useDispatch();
  const [policyModal, showPolicyModal, hidePolicyModal] = useBoolean(false);

  const { applicationId } = useSelector((state) => ({ applicationId: state.projects.currentApplicationId, currentApplicationCode: state.projects.currentApplicationCode }));
  const {
    handleSubmit, errors, control,
  } = useForm({ defaultValues, mode: 'all' });
  const { addErrorToast, addSuccessToast } = useToastNotifications();
  const [isSubmitting, setSubmitting, removeSetSubmitting] = useBoolean(false);

  React.useImperativeHandle(addModalRef, () => ({ showPolicyModal }));
  const onSubmit = (constantData) => {
    setSubmitting();
    const apiData = {
      ...constantData,
      applicationId,
      type: POLICY_GENERATE_TYPE.MANUAL,
      customJson: `module.exports = async (req, res, next) => {
        // start writing your code from here do not remove above code
    
        return next();
      }`,
    };
    createPolicy(apiData).then((response) => {
      addSuccessToast(response.message);
      dispatch(addPolicy(response.data));
      hidePolicyModal();
    }).catch((err) => {
      addErrorToast(err);
    }).finally(removeSetSubmitting);
  };

  return (
    <Popup
      isOpen={policyModal}
      handleCancel={hidePolicyModal}
      closeModal={hidePolicyModal}
      handleSubmit={handleSubmit(onSubmit)}
      title="Create middleware"
      isCancel
      cancel="Cancel"
      isSubmit
      submit="Create middleware"
      bodyClass="xxl:max-h-110 overflow-auto xl:max-h-96"
      submitLoading={isSubmitting}
      isAutoFocusOnSave
    >
      <div>
        <div className="grid grid-cols-1 gap-5">
          <Controller
            control={control}
            name="fileName"
            rules={{ required: true }}
            render={(controlProps) => (
              <Input
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...controlProps}
                autoFocus
                maxLength={MAX_INPUT_FIELD_LIMIT.title}
                placeholder="Enter middleware name"
                label="Middleware name*"
                desc="Give a name to your middleware. The file name in the generated code will be the same as the middleware name."
                error={getError(errors, 'fileName', (errors?.fileName?.type === 'maxLength') ? MAX_INPUT_FIELD_LIMIT.title : 'Middleware name')}
                customRegex={nodeKeyRegex}
              />
            )}
          />

        </div>
      </div>
    </Popup>
  );
});
AddPolicy.displayName = 'AddPolicy';
