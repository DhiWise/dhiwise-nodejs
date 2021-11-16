/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import Drawer from 'rc-drawer';
import {
  capitalize, cloneDeep, isEmpty, omit, toLower,
} from 'lodash';
import { Controller, useFormContext } from 'react-hook-form';
import omitDeep from 'omit-deep-lodash';
import {
  DrawerClose, DrawerHead, Radio, RadioGroup, Input, Select, DrawerFooter, SelectTree,
} from '../../../../components';
import {
  ATTRIBUTE_FORMAT_DATA_TYPE, MODEL_TYPE, DATE_OPTIONS, STR_OPERATORS,
} from '../../../../constant/applicationConfigConstant';
import { getError } from '../../../../utils/validationMsgs';
import { MAX_INPUT_FIELD_LIMIT } from '../../../../constant/common';
import { useToastNotifications } from '../../../hooks';

const options = [
  { name: capitalize(ATTRIBUTE_FORMAT_DATA_TYPE.DATE), id: ATTRIBUTE_FORMAT_DATA_TYPE.DATE },
  { name: capitalize(ATTRIBUTE_FORMAT_DATA_TYPE.BOOLEAN), id: ATTRIBUTE_FORMAT_DATA_TYPE.BOOLEAN },
  { name: capitalize(ATTRIBUTE_FORMAT_DATA_TYPE.STRING), id: ATTRIBUTE_FORMAT_DATA_TYPE.STRING },
];

// const dateOpts = DATE_OPTIONS.map((x) => ({ id: x, name: x }));
const strOperatorOpts = STR_OPERATORS.map((x) => ({ id: x, name: x }));

const DEFAULT_KEYS = {
  title: '',
  dataType: ATTRIBUTE_FORMAT_DATA_TYPE.DATE,
  isAllModels: MODEL_TYPE.ALL,
  modelId: '',
  targetAttr: '',
  operand1: null,
  operator: null,
  operand2: null,
  true: '',
  false: '',
  attribute: null,
};

