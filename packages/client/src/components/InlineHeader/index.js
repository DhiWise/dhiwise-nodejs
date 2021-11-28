import React, { useEffect } from 'react';
import { Icons } from '@dhiwise/icons';

import { MAX_INPUT_FIELD_LIMIT } from '../../constant/common';
import { DB_TYPE, pluralizeTableName } from '../../constant/model';
import { nodeKeyRegex } from '../../utils/regex';
import { Heading, Tag } from '../index';
import { variantConstant } from '../Tag';

export const InlineHeader = ({
  defaultValue,
  currentId,
  isDisable,
  isActiveButton,
  edit,
  titlePlaceHolder,
  titleLength,
  isDisableNameEdit,
  titleRegex,
  showTableName,
  dbType,
  currentApplicationCode,
  onBlurEvent,
  setShowEdit,
  setHideEdit,
}) => {
  const [internalState, setInternalState] = React.useState();

  useEffect(() => {
    setInternalState(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setHideEdit();
  }, [currentId]);

  const blurEvent = (key, value, modelId) => {
    if (!value || defaultValue[key] === value) {
      setInternalState((prevData) => ({
        ...prevData,
        [key]: defaultValue[key],
      }));
      return;
    }
    if (key === 'description') setHideEdit();
    onBlurEvent(key, value, modelId);
  };

  return (
    <div className="w-8/12 xxl:w-6/12">
      {!edit && (
        <>
          <div className="">
            <Heading variant="h4" className="flex items-center word-break">
              <span className="truncate block flex-grow-0">
                {internalState?.name || internalState?.fileName}
              </span>
              {!isDisable && !isDisableNameEdit && (
                <span
                  className="w-4 h-4 cursor-pointer ml-2 flex-shrink-0 block"
                  onClick={setShowEdit}
                >
                  <Icons.Edit />
                </span>
              )}
              {isActiveButton && (
                <Tag
                  className="ml-2 whitespace-nowrap flex-shrink-0"
                  variant={
                    internalState?.isActive
                      ? variantConstant.active
                      : variantConstant.deactive
                  }
                  title={internalState?.isActive ? 'Active' : 'Deactive'}
                  onClick={() =>
                    !isDisable &&
                    onBlurEvent('isActive', !internalState?.isActive)
                  }
                />
              )}
            </Heading>
          </div>
        </>
      )}
      {edit && (
        <>
          <input
            placeholder={titlePlaceHolder}
            className="focus:outline-none leading-8 text-xl text-primary-text bg-transparent font-semibold font-title w-full"
            value={
              defaultValue?.name ? internalState?.name : internalState?.fileName
            }
            defaultValue={
              defaultValue?.name ? internalState?.name : internalState?.fileName
            }
            onChange={(e) => {
              if (
                (!e.target.value || titleRegex.test(e.target.value)) &&
                e.target.value?.length <= titleLength
              ) {
                setInternalState((prevData) => ({
                  ...prevData,
                  [defaultValue?.name ? 'name' : 'fileName']: e.target.value,
                }));
              }
            }}
            onBlur={(e) => {
              blurEvent(
                defaultValue?.name ? 'name' : 'fileName',
                e.currentTarget.value,
                defaultValue?._id
              );
              setHideEdit();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                // descRef.current?.focus();
                blurEvent(
                  defaultValue?.name ? 'name' : 'fileName',
                  e.currentTarget.value,
                  defaultValue?._id
                );
                setHideEdit();
              }
            }}
          />
        </>
      )}
      {showTableName && ( // display table/collection name field in Model
        <div className="mt-1 flex">
          <span className="text-body-text text-sm">{`${
            dbType === DB_TYPE.MONGODB ? 'Collection' : 'Table'
          } name:`}</span>
          <div className="text-primary-text text-sm ml-1">
            {internalState &&
              pluralizeTableName(internalState?.name, currentApplicationCode)}
          </div>
        </div>
      )}
    </div>
  );
};

InlineHeader.defaultProps = {
  isDisable: false,
  isActiveButton: false,
  edit: false,
  titlePlaceHolder: 'Name',
  titleLength: MAX_INPUT_FIELD_LIMIT.title,
  isDisableNameEdit: false,
  titleRegex: nodeKeyRegex,
  showTableName: false,
  dbType: '',
  currentApplicationCode: '',
  onBlurEvent: () => {},
  setShowEdit: () => {},
  setHideEdit: () => {},
};
