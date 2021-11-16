/* eslint-disable no-unused-vars */
import React from 'react';
import { Controller } from 'react-hook-form';
import get from 'lodash/get';
import { Helmet } from 'react-helmet';
import {
  Button, StringInput, TextArea, NumberInput, Select, Checkbox, Input, SelectTree, MessageNotify,

} from '../../../components';
import {
  // APPLICATION_PAGE_HEADING,
  ORM_TYPE,
  DATABASE_TYPE,
  APPLICATION_CODE,
} from '../../../constant/Project/applicationStep';
import TagNameSelect from './addNewTag';

export const ApplicationStep = ({
  applicationStep,
  handleClick,
  loading,
  control,
  errors,
  handleSubmit,
  watch,
  register,
  setValue,
}) => {
  const [isShow, setShow] = React.useState(true);
  const handleClose = () => {
    setShow(false);
  };
  const KeysToComponentMap = {
    stringInput: StringInput,
    textArea: TextArea,
    numberInput: NumberInput,
    dropdown: Select,
    checkbox: Checkbox,
    input: Input,
    selectTree: SelectTree,
    tagNameSelect: TagNameSelect,
  };

  return (
    <>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1,user-scalable=0" />
      </Helmet>

      <div className="pb-5">

        <div className="grid gap-5  grid-cols-1">
          {applicationStep?.map((field) => {
            let isVisible = true;
            if (field.dependentOn) {
              isVisible = watch(field.dependentOn);
            }
            if (field.includes) {
              isVisible = get(watch(), field.dependentOn)?.includes(field.includes);
            }
            if (field.equals) {
              isVisible = get(watch(), field.dependentOn) === field.equals;
            }
            let { options } = field;
            if (field.optionDependent) {
              const filter = [];
              // get(watch(), field.optionDependent)
              //         && get(watch(), field.optionDependent)?.map((data) => filter?.push({ id: data, name: field?.optionFilter?.find((option) => option?.id === data)?.name || data }));
              options = filter;
            }
            if (field.stateKey) {
              options = [];
            }
            return true && (
            // <>

            <>
              {field.messageInfo && isShow && (
              <MessageNotify size="small" messageCloseClass="top-2 bottom-auto sm:right-2" isClose isInfo messageType="info" closeClick={handleClose}>
                {/* eslint-disable-next-line react/no-danger */}
                <div dangerouslySetInnerHTML={{ __html: field.messageInfo }} />
              </MessageNotify>
              )}
              <Controller
                key={field.name + APPLICATION_CODE.nodeExpress}
                control={control}
                name={field.name}
                rules={field.rules}
                defaultValue={field.defaultValue}
                render={(controlProps) => (field.ishidden
                  ? (
                    <input
                      type="hidden"
                      ref={register}
                    />
                  )
                  : React.createElement(KeysToComponentMap[field.component], {
                    ref: register,
                    placeholder: field.placeholder,
                    label: field.label,
                    desc: field.description,
                    error: get(errors ?? '', field.dbKey) ? field.validationMsg[get(errors ?? '', field.dbKey)?.type] : '',
                    options,
                    checked: !!watch(field.dbKey),
                    // fileinputref: field.component === 'folderUpload' ? register(field.rules) : 'false',
                    ...controlProps,
                    ...field.extraProps,
                    onChange: (...args) => {
                      controlProps?.onChange(...args);
                      if (field.dbKey === 'stepInput.databaseType') {
                        args.includes(DATABASE_TYPE.MONGODB) && setValue('stepInput[ormType]', ORM_TYPE.MONGOOSE);
                        Object.values(DATABASE_TYPE).filter((d) => d !== DATABASE_TYPE.MONGODB).some((r) => args.includes(r)) && setValue('stepInput[ormType]', ORM_TYPE.SEQUELIZE);
                      }
                    },
                  }))}
              />
            </>
            );
          })}
        </div>
        <div className="mt-6">
          <Button loading={loading} variant="primary" type="submit" shape="rounded" onClick={handleSubmit(handleClick)}>
            Create application
          </Button>
        </div>

      </div>
    </>
  );
};
