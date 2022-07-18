/* eslint-disable no-nested-ternary */
/* eslint-disable radix */
import React from 'react';
import { isEmpty, isNaN } from 'lodash';
import {
  APIKeyValue,
} from '../../components';
import { ValueComponent } from '../../components/APIKeyValue';
import { enviromentVaribleCss } from './enviromentVaribleCss';
import { ENV } from '../../constant/envVariable';

import { RESERVED_VARIABLES, RESERVED_VALIDATION_MESSAGE } from '../../constant/reservedVariable';
import { keyBoardShortcut } from '../../utils/domMethods';

let TotalColumns;
export const ValueItem = React.memo(({
  disabled, value, envObj, error, name, onKeyDown, onChange, id, inputId,
}) => (
  <td className={enviromentVaribleCss.keyValueItem}>
    <ValueComponent
      disabled={disabled}
      WrapClassName="w-full"
      placeholder="Enter value"
      value={value}
      name={name}
      inputId={inputId}
      id={id}
      onKeyDown={(e) => {
        if (e.ctrlKey || e.keyCode === 13) {
          onKeyDown(e);
          if (e.ctrlKey) e.preventDefault();
        }
      }}
      onChange={onChange}
      type={envObj.dataType}
      error={!disabled && error ? error : ''}
    />
  </td>
));
ValueItem.displayName = 'ValueItem';
export const KeyValue = React.memo(({
  envObj, environments, onChange, onSelect, onDelete, errors, isLastObj, applicationCode, lengthOfData, rowIndex,
}) => {
  if (!envObj) return null;
  const FiledPosition = {
    checkBox: rowIndex + 1,
    key: rowIndex + 2,
    development: rowIndex + 3,
    qa: rowIndex + 4,
    production: rowIndex + 5,
  };

  const handleRowAutoFocus = (focusFiled) => {
    // eslint-disable-next-line radix
    const field = document.querySelector(`#r${FiledPosition[focusFiled]}`);
    field?.focus();
  };

  // eslint-disable-next-line consistent-return
  const reservedVariableValidation = () => {
    const errorMessage = RESERVED_VALIDATION_MESSAGE;
    if (RESERVED_VARIABLES[applicationCode]?.NODE_EXPRESS?.includes(envObj.key.toLowerCase())) return errorMessage;
    if (RESERVED_VARIABLES.COMMON?.includes(envObj.key.toLowerCase())) return errorMessage;
  };

  // eslint-disable-next-line consistent-return
  const requiredValidation = (e) => {
    const developmentObj = envObj.value.DEVELOPMENT;
    if (envObj.key && e === ENV.DEVELOPMENT && (developmentObj === '' || developmentObj === null || developmentObj === undefined || isNaN(developmentObj))) {
      return 'Value is required';
    }
    if (envObj.key && e === ENV.DEVELOPMENT && (developmentObj === 'true' || developmentObj === 'false')) {
      return '';
    }
  };
  const handleValue = (options) => {
    const tempObj = { ...envObj };
    tempObj.value[options.env] = options.value;
    onChange(tempObj, options.key);
  };

  const handleKey = (options) => {
    const tempObj = { ...envObj };
    tempObj[options.key] = options.value;
    if (options.key === 'dataType') {
      // clear value on change data type
      Object.keys(envObj.value)?.forEach((e) => {
        tempObj.value[e] = '';
      });
    }
    onChange(tempObj, options.key);
    if (options.isFocus) {
      requestAnimationFrame(() => {
        handleRowAutoFocus(options.key);
      });
    }
  };

  const onKeyDownHandel = (e, focusField) => {
    TotalColumns = 4;
    const focusIndex = FiledPosition[focusField];

    keyBoardShortcut({
      keyEvent: e,
      focusIndex,
      totalColumns: TotalColumns,
      totalRows: lengthOfData,
    });
  };

  return (
    <>
      <td className={enviromentVaribleCss.keyValueItemFirst}>
        <APIKeyValue
          envVariable
          isCheckBox
          isDelete
          deleteProps={{ onDelete: () => onDelete(envObj), disabled: isLastObj && !envObj.key }}
          inputProps={{
            id: `r${FiledPosition.key}`,
            name: 'key',
            value: envObj.key,
            onChange: (e) => handleKey({ value: e.toUpperCase(), key: 'key' }),
            onKeyDown: (e) => {
              onKeyDownHandel(e, 'key');
            },
            autoComplete: 'off',
            error: errors && (reservedVariableValidation() || ((Object.keys(environments)?.filter((e) => environments[e])?.some((env) => envObj?.value[env])) && isEmpty(envObj.key) ? 'Key is required.' : '')),
          }}
          checkboxProps={{
            id: `r${FiledPosition.checkBox}`,
            value: true,
            checked: !!envObj.isSelected,
            onChange: (val) => {
              onSelect(envObj, val);
            },
            onKeyDown: (e) => {
              if (e.keyCode === 13) { onSelect(envObj, !e.target.checked, `r${FiledPosition.checkBox}`); }
            },
          }}
        />
      </td>
      <table>
        <tr className="align-top">
          {
            Object.keys(ENV).map((e) => (
              <ValueItem
                // eslint-disable-next-line no-nested-ternary
                id={e === 'DEVELOPMENT' ? `r${FiledPosition.development}` : e === 'QA' ? `r${FiledPosition.qa}` : `r${FiledPosition.production}`}
                // eslint-disable-next-line no-nested-ternary
                inputId={e === 'DEVELOPMENT' ? `r${FiledPosition.development}` : e === 'QA' ? `r${FiledPosition.qa}` : `r${FiledPosition.production}`}
                name={`value${e}`}
                envObj={envObj}
                key={e}
                disabled={!environments[e]}
                value={envObj.value ? envObj.value[e] : undefined}
                onChange={(val) => handleValue({
                  value: val, env: ENV[e], key: e === 'DEVELOPMENT' ? `r${FiledPosition.development}` : e === 'QA' ? `r${FiledPosition.qa}` : `r${FiledPosition.production}`, isFocus: true,
                })}
                onKeyDown={(event) => {
                  // eslint-disable-next-line no-nested-ternary
                  onKeyDownHandel(event, e === 'DEVELOPMENT' ? 'development' : e === 'QA' ? 'qa' : 'production');
                }}
                error={errors && requiredValidation(e)}
              />
            ))
          }
        </tr>
      </table>
    </>
  );
});
KeyValue.displayName = 'KeyValue';
