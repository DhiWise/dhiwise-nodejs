import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { toLower } from 'lodash';
import {
  Popup, Input, TextArea,
  // Button,
} from '../../../../components';
import { addModel } from '../../../../redux/reducers/models';
import { API_URLS } from '../../../../api/constants';
import { apiClient } from '../../../../api/config';
import useToastNotifications from '../../../hooks/useToastNotifications';
import { useBoolean } from '../../../../components/hooks';
import { modelAttrRegex, nodeKeyRegex } from '../../../../utils/regex';
import { getError } from '../../../../utils/validationMsgs';
import { MAX_INPUT_FIELD_LIMIT } from '../../../../constant/common';
import {
  mongoDbModalName, DB_CONST, ALL_TABLE_TYPES,
  SQL_MODEL_NAME_LENGTH, DB_TYPE, pluralizeTableName,
} from '../../../../constant/model';

export const CreateModel = (props) => {
  const dispatch = useDispatch();
  const { applicationId, currentApplicationCode, dbType } = useSelector(({ projects }) => ({
    applicationId: projects.currentApplicationId,
    currentApplicationCode: projects.currentApplicationCode,
    dbType: DB_CONST[projects.applicationDatabase.databaseType],
  }), shallowEqual);
  const { addErrorToast, addSuccessToast } = useToastNotifications();
  const [isSubmitting, setSubmitting, removeSetSubmitting] = useBoolean(false);
  const modelNameLength = SQL_MODEL_NAME_LENGTH;
  const {
    handleSubmit, reset, errors, control, watch,
  } = useForm({ mode: 'onChange' });

  const prepareSchema = (schema) => {
    const tSchema = {};
    if (schema) {
      // prepare schema from externally pasted input
      const splitNewLine = schema.split(/\n+/);
      splitNewLine.forEach((s) => {
        const words = s.trim().split(/[\s,.]+/); // trim line and split into words
        words.forEach((ws, i) => {
          let w = ws.trim(); // trim words
          const lastChar = w.charAt(w.length - 1); // get last char
          if (lastChar && !modelAttrRegex.test(w)) {
            // filter out if last char is not valid (name@)
            w = ws.substring(0, ws.length - 1);
          }
          if (i % 2 === 0 && modelAttrRegex.test(w)) {
            const typeArr = Object.values(ALL_TABLE_TYPES[dbType]);
            let isTypeExist;
            if (words[i + 1]) {
              isTypeExist = typeArr.find((o) => toLower(o) === toLower(words[i + 1]));
            } else if (!typeArr.includes(w)) isTypeExist = ALL_TABLE_TYPES[dbType]?.STRING;
            if (isTypeExist) {
              // assign type to attribute name
              tSchema[w] = { type: isTypeExist };
            }
          }
        });
      });
    }
    return tSchema;
  };

  const onSubmit = (data) => {
    if (isSubmitting) return;
    const schemaJson = prepareSchema(data.schema);
    // eslint-disable-next-line no-param-reassign
    delete data.schema;
    const modelName = data.name;

    setSubmitting();

    apiClient(API_URLS.schema.create, {
      ...data,
      name: modelName,
      tableName: pluralizeTableName(modelName, currentApplicationCode),
      schemaJson,
      applicationId,
      definitionType: currentApplicationCode,

    })
      .then((createRes) => {
        addSuccessToast(createRes?.message);
        createRes?.data?._id && dispatch(addModel(createRes?.data));
        props.handleCancel();
        reset();
      })
      .catch((err) => {
        addErrorToast(err);
      })
      .finally(() => {
        removeSetSubmitting();
      });
  };

  return (
    <Popup
      isOpen={props.isOpen}
      handleCancel={props.handleCancel}
      handleSubmit={handleSubmit(onSubmit)}
      closeModal={props.closeModal}
      title="Create new model"
      isCancel
      cancel="Cancel"
      isSubmit
      submit="Create model"
      bodyClass="xxl:max-h-110 overflow-auto xl:max-h-96"
      submitLoading={isSubmitting}
      isAutoFocusOnSave
    >
      <>
        <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-5">
            <Controller
              control={control}
              name="name"
              rules={{ required: true, maxLength: modelNameLength }}
              render={(controlProps) => (
                <Input
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...controlProps}
                  autoFocus
                  placeholder="Enter model name"
                  label="Model name*"
                  customRegex={dbType === DB_TYPE.MONGODB ? mongoDbModalName : nodeKeyRegex}
                  // desc="Kindly enter the model name. The model name you write here will display everywhere."
                  error={getError(errors, 'name', (errors?.name?.type === 'maxLength') ? modelNameLength : 'Model name')}
                />
              )}
            />
            <Controller
              control={control}
              name="tableName"
              defaultValue={watch('name') ? pluralizeTableName(watch('name'), currentApplicationCode) : ''}
              render={(controlProps) => (
                <Input
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...controlProps}
                  disabled
                  placeholder={`${dbType === DB_TYPE.MONGODB ? 'Collection' : 'Table'} name`}
                  label={`${dbType === DB_TYPE.MONGODB ? 'Collection' : 'Table'} name`}
                  value={watch('name') ? pluralizeTableName(watch('name'), currentApplicationCode) : ''}
                />
              )}
            />
          </div>
          <Controller
            control={control}
            name="schema"
            rules={{ required: false, maxLength: MAX_INPUT_FIELD_LIMIT.description }}
            render={(controlProps) => (
              <TextArea
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...controlProps}
                placeholder="Enter model attribute like.&#10;name&#10;type&#10;description"
                label="Model attribute"
                desc="You can quickly enter your model attributes by pasting them in the above box vertically. "
                error={getError(errors, 'schema', (errors?.schema?.type === 'maxLength') ? MAX_INPUT_FIELD_LIMIT.description : 'Attribute')}
              />
            )}
          />
        </form>
      </>
    </Popup>
  );
};
