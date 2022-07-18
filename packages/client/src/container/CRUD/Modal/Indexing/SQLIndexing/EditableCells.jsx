/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useSelector } from 'react-redux';
import { DB_CONST, DB_TYPE } from '../../../../../constant/model';
import { SQL_INDEX, getFieldPosition } from '../../../../../constant/modelIndexing';
import { useIndex } from './IndexProvider';
import {
  MultiAttrCell, TypeCell, NameCell, SingleAttrCell, OrderTypeCell, LengthCell, CollateCell, AssignmentOperatorCell, OperatorCell, ValueCell, TTLCell, InputTTLCell, UniqueCell, MongoIndexTypeCell,
} from './TableCells';
import { useEditor } from '../../Editor/EditorProvider';

export const EditableCell = React.memo(({
  mainRow,
  value: initialValue,
  row: { index, original },
  column: { id },
  onInputChange, // This is a custom function that we supplied to our table instance
}) => {
  const { currentModel, currentApplicationCode } = useEditor();
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);
  const { onKeyDownHandle } = useIndex();
  const dbType = useSelector(((state) => DB_CONST[state.projects.applicationDatabase.databaseType]));

  const onChange = (val, colName) => {
    if (value === val) return;
    setValue(val);
    onInputChange(index, colName || id, val);
  };

  const handleNameChange = (val) => {
    // name change
    if (value === val) return;
    setValue(val);
  };

  const onBlur = () => {
    onInputChange(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const fieldProps = {
    value,
    onChange,
    disabled: dbType !== DB_TYPE.MONGODB && (mainRow ? mainRow.original?.name === 'PRIMARY' && mainRow.original?.isDefault
      : original?.name === 'PRIMARY' && original?.isDefault),
    isDisabled: dbType !== DB_TYPE.MONGODB && (mainRow ? mainRow.original?.name === 'PRIMARY' && mainRow.original?.isDefault
      : original?.name === 'PRIMARY' && original?.isDefault),
    onKeyDown: (e, fieldName) => onKeyDownHandle(e, fieldName, {
      index,
      idPrefix: mainRow ? `srcell${mainRow.index}` : 'rcell',
      mainRow,
    }),
  };

  const { FiledPosition } = React.useMemo(() => getFieldPosition(index, !!mainRow, dbType), [mainRow, index, dbType]);

  switch (id) {
    case 'name': return (
      <NameCell
        id={`rcell${FiledPosition.name}`}
        disabled={fieldProps?.disabled}
        value={value}
        isMongoDb={dbType === DB_TYPE.MONGODB}
        onChange={handleNameChange}
        onBlur={onBlur}
        onKeyDown={(e, fieldName) => onKeyDownHandle(e, fieldName, { index, idPrefix: 'rcell' })}
      />
    );
    case 'indexType': return (
      <TypeCell id={`rcell${FiledPosition.indexType}`} currentApplicationCode={currentApplicationCode} {...fieldProps} />
    );
    case 'fields': return (
      <div className="min-w-40 w-full text-left">
        {[SQL_INDEX.TYPE.UNIQUE, SQL_INDEX.TYPE.PARTIAL, SQL_INDEX.TYPE.GIN].includes(original?.indexType)
          ? <MultiAttrCell id={`rcell${FiledPosition.fields}`} {...fieldProps} />
          : '-'}
      </div>
    );
    case 'attribute': return (
      <SingleAttrCell id={`srcell${mainRow.index}${FiledPosition.attribute}`} {...fieldProps} />
    );
    case 'order': return (
      <OrderTypeCell id={`srcell${mainRow.index}${FiledPosition.order}`} {...fieldProps} />
    );
    case 'collate': return (
      <CollateCell id={`srcell${mainRow.index}${FiledPosition.collate}`} {...fieldProps} />
    );
    case 'length': {
      const attributeType = currentModel?.schemaJson?.[mainRow?.original?.indexFields?.[index]?.attribute]?.type;
      return (
        <LengthCell
          id={`srcell${mainRow.index}${FiledPosition.length}`}
          {...fieldProps}
          disabled={(!attributeType || (attributeType !== 'STRING'))}
        />
      ); }
    case 'value': {
      return (
        <ValueCell id={`srcell${mainRow.index}${FiledPosition.value}`} {...fieldProps} />
      ); }
    case 'operator': return (
      mainRow?.original?.indexType === SQL_INDEX.TYPE.GIN ? <OperatorCell id={`srcell${mainRow.index}${FiledPosition.operator}`} {...fieldProps} />
        : <AssignmentOperatorCell id={`srcell${mainRow.index}${FiledPosition.operator}`} {...fieldProps} />
    );
    case 'ttlInput': return (
      <div className="w-full min-w-40  pr-6 flex items-center">
        <TTLCell
          id={`rcell${FiledPosition.ttl}`}
          {...fieldProps}
          value={!!original?.ttl}
        />
        <InputTTLCell
          id={`rcell${FiledPosition.expireAfterSeconds}`}
          {...fieldProps}
          value={original?.expireAfterSeconds}
          disabled={!original?.ttl}
        />
      </div>
    );
    case 'unique': return (
      <UniqueCell id={`rcell${FiledPosition.unique}`} {...fieldProps} />
    );
    case 'type': return (
      <MongoIndexTypeCell id={`srcell${mainRow.index}${FiledPosition.type}`} {...fieldProps} />
    );
    default: return null;
  }
});
EditableCell.displayName = 'EditableCell';