export const AddDataFormat = ({
  isOpen, onClose, editData, onSubmit, loading,
}) => {
  const { modelList } = useSelector(({ models }) => ({
    modelList: models.modelList,
  }), shallowEqual);
  const { addErrorToast } = useToastNotifications();
  const buttonRef = React.useRef('');

  const methods = useFormContext();
  const {
    errors, control, watch, handleSubmit, setValue, clearErrors,
  } = methods;

  React.useEffect(() => {
    if (editData) {
      // edit data
      const {
        title, isAllModels, dataType, attribute, targetAttr, operator, modelId,
      } = editData;
      setValue('title', title);
      setValue('dataType', dataType);
      setValue('isAllModels', isAllModels ? MODEL_TYPE.ALL : MODEL_TYPE.SINGLE);
      setValue('modelId', modelId);
      if (dataType === ATTRIBUTE_FORMAT_DATA_TYPE.DATE) { setValue('attribute', attribute); }
      if (dataType === ATTRIBUTE_FORMAT_DATA_TYPE.BOOLEAN) {
        setValue('true', attribute?.true);
        setValue('false', attribute?.false);
      }
      if (dataType === ATTRIBUTE_FORMAT_DATA_TYPE.STRING) {
        setValue('operand1', attribute?.[0]);
        setValue('operand2', attribute?.[1]);
        setValue('operator', operator);
        setValue('targetAttr', targetAttr);
      }
    } else {
      setValue('isAllModels', MODEL_TYPE.ALL);
      setValue('dataType', ATTRIBUTE_FORMAT_DATA_TYPE.DATE);
    }
  }, [editData]);

  // React.useMemo(() => {
  //   if (watch('isAllModels') && !editData) {
  //     // set default data type while add
  //     if (!watch('dataType') && watch('isAllModels') === MODEL_TYPE.SINGLE) { setValue('dataType', ATTRIBUTE_FORMAT_DATA_TYPE.STRING); }
  //     if (watch('dataType') === ATTRIBUTE_FORMAT_DATA_TYPE.STRING && watch('isAllModels') === MODEL_TYPE.ALL) { setValue('dataType', ATTRIBUTE_FORMAT_DATA_TYPE.DATE); }
  //   }
  // }, [editData, watch('isAllModels')]);

  React.useMemo(() => {
    if (!isEmpty(errors)) {
      // clear errors on type change
      const type = watch('dataType');
      Object.keys(errors).forEach((x) => {
        if (type === ATTRIBUTE_FORMAT_DATA_TYPE.DATE) {
          const resetErrArr = ['targetAttr', 'operand1', 'operand2', 'operator', 'true', 'false'];
          resetErrArr.includes(x);
          clearErrors(resetErrArr);
        } else if (type === ATTRIBUTE_FORMAT_DATA_TYPE.BOOLEAN) {
          const resetErrArr = ['targetAttr', 'operand1', 'operand2', 'operator', 'attribute'];
          resetErrArr.includes(x);
          clearErrors(resetErrArr);
        } else if (type === ATTRIBUTE_FORMAT_DATA_TYPE.STRING) {
          const resetErrArr = ['true', 'false', 'attribute'];
          resetErrArr.includes(x);
          clearErrors(resetErrArr);
        }
      });
    }
  }, [watch('dataType')]);

  React.useMemo(() => {
    if (!isEmpty(errors) && watch('isAllModels') === MODEL_TYPE.ALL) {
      // clear errors on model change
      const isModelErr = Object.keys(errors).find((x) => x === 'modelId');
      if (isModelErr) { clearErrors(['modelId']); }
    }
  }, [watch('isAllModels')]);

  const handleChaneModelType = (val) => {
    if (watch('dataType') === ATTRIBUTE_FORMAT_DATA_TYPE.STRING && val === MODEL_TYPE.ALL) {
      setValue('dataType', ATTRIBUTE_FORMAT_DATA_TYPE.DATE);
    }
  };

  const handleChangeModel = () => {
    if (watch('dataType') === ATTRIBUTE_FORMAT_DATA_TYPE.STRING) {
      setValue('operand1', null);
      setValue('operand2', null);
    }
  };

  const getOp2Opts = React.useMemo(() => {
    //  attribute that is selected in first dropdown should be excluded from second dropdown
    let obj = { ...modelList?.find((model) => model?._id === watch('modelId'))?.schemaJson } || {};
    if (!isEmpty(obj)) {
      obj = omitDeep(obj, [watch('operand1'), 'password', 'PASSWORD', 'Password']);
    }
    return obj;
  }, [watch('operand1')]);

  const getOp1Opts = React.useMemo(() => {
    let obj = { ...modelList?.find((model) => model?._id === watch('modelId'))?.schemaJson } || {};
    if (!isEmpty(obj)) {
      obj = omitDeep(obj, ['password', 'PASSWORD', 'Password']);
    }
    return obj;
  }, [watch('modelId')]);

  const checkDuplicateKey = (data, obj, key = 'title') => {
    const isExist = data?.responseFormatter?.find((x) => {
      if (!editData) { return toLower(x[key]) === toLower(obj[key]); } // while add
      if (editData[key] !== x[key]) return toLower(x[key]) === toLower(obj[key]); // while edit
      return false;
    });
    if (isExist) { return addErrorToast('Title already exists.'); }
    return true;
  };

  const checkDuplicateDataType = (data, obj) => {
    const isExist = data?.responseFormatter?.find((x) => {
      const modelCondi = obj.isAllModels ? x.isAllModels === obj.isAllModels : x.modelId === obj.modelId;
      let condi = x.dataType === obj.dataType && modelCondi;

      if (obj.dataType === ATTRIBUTE_FORMAT_DATA_TYPE.STRING) {
        const strCondi = x.targetAttr === obj.targetAttr;
        // const strCondi = x.operator === obj.operator && isEqual(x.attribute, obj.attribute) && x.taregetAttr === obj.taregetAttr;
        condi = condi && strCondi;
      }
      if (!editData) { return condi; } // while add
      if (editData.title !== x.title) return condi; // while edit
      return false;
    });
    if (isExist) { return addErrorToast('Record already exists.'); }
    return true;
  };

  const resetFields = (isDefault) => {
    Object.keys(DEFAULT_KEYS).map((x) => {
      setValue(x, isDefault ? DEFAULT_KEYS[x] : undefined);
      return x;
    });
  };

  const handleCancel = () => {
    resetFields();
    onClose();
    buttonRef.current = null;
  };

  const handleSave = (params, name) => {
    let data = { ...params };
    const obj = {
      title: data.title,
      isAllModels: data.isAllModels === MODEL_TYPE.ALL,
      dataType: data.dataType,
    };
    if (!checkDuplicateKey(data, obj)) return; // validate unique title
    if (!obj.isAllModels) { obj.modelId = data.modelId; }
    if (data.dataType === ATTRIBUTE_FORMAT_DATA_TYPE.DATE) {
      obj.attribute = data.attribute;
    }
    if (data.dataType === ATTRIBUTE_FORMAT_DATA_TYPE.BOOLEAN) {
      obj.attribute = { true: data.true, false: data.false };
    }
    if (!obj.isAllModels && data.dataType === ATTRIBUTE_FORMAT_DATA_TYPE.STRING) {
      // single model
      obj.targetAttr = data.targetAttr;
      obj.operator = data.operator;
      obj.attribute = [data.operand1, data.operand2];
    }
    if (!checkDuplicateDataType(data, obj)) return; // validate unique data type model wise

    data = omit(data, Object.keys(DEFAULT_KEYS));
    if (editData) {
      const index = data.responseFormatter?.findIndex((x) => x.title === editData.title);
      data.responseFormatter[index] = obj;
    } else {
      const temp = cloneDeep(data.responseFormatter || []);
      temp.push(obj);
      data.responseFormatter = temp;
    }
    data.responseFormatter = data?.responseFormatter?.map((x) => omit(x, 'model'));
    buttonRef.current = name;
    onSubmit(data, () => {
      if (name === 'save') {
        handleCancel();
      } else if (name === 'next') resetFields(true);
    }, !editData, !!editData); // pass value to isCreate and isUpdate flags
  };

  return (
    <Drawer
      open={isOpen}
      onClose={handleCancel}
      handleCancel={handleCancel}
      ease
      level={null}
      handler={false}
      placement="right"
      wrapperClassName=""
    >
      <DrawerClose onClick={handleCancel} />
      <DrawerHead title={`${editData ? 'Update' : 'Add'} data format`} />
      <div className="p-5 overflow-auto flex-grow">
        <Controller
          control={control}
          name="title"
          rules={{ required: true, maxLength: MAX_INPUT_FIELD_LIMIT.title }}
          render={(controlProps) => (
            <Input
              {...controlProps}
              placeholder="Enter title"
              size="medium"
              label="Title"
              error={getError(errors, 'title', (errors?.name?.type === 'maxLength') ? MAX_INPUT_FIELD_LIMIT.title : 'Title')}
            />
          )}
        />
        <div className="flex my-5">
          <Controller
            control={control}
            name="isAllModels"
            render={(controlProps) => (
              <RadioGroup
                {...controlProps}
                className="flex"
                selectedValue={controlProps.value}
                onChange={(val) => {
                  controlProps.onChange(val);
                  handleChaneModelType(val);
                }}
              >
                <Radio value={MODEL_TYPE.ALL}>All model</Radio>
                <Radio value={MODEL_TYPE.SINGLE}>Single model</Radio>
              </RadioGroup>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-5 mb-5">
          {watch('isAllModels') === MODEL_TYPE.SINGLE && (
          <>
            <div className="col-span-2">
              <Controller
                control={control}
                name="modelId"
                rules={{ required: true }}
                render={(controlProps) => (
                  <Select
                    {...controlProps}
                    isClearable={false}
                    options={modelList?.map((x) => ({ id: x._id, name: x.name }))}
                    placeholder="Select model"
                    label="Model"
                    sizeMedium
                    onChange={(val) => {
                      controlProps.onChange(val);
                      handleChangeModel();
                    }}
                    error={getError(errors, 'modelId', 'Model')}
                  />
                )}
              />
            </div>
          </>
          )}
          <Controller
            control={control}
            name="dataType"
            render={(controlProps) => (
              <Select
                {...controlProps}
                isClearable={false}
                options={watch('isAllModels') === MODEL_TYPE.ALL ? options.filter((x) => x.id !== ATTRIBUTE_FORMAT_DATA_TYPE.STRING) : options}
                placeholder="Select data type"
                label="Data type"
                sizeMedium
              />
            )}
          />
          {watch('dataType') === ATTRIBUTE_FORMAT_DATA_TYPE.DATE && (
            <>
              <Controller
                control={control}
                name="attribute"
                rules={{ required: true }}
                render={(controlProps) => (
                  <Input
                    {...controlProps}
                    placeholder="Enter format"
                    size="medium"
                    label="Format"
                    list="format"
                    autoComplete="off"
                    error={getError(errors, 'attribute', 'Format')}
                  />
                  // <Select
                  //   {...controlProps}
                  //   options={dateOpts}
                  //   placeholder="Enter format"
                  //   size="medium"
                  //   label="Format"
                  //   error={getError(errors, 'attribute', 'Format')}
                  // />
                )}
              />
              {
           !isEmpty(watch('attribute'))
            && (
              <datalist id="format">
                {DATE_OPTIONS.map((option) => (
                  option.toLowerCase().includes(watch('attribute')) && (
                  <option key={option} value={option}>
                    {option}
                  </option>
                  )
                ))}
              </datalist>
            )
          }
            </>
          )}
          {watch('dataType') === ATTRIBUTE_FORMAT_DATA_TYPE.BOOLEAN && (
          <div className="grid grid-cols-2 gap-5 col-span-2">
            <Controller
              control={control}
              name="true"
              rules={{ required: true }}
              render={(controlProps) => (
                <Input
                  {...controlProps}
                  placeholder="Enter true value"
                  size="medium"
                  label="True value"
                  error={getError(errors, 'true', 'True value')}
                />
              )}
            />
            <Controller
              control={control}
              name="false"
              rules={{ required: true }}
              render={(controlProps) => (
                <Input
                  {...controlProps}
                  placeholder="Enter false value"
                  size="medium"
                  label="False value"
                  error={getError(errors, 'false', 'False value')}
                />
              )}
            />
          </div>
          )}
          {watch('dataType') === ATTRIBUTE_FORMAT_DATA_TYPE.STRING && (
          <>
            <Controller
              control={control}
              name="targetAttr"
              rules={{ required: true }}
              render={(controlProps) => (
                <Input
                  {...controlProps}
                  size="medium"
                  placeholder="Enter target"
                  label="Target"
                  sizeMedium
                  error={getError(errors, 'targetAttr', 'Target attribute')}
                />
              )}
            />
            <div className="grid grid-cols-3 gap-5 mb-5 col-span-2">
              <Controller
                control={control}
                name="operand1"
                rules={{ required: true }}
                render={(controlProps) => (
                  <SelectTree
                    {...controlProps}
                    size="medium"
                    placeholder="Select attribute"
                    label="Attribute"
                    defaultValue={controlProps.value ? [controlProps.value] : []}
                    mode="radioSelect"
                    data={getOp1Opts}
                    handleChange={({ allSelectedNode }) => {
                      controlProps.onChange(allSelectedNode?.[0]?.fullName);
                    }}
                    error={getError(errors, 'operand1', 'Attribute')}
                  />
                )}
              />
              <Controller
                control={control}
                name="operator"
                rules={{ required: true }}
                render={(controlProps) => (
                  <Select
                    {...controlProps}
                    options={strOperatorOpts}
                    placeholder="Select operator"
                    sizeMedium
                    label="Operator"
                    error={getError(errors, 'operator', 'Operator')}
                  />
                )}
              />
              <Controller
                control={control}
                name="operand2"
                rules={{ required: true }}
                render={(controlProps) => (
                  <SelectTree
                    {...controlProps}
                    size="medium"
                    options={options}
                    placeholder="Select attribute"
                    label="Attribute"
                    defaultValue={controlProps.value ? [controlProps.value] : []}
                    mode="radioSelect"
                    disabled={!watch('operand1')}
                    data={getOp2Opts}
                    handleChange={({ allSelectedNode }) => {
                      controlProps.onChange(allSelectedNode?.[0]?.fullName);
                    }}
                    error={getError(errors, 'operand2', 'Attribute')}
                  />
                )}
              />
            </div>
          </>
          )}
        </div>
      </div>
      <DrawerFooter
        isAutoFocusOnSave
        isSaveNext={!editData}
        cancelTitle="Cancel"
        handleSubmit={handleSubmit((data) => handleSave(data, 'save'))}
        handleNextSubmit={handleSubmit((data) => handleSave(data, 'next'))}
        handleCancel={handleCancel}
        saveNext={!editData ? 'Save' : ''}
        submitTitle={!editData ? 'Save & Add more' : 'Update'}
        isSubmitting={buttonRef?.current === 'next' ? false : loading}
        isNextSubmitting={buttonRef?.current === 'next' ? loading : false}
      />
    </Drawer>
  );
};
