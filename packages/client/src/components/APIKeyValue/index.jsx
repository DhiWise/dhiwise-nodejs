/* eslint-disable radix */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useSelector } from 'react-redux';
import { isEmpty, toLower } from 'lodash';
import { Icons } from '@dhiwise/icons';
import { Input } from '../Input';
import { Select } from '../Select';
import { DeleteIcon } from '../IconBox/DeleteIcon';
import { Checkbox } from '../Checkbox';
import { useBoolean } from '../hooks';
import { ConfirmationAlert } from '../ConfirmAlert';
import { TYPE_OPTIONS } from '../../constant/envVariable';
import { nodeKeyRegex } from '../../utils/regex';
import { APPLICATION_CODE } from '../../constant/Project/applicationStep';
import { MAX_INPUT_FIELD_LIMIT } from '../../constant/common';

export const ValueComponent = ({ type, ...other }) => {
  // customOptions name different it issue boolean
  const options = other.customOptions ?? [];// constant for data type
  const dataType = toLower(type);
  if (dataType && toLower(options?.STRING) === dataType) return <Input size="medium" WrapClassName="" placeholder="Enter value" {...other} />;
  if (dataType && toLower(options?.LONG) === dataType) {
    return (
      <Input.Number
        size="medium"
        WrapClassName=""
        placeholder="Enter value"
        {...other}
        value={other.value ? other.value.toString() : ''}
        onChange={(val) => other?.onChange(parseInt(val))}
        fixLength={10}
      />
    );
  }
  if (dataType && [toLower(options?.FLOAT), toLower(options?.DOUBLE)].includes(dataType)) {
    return (
      <Input.Decimal
        size="medium"
        WrapClassName=""
        placeholder="Enter value"
        {...other}
        value={other.value ? other.value.toString() : ''}
        onChange={(val) => other?.onChange(Number(val))}
        fixLength={20}
      />
    );
  }
  if (dataType && toLower(options?.INTEGER) === dataType) {
    return (
      <Input.Number
        size="medium"
        WrapClassName=""
        placeholder="Enter value"
        {...other}
        value={other.value ? other.value.toString() : ''}
        onChange={(val) => other?.onChange(parseInt(val))}
        fixLength={10}
      />
    );
  }
  if (dataType && toLower(options?.BOOLEAN) === dataType) {
    return (
      <div className="tableInputSelect">
        <Select
          sizeMedium
          options={[{ id: 'true', name: 'TRUE' }, { id: 'false', name: 'FALSE' }]}
          valueKey="id"
          {...other}
          value={other?.value?.toString()}
          onChange={(val) => {
            other?.onChange(val ? val === 'true' : null);
            other?.onAutoFocus?.();
          }}
          placeholder="Select value"
        />
      </div>
    );
  }
  return <Input size="medium" WrapClassName="" placeholder="Enter value" {...other} />;
};

const TableWrap = ({ children, className, inTableView }) => (inTableView ? <td className={className}>{children}</td> : children);
export const APIKeyValue = ({
  isDelete, isTypeSelect, isValue, isCheckBox, isAutoSuggest, typeProps = {}, checkboxProps = {}, APIValue, envVariable, tableView, inputProps = {}, valueProps = {}, deleteProps = {}, autoSuggestProps = {}, inTableView = true,
}) => {
  const applicationCode = useSelector((state) => state.projects.currentApplicationCode);
  const [isOpenDelete, showDelete, hideDelete] = useBoolean(false);
  const valueRef = React.useRef(null);
  const WrapCheckbox = (otherProps) => <Checkbox wrapClass="absolute left-7 top-1" {...otherProps} />;
  return (
    <>
      <TableWrap inTableView={inTableView} className={`pl-10 relative ${envVariable && 'relative pl-16 pr-3'} ${APIValue && 'pr-4 pb-4'}`}>
        {isDelete && (
          <DeleteIcon
            size="small"
            disabled={deleteProps?.disabled}
            icon={<Icons.Close />}
            tooltip="Delete"
            className={`absolute  m-auto ${tableView ? 'left-0 top-4' : 'left-0 top-2'}`}
            onClick={showDelete}
          />
        )}

        {isCheckBox && <WrapCheckbox {...checkboxProps} />}
        <div className={`${APIValue ? 'w-full' : 'tableInputSelect'}`}><Input maxLength={MAX_INPUT_FIELD_LIMIT.key} size="medium" WrapClassName="" placeholder="Enter key" customRegex={nodeKeyRegex} {...inputProps} /></div>

      </TableWrap>
      {
        isAutoSuggest && !isEmpty(inputProps?.value)
        && (
          <datalist id={autoSuggestProps?.id}>
            {autoSuggestProps?.list?.map((option) => (
              option.startsWith(inputProps?.value) && (
              <option key={option} value={option}>
                {option}
              </option>
              )
            ))}
          </datalist>
        )
      }

      { isTypeSelect && (
        <TableWrap inTableView={inTableView} className={`${APIValue && 'pb-4'}`}>
          <div className={`${APIValue ? 'w-full' : 'tableInputSelect'}`}>
            <Select
              sizeMedium
              WrapClassName=""
              placeholder="Select string"
              {...typeProps}
              onChange={(val) => {
                typeProps.onChange(val);
                if (val) valueRef?.current?.focus();
              }}
              options={typeProps.options ? TYPE_OPTIONS(typeProps.options) : []}
            />
          </div>
        </TableWrap>

      )}

      { isValue && (
        <TableWrap inTableView={inTableView} className={`${APIValue && 'pb-4'}`}>
          <div className={`${APIValue ? 'w-full' : 'tableInputSelect'}`}>
            <ValueComponent
              {...valueProps}
              type={typeProps.value}
              customOptions={typeProps.options}
              ref={valueRef}
            />
          </div>
        </TableWrap>
      )}

      { isOpenDelete
        ? (
          <ConfirmationAlert
            isOpen={isDelete}
            // eslint-disable-next-line no-nested-ternary
            description={envVariable && applicationCode === APPLICATION_CODE.nodeExpress ? 'Environment variable will be deleted permanently and cannot be restored in the future.Are you sure do you want to delete this environment variable?' : 'Constant attribute will be deleted permanently and cannot be restored in the future.Are you sure do you want to delete this constant attribute?'}
            handleSubmit={() => {
              // isLoading(true);
              deleteProps?.onDelete();
              hideDelete();
            }}
            handleClose={hideDelete}
          />
        )
        : null}
    </>
  );
};
