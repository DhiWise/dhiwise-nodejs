import React, { useState } from 'react';
import Popover from 'react-popover';
import { Icons } from '@dhiwise/icons';
import { TableViewCss } from '../../../../../../assets/css/tableViewCss';
import { Select } from '../../../../../../components';
import { RELATION_TYPE, SEQUELIZE_RELATION_TYPE } from '../../../../../../constant/model';
import { onSingleKeyDown } from '../../../../../../utils/domMethods';
import { useEditor } from '../../EditorProvider';

const FiledPosition = {
  model: 1,
  foreignField: 2, // isVirtual
  refAttribute: 2, // isSql
  relType: 3, // isSql
};

export const AddRelation = React.memo(({
  modelList, currentId, onInputChange, model, isVirtual, foreignKey, id, onKeyDown, CONST_VARIABLE,
  isSql, type, row, disabled, ...otherProps
}) => {
  const { tableJson } = useEditor();
  const { TABLE_TYPES } = CONST_VARIABLE;
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [modelRef, setModelRef] = React.useState(null);
  const [modelName, setModelName] = React.useState(null);
  const [foreignKeys, setForeignKeys] = React.useState([]);
  const [refAttrOptions, setRefAttrOptions] = React.useState([]);
  const [foreignField, setForeignField] = React.useState(foreignKey);
  const [refAttribute, setRefAttribute] = React.useState();
  const [relType, setRelType] = React.useState(); // default "hasMany"

  React.useEffect(() => setRefAttribute(otherProps?.refAttribute), [otherProps?.refAttribute]);
  React.useEffect(() => setRelType(otherProps?.relType || RELATION_TYPE.HAS_MANY), [otherProps?.relType]);
  const curModel = React.useMemo(() => modelList?.find((m) => m._id === currentId), [modelList, currentId]);

  const onKeyDownHandle = (e, focusField) => {
    if (!isVirtual && !isSql) return;
    onSingleKeyDown(e, focusField, FiledPosition, 'relation');
  };

  React.useEffect(() => {
  // added curModel dependency as update in model name
    setModelRef(model);
    setModelName(modelList?.find((m) => m._id === model)?.name);
  }, [model, curModel]);

  React.useMemo(() => {
    const cmodel = modelList?.find((m) => m._id === modelRef);
    // const curModel = modelList?.find((m) => m._id === currentId);
    if (isVirtual && cmodel?.schemaJson) {
      const fields = Object.keys(cmodel.schemaJson).filter((s) => (cmodel.schemaJson[s]?.ref === curModel?.name
        && cmodel.schemaJson[s]?.type === TABLE_TYPES.OBJECTID));
      if (fields?.length > 0) setForeignKeys(fields.map((x) => ({ id: x, name: x }))); // ff
      else setForeignKeys([]);
    }
    if (isSql && cmodel?.schemaJson) {
      // filter selected model attribute having same selected model-type ('String')
      let fields = [];
      if (modelRef === currentId) {
        // same model relation - the same attribute should not be allowed
        fields = tableJson?.filter((x) => x.attr !== row?.attr && x.type === type).map((x) => x.attr);
      } else {
        fields = Object.keys(cmodel.schemaJson).filter(
          (s) => (type === cmodel.schemaJson[s]?.type),
        );
      }
      if (fields?.length > 0) setRefAttrOptions(fields.map((x) => ({ id: x, name: x })));
      else setRefAttrOptions([]);
    }
  }, [modelRef, currentId, tableJson, type, row?.attr]);

  const showPopup = () => {
    if (disabled) return;
    setIsPopoverOpen(!isPopoverOpen);
    onInputChange('ref', modelRef);
    if (isVirtual) { onInputChange('foreignField', foreignField); }
    if (isSql) {
      onInputChange('refAttribute', refAttribute);
      onInputChange('relType', relType);
    }
  };

  const handleKeyDown = (e) => {
    if (e?.keyCode === 27) {
      showPopup(); // close modal on ESC
      const ele = document.querySelector(`#${id}`);
      ele?.focus();
    }
  };

  React.useEffect(() => {
    if (!isPopoverOpen) {
      // onInputChange('ref', modelRef);
      // onInputChange('foreignField', foreignField);
    } else {
      const nextfield = document.querySelector('#model-relation input');
      nextfield?.focus();
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPopoverOpen]);

  const handleChange = (val) => {
    if (!val || refAttribute) setRefAttribute();
    if (foreignField) setForeignField();
    setModelRef(val);
    const cmodel = modelList.find((m) => m._id === val);
    setModelName(cmodel?.name);
    if (isVirtual && cmodel.schemaJson) {
      const fields = Object.keys(cmodel.schemaJson).filter((s) => (cmodel.schemaJson[s]?.type === TABLE_TYPES.OBJECTID));
      if (fields?.length > 0) setForeignKeys(fields.map((x) => ({ id: x, name: x }))); // ff
      else setForeignKeys([]);
    }
  };

  return (
    <>
      <Popover
        body={[
          <div key={id} id="model-relation" className={`grid grid-cols-1 gap-5 w-56 ${(isVirtual || isSql) && 'grid-cols-2  w-96'}`}>
            <Select
              isClearable={false}
              WrapClassName="w-full"
              placeholder="Select model"
              options={isVirtual ? modelList.filter((m) => m._id !== currentId) : modelList}
              label="Model"
              value={modelRef}
              onChange={handleChange}
              valueKey="_id"
              labelKey="name"
              name="model"
              noOptionsMessage="Please create new model to give reference."
              inputId={`relation${FiledPosition.model}`}
              onKeyDown={(e) => {
                if (e.ctrlKey || e.keyCode === 13) {
                  onKeyDownHandle(e, 'model');
                  if (e.ctrlKey) e.preventDefault();
                }
              }}
            />
            {
              isVirtual && (
                <Select
                  WrapClassName="w-full"
                  placeholder="Select foreign field"
                  options={foreignKeys}
                  label="Foreign field"
                  value={foreignField}
                  onChange={setForeignField}
                  disabled={!modelRef}
                  valueKey="id"
                  labelKey="name"
                  name="foreignField"
                  inputId={`relation${FiledPosition.foreignField}`}
                  onKeyDown={(e) => {
                    if (e.ctrlKey || e.keyCode === 13) {
                      onKeyDownHandle(e, 'foreignField');
                      if (e.ctrlKey) e.preventDefault();
                    }
                  }}
                />
              )
            }
            {
              isSql && (
              <>
                <Select
                  WrapClassName="w-full"
                  placeholder="Select attribute"
                  options={refAttrOptions}
                  label="Attribute"
                  value={refAttribute}
                  onChange={setRefAttribute}
                  disabled={!modelRef}
                  valueKey="id"
                  labelKey="name"
                  name="refAttribute"
                  inputId={`relation${FiledPosition.refAttribute}`}
                  onKeyDown={(e) => {
                    if (e.ctrlKey || e.keyCode === 13) {
                      onKeyDownHandle(e, 'refAttribute');
                      if (e.ctrlKey) e.preventDefault();
                    }
                  }}
                />
                <div className="col-span-2">
                  <Select
                    WrapClassName="w-full"
                    placeholder="Select type"
                    isClearable={false}
                    options={SEQUELIZE_RELATION_TYPE}
                    label="Type"
                    value={relType}
                    onChange={setRelType}
                    name="relType"
                    inputId={`relation${FiledPosition.relType}`}
                    onKeyDown={(e) => {
                      if (e.ctrlKey || e.keyCode === 13) {
                        onKeyDownHandle(e, 'relType');
                        if (e.ctrlKey) e.preventDefault();
                      }
                    }}
                  />
                </div>
              </>
              )
            }
          </div>,
        ]}
        isOpen={isPopoverOpen}
        onOuterAction={showPopup}
        refreshIntervalMs={10}
        enterExitTransitionDurationMs={10}
        tipSize={10}
        className="popupCustom"
      >
        <span
          onClick={showPopup}
          onKeyDown={(e) => {
            onKeyDown(e, 'relation');
            if (e.keyCode === 13) {
              showPopup();
            }
          }}
          tabIndex="0"
          className={`${TableViewCss.addValue}${disabled ? ' opacity-50 cursor-not-allowed' : ''}`}
          id={id}
        >

          <div className="w-4 h-4 mr-2">
            <Icons.Add />
          </div>
          {
            modelRef ? `Edit ${isVirtual ? 'virtual' : ''} relation - ${modelName}` : `Add ${isVirtual ? 'virtual' : ''} relation`
          }
        </span>
      </Popover>
    </>
  );
});
AddRelation.displayName = 'AddRelation';
