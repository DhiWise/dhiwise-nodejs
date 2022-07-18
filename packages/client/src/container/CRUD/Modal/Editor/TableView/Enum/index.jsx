import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Popover from 'react-popover';
import { Icons } from '@dhiwise/icons';
import { isArray, isEmpty, omit } from 'lodash';
import { listConstants } from '../../../../../../redux/thunks/constants';
import {
  Checkbox, Heading, SelectTree, Select, IconBox,
} from '../../../../../../components';
import { onSingleKeyDown } from '../../../../../../utils/domMethods';

const FiledPosition = {
  enumFile: 1,
  constAttr: 2,
};

export const Enum = React.memo(({
  row, onInputChange, disabled, id, onKeyDown,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [enumFile, setEnumFile] = React.useState();
  const [isEnum, setIsEnum] = React.useState(row?.isEnum);
  const [enumAttribute, setEnumAttribute] = React.useState();
  const dispatch = useDispatch();
  const applicationId = useSelector((state) => state.projects.currentApplicationId);
  const constantList = useSelector((state) => state.constants.constantList);
  const attrOptions = React.useMemo(() => {
    let tempJson = constantList?.find((c) => c?.fileName === enumFile)?.customJson || {};
    if (!isEmpty(tempJson)) {
      // enum attribute options value having type object only (user_type:{admin:1})
      Object.keys(tempJson).forEach((x) => {
        if (typeof tempJson?.[x] === 'object' && !isArray(tempJson[x])) {
          // allow
        } else {
          tempJson = omit(tempJson, x);
        }
      });
    }
    return tempJson;
  }, [constantList, enumFile]);

  const fetchAllConstant = () => {
    dispatch(listConstants({
      applicationId,
      isActiveDeactivateDisplay: true,
    }));
  };

  React.useEffect(() => { if (isPopoverOpen) fetchAllConstant(); }, [isPopoverOpen]);

  React.useEffect(() => { setEnumFile(row?.enum?.enumFile); }, [row?.enum?.enumFile]);
  React.useEffect(() => { setEnumAttribute(row?.enum?.enumAttribute); }, [row?.enum?.enumAttribute]);
  React.useMemo(() => { setIsEnum(row?.isEnum); }, [row?.isEnum]);
  React.useMemo(() => {
    if (enumFile && !constantList?.find((x) => x?.fileName === enumFile)) {
      onInputChange('enum', {
        ...row?.enum,
        enumFile: null,
      });
    }
    if (enumAttribute && attrOptions && !Object.keys(attrOptions)?.find((x) => x === enumAttribute)) {
      onInputChange('enum', {
        ...row?.enum,
        enumAttribute: '',
      });
    }
  }, [constantList]);

  const showPopup = React.useCallback(() => {
    if (isPopoverOpen && isEnum) {
      // if popup is open and at a time closing
      if (row?.enum?.enumAttribute !== enumAttribute) {
        onInputChange('enum', {
          ...row?.enum,
          enumAttribute,
          enumFile,
        });
      }
    }
    setIsPopoverOpen(!isPopoverOpen);
  }, [isPopoverOpen, isEnum, row, onInputChange, enumAttribute]);

  const onKeyDownHandle = (e, focusField) => {
    onSingleKeyDown(e, focusField, FiledPosition, 'enum', { inputWithId: focusField === 'enumFile' });
  };

  const handleKeyDown = React.useCallback((e) => {
    if (e?.keyCode === 27) {
      showPopup(); // close modal on ESC
      const ele = document.querySelector(`#${id}`);
      ele?.focus();
    }
  }, [showPopup, id]);

  React.useMemo(() => {
    // if (!isPopoverOpen && isEnum) {
    // commented for => if popup is open and at a time closing
    //   if (row?.enum?.enumAttribute !== enumAttribute) {
    //     onInputChange('enum', {
    //       enumAttribute, enumFile,
    //     });
    //   }
    // }

    if (isPopoverOpen) {
      // focus on first field
      const nextfield = document.querySelector('#enum input');
      nextfield?.focus();
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPopoverOpen, isEnum]);

  const handleChange = React.useCallback((value) => {
    setEnumFile(value);
    if (enumAttribute) setEnumAttribute();
    // requestAnimationFrame(() => { //remove focus onBlur
    //   onAutoFocus?.('enumFile', 'enum'); // manage auto focus
    // });
  }, [enumAttribute]);

  const handleChangeAttr = React.useCallback((value) => {
    setEnumAttribute(value?.currentSelectedNode?.fullName);
  }, []);

  const handleChangeEnum = React.useCallback((val) => {
    onInputChange('isEnum', val);
    setIsEnum(val);
    setIsPopoverOpen(val);
  }, []);

  const WrapCheckbox = React.useCallback(() => (
    <Checkbox
      name="isEnum"
      checked={!!isEnum}
      disabled={disabled}
      onChange={handleChangeEnum}
      id={id}
      onKeyDown={(e) => {
        if (e.keyCode === 13) {
          handleChangeEnum(!e?.target?.checked);
        }
        onKeyDown(e);
      }}
    >
      <span className={`ml-2 text-xs ${disabled ? ' cursor-not-allowed' : ''}`}>
        Enum setup
      </span>
    </Checkbox>
  ), [isEnum, disabled, id, onKeyDown, handleChangeEnum]);

  const handleRefresh = () => {
    fetchAllConstant();
  };

  return (
    <>
      <Popover
        body={[
          <div className="w-80" id="enum" key="enumKey">
            <div className="border-b border-gray-90 pb-3 flex items-center justify-between">
              <Heading variant="h5">
                Constant selection
              </Heading>
              <div className="flex items-center">
                <IconBox
                  icon={<Icons.Plus color="#ffffff" />}
                  variant="primary"
                  tooltip="Add constant"
                  size="small"
                  onClick={() => {
                    window.open('/node/constant');
                  }}
                />
                <IconBox variant="outline" tooltip="Refresh" size="small" className="ml-2" icon={<Icons.Refresh />} onClick={handleRefresh} />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <Select
                name="enumFile"
                isClearable={false}
                label="Constant file"
                placeholder="Select constant file"
                labelKey="fileName"
                valueKey="fileName"
                options={constantList}
                value={enumFile}
                onChange={handleChange}
                inputId={`enum${FiledPosition.enumFile}`}
                onKeyDown={(e) => {
                  if (e.ctrlKey || e.keyCode === 13) {
                    if (e.ctrlKey) e.preventDefault();
                    onKeyDownHandle(e, 'enumFile');
                  }
                }}
              />

              <SelectTree
                id={`enum${FiledPosition.constAttr}`}
                name="constAttr"
                label="Enum attribute"
                texts={{ placeholder: 'Select enum attribute' }}
                placeholder="Select enum attribute"
                mode="radioSelect"
                disabled={!enumFile}
                data={attrOptions}
                defaultValue={enumAttribute ? [enumAttribute] : []} // set value in array as per package
                handleChange={handleChangeAttr}
                onKeyDown={(e) => {
                  if (e.ctrlKey || e.keyCode === 13) {
                    onKeyDownHandle(e, 'constAttr');
                    if (e.ctrlKey) e.preventDefault();
                  }
                }}
              />
            </div>
          </div>,
        ]}
        isOpen={isPopoverOpen}
        onOuterAction={showPopup}
        refreshIntervalMs={10}
        enterExitTransitionDurationMs={10}
        tipSize={10}
        place={null}
        className="popupCustom"
      >
        {/* <div className="flex items-center" id={`${row.key}isEnum`}> */}
        <div className={`flex items-center${disabled ? ' opacity-50 cursor-not-allowed' : ''}`}>
          <WrapCheckbox />
          <div
            className={`w-2.5 h-2.5 ml-2 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={disabled ? null : showPopup}
          >
            <Icons.DownArrow />
          </div>
        </div>
      </Popover>
    </>
  );
});
Enum.displayName = 'Enum';
