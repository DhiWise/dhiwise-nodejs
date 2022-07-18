/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useTable } from 'react-table';
import { cloneDeep, isEmpty, last } from 'lodash';
import { Icons } from '@dhiwise/icons';
import { shallowEqual, useSelector } from 'react-redux';
import '../../../../assets/css/Table.css';
import {
  ConfirmationAlert,
  DeleteIcon, IconBox,
} from '../../../../components';
import { SubRow } from './SubRow';
import EditableCell from './EditableCell';
import { CONSTANT_GENERATE_TYPE, NODE_DATA_TYPE } from '../../../../constant/applicationConstant';
import { useBoolean, useToastNotifications } from '../../../hooks';

const subEmptyRow = { attribute: '', value: '', type: 'string' };
const mainEmptyRow = {
  attribute: '',
  value: '',
  type: 'json',
  isExpanded: true,
};

const defaultColumn = {
  Cell: EditableCell,
};
export const RowDeleteMessage = 'The constant attribute has been deleted successfully.';

const checkType = (data) => {
  if ([NODE_DATA_TYPE.STRING, NODE_DATA_TYPE.NUMBER].includes(typeof data)) {
    return typeof data;
  }
  if (data === null) {
    return NODE_DATA_TYPE.NUMBER;
  }
  if (!Array.isArray(data) && typeof data === 'object') {
    return NODE_DATA_TYPE.JSON;
  }
  if (Array.isArray(data)) {
    return NODE_DATA_TYPE.ARRAY;
  }
  return null;
};

const jsonToTableParser = (jsonData) => Object.keys(jsonData).map((key) => ({
  isInitial: true,
  attribute: key,
  type: checkType(jsonData[key]),
  value: jsonData[key] === null ? null : !Array.isArray(jsonData[key]) && typeof jsonData[key] === 'object' ? '-' : jsonData[key],
  ...(!Array.isArray(jsonData[key]) && typeof jsonData[key] === 'object' && { subRows: isEmpty(jsonData[key]) ? [{ ...subEmptyRow }] : jsonToTableParser(jsonData[key]) }),

}));

const Row = ({
  row,
  onExpand, onAddSubRow, totalRowCount, onSubRowInputChange, isDisable, onDeleteRow, onSubRowDelete,
}) => (
  <>
    <tr
      {...row.getRowProps()}
      className="align-middle"
    >
      <td style={{ minWidth: '80px', maxHeight: '80px', width: '80px' }}>
        <div className="flex justify-start items-center h-full">
          {!isDisable && (
            <>
              <DeleteIcon
                size="small"
                onClick={() => onDeleteRow(row.id)}
                icon={<Icons.Close />}
                tooltip="Delete"
                className="mx-1"
              />
            </>
          )}
          {row.original.type === NODE_DATA_TYPE.JSON && (
            <span onClick={() => onExpand(row)}>
              <IconBox size="small" icon={row.original.isExpanded ? <Icons.DownArrow /> : <Icons.RightArrow />} variant="ghost" />
            </span>
          )}
        </div>
      </td>
      {row.cells.map((cell, index) => <td key={index} style={['attribute', 'type'].includes(cell.column.id) ? { minWidth: '208px', maxWidth: '208px', width: '208px' } : {}} className="sm:text-left" {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
    </tr>
    {
    row.original.isExpanded
    && (
    <tr>
      <SubRow
        subRows={[...row.original.subRows]}
        isDisable={isDisable}
        mainRowIndex={row.id}
        totalRowCount={totalRowCount}
        onAddSubRow={() => onAddSubRow(row.id)}
        onSubRowDelete={onSubRowDelete}
        onSubRowInputChange={onSubRowInputChange}
      />
    </tr>
    )
}
  </>
);
function Table({
  columns, data, onInputChange, onAddRow, onExpand, onAddSubRow,
  onSubRowInputChange, onDeleteRow, onSubRowDelete, totalRowCount,
}) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
    defaultColumn,
    onInputChange,
    onAddRow,
    totalRowCount,
  });
  const isDisable = useSelector(({ constants }) => constants.constantList.find((d) => d._id === constants.currentId)?.type === CONSTANT_GENERATE_TYPE.AUTO);
  // Render the UI for your table
  return (

    <table {...getTableProps()} className="w-full">
      <thead>
        {headerGroups.map((headerGroup, index) => (
          <tr key={index} {...headerGroup.getHeaderGroupProps()}>
            <th key="col-icon" style={{ minWidth: '80px', maxHeight: '80px', width: '80px' }}>
              {!isDisable && (
                <IconBox
                  size="small"
                  className=""
                  icon={<Icons.Plus color="#ffffff" />}
                  onClick={onAddRow}
                  tooltip="Add Constant"
                />
              )}
            </th>
            {headerGroup.headers.map((column) => (
              <th key={column.id} {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, index) => (
          prepareRow(row)
          || (
            row.depth === 0
          && (
          <Row
            key={`row${index}`}
            index={index}
            totalRowCount={totalRowCount}
            row={row}
            isDisable={isDisable}
            tableJson={data}
            onAddSubRow={onAddSubRow}
            onSubRowInputChange={onSubRowInputChange}
            onDeleteRow={onDeleteRow}
            onSubRowDelete={onSubRowDelete}
            onExpand={onExpand}
            {...row.getRowProps()}
          />
          )
          )
        ))}
      </tbody>
    </table>
  // </DndProvider>

  );
}

// eslint-disable-next-line no-unused-vars
export const TableView = ({
  setTableJsonRef,
  defaultTableJson = [],
  handleUpdate,
  onSaveRef,
}) => {
  const [tableJson, setTableJson] = React.useState(defaultTableJson);
  const [totalRowCount, setTotalRowCount] = React.useState(0);
  const { currentConstant, constantList, isAutoGenerated } = useSelector(({ constants }) => ({
    currentConstant: constants.currentId,
    constantList: constants.constantList,
    isAutoGenerated: constants.constantList.find((d) => d._id === constants.currentId)?.type === CONSTANT_GENERATE_TYPE.AUTO,
  }), shallowEqual);
  const [isDelete, setDelete, hideDelete] = useBoolean(false);
  const deleteRowIndex = React.useRef({ mainRow: '', subRow: '' });
  const jsonData = constantList.find((constant) => constant._id === currentConstant)?.customJson ?? {};

  const { addSuccessToast } = useToastNotifications();
  const keyBoardIndexSet = (paramTableJson) => {
    let focusIndex = 0;
    const temp = paramTableJson || tableJson;
    temp.forEach((json, index) => {
      temp[index].focusIndex = focusIndex * 3;
      focusIndex += 1;
      if (json.subRows) {
        json.subRows.forEach((sub, jsonIndex) => {
          temp[index].subRows[jsonIndex] = { ...temp[index].subRows[jsonIndex], focusIndex: focusIndex * 3 };
          focusIndex += 1;
        });
      }
    });
    setTotalRowCount(focusIndex);
  };
  const handleCurEleFocus = (key) => {
    // handle new row focus
    requestAnimationFrame(() => {
      const nextFiled = document.querySelector(`#r${(key) + 1}`);
      nextFiled?.focus();
    });
  };
  React.useEffect(() => {
    if (!isEmpty(defaultTableJson.filter((dt) => (dt.attribute && dt.type) || dt.value))) {
      keyBoardIndexSet(defaultTableJson);
      handleCurEleFocus(last(defaultTableJson)?.focusIndex);

      setTableJson([...defaultTableJson]);
      return;
    }
    const tableData = !isEmpty(Object.keys(jsonData)) ? [...jsonToTableParser(jsonData)] : [];
    if (!isAutoGenerated)tableData.push({ ...mainEmptyRow, subRows: [{ ...subEmptyRow }] });
    keyBoardIndexSet(tableData);
    handleCurEleFocus(last(tableData)?.focusIndex);

    setTableJson(tableData);
  }, [currentConstant]);
  const columns = React.useMemo(() => [
    {
      key: 'Attribute/Key',
      Header: 'Key',
      accessor: 'attribute',
      minWidth: 250,
      width: 250,
      maxWidth: 250,
    },
    {
      Header: 'Data type',
      accessor: 'type',
      minWidth: 250,
      width: 250,
      maxWidth: 250,
    },
    {
      Header: 'Value',
      accessor: 'value',
      minWidth: 150,
      // width: 500,
      // width: 'auto',
      maxWidth: 300,
    },
  ], []);

  React.useEffect(() => {
    setTableJsonRef(tableJson);
  }, [tableJson]);
  const onAddRow = () => {
    tableJson.push({ ...mainEmptyRow, subRows: [{ ...subEmptyRow }] });
    keyBoardIndexSet(tableJson);

    setTableJsonRef(tableJson);
    handleCurEleFocus(last(tableJson)?.focusIndex);
    setTableJson([...tableJson]);
  };
  React.useImperativeHandle(onSaveRef, () => ({
    updateTableJson: () => {
      const newTable = jsonToTableParser(jsonData);
      newTable.push({ ...mainEmptyRow, subRows: [{ ...subEmptyRow }] });
      setTableJson(newTable);
    },
  }));
  const onInputChange = (index, columnName, value) => {
    tableJson[index][columnName] = value;
    if (columnName === 'type') {
      tableJson[index].value = value === NODE_DATA_TYPE.ARRAY ? [] : value === NODE_DATA_TYPE.NUMBER ? null : '';// default value type wise store
      tableJson[index].isExpanded = value === NODE_DATA_TYPE.JSON;
      tableJson[index].subRows = null;
      if (value === NODE_DATA_TYPE.JSON && !tableJson[index].subRows) {
        tableJson[index].subRows = [{ ...subEmptyRow }];
        keyBoardIndexSet(tableJson);
        handleCurEleFocus(last(tableJson[index].subRows)?.focusIndex);
      }

      setTableJson([...tableJson]);
      return;
    }
    if (columnName === 'attribute') {
      if (last(tableJson)?.[columnName]?.length > 0) { onAddRow(); return; }
    }
    setTableJsonRef(tableJson);
    setTableJson(tableJson);
  };
  const onExpand = (row) => {
    tableJson[row.index].isExpanded = !row.original.isExpanded;
    handleCurEleFocus(last(tableJson[row.index]?.subRows)?.focusIndex);

    setTableJson([...tableJson]);
  };

  const onAddSubRow = (index) => {
    tableJson[index].subRows?.push({ ...subEmptyRow });
    keyBoardIndexSet(tableJson);
    handleCurEleFocus(last(tableJson[index].subRows)?.focusIndex);
    setTableJsonRef(tableJson);
    setTableJson([...tableJson]);
  };
  const onSubRowInputChange = (index, columnName, value, mainRowIndex) => {
    tableJson[mainRowIndex].subRows[index][columnName] = value;
    if (columnName === 'type') {
      tableJson[mainRowIndex].subRows[index].value = value === NODE_DATA_TYPE.ARRAY ? [] : value === NODE_DATA_TYPE.NUMBER ? null : '';
      setTableJson([...tableJson]);
      return;
    }
    if (columnName === 'attribute') {
      if (last(tableJson[mainRowIndex].subRows)?.[columnName]?.length > 0) { onAddSubRow(mainRowIndex); return; }
    }
    setTableJsonRef(tableJson);
    setTableJson(tableJson);
  };

  const onRowDelete = async () => {
    const newTable = [...tableJson];
    newTable.splice(deleteRowIndex.current.mainRow, 1);
    if (tableJson[deleteRowIndex.current.mainRow]?.isInitial) {
      handleUpdate(newTable);
      deleteRowIndex.current = {};
      hideDelete();
      return;
    }
    setTableJson(isEmpty(newTable) ? [{ ...mainEmptyRow, subRows: [{ ...subEmptyRow }] }] : newTable);
    deleteRowIndex.current = {};
    hideDelete();
    addSuccessToast(RowDeleteMessage);
  };

  const onSubRowDelete = () => {
    // cloneDeep to clone subRow also
    const newTable = cloneDeep(tableJson);

    newTable[deleteRowIndex.current.mainRow].subRows.splice(deleteRowIndex.current.subRow, 1);
    if (tableJson[deleteRowIndex.current.mainRow].subRows[deleteRowIndex.current.subRow]?.isInitial) {
      handleUpdate(newTable);
      deleteRowIndex.current = {};
      hideDelete();
      return;
    }
    if (isEmpty(newTable[deleteRowIndex.current.mainRow].subRows))newTable[deleteRowIndex.current.mainRow].subRows = [{ ...subEmptyRow }];
    setTableJson(newTable);
    deleteRowIndex.current = {};
    hideDelete();
    addSuccessToast(RowDeleteMessage);
  };

  React.useEffect(() => {
    keyBoardIndexSet();
  }, [tableJson]);
  return (

    <div className="dhiTable reactTable relative text-left flex-grow h-full w-7/12">
      <Table
        columns={columns}
        data={tableJson || []}
        totalRowCount={totalRowCount}
        onExpand={onExpand}
        onAddRow={onAddRow}
        onInputChange={onInputChange}
        onAddSubRow={onAddSubRow}
        onDeleteRow={(rowIndex) => {
          deleteRowIndex.current = { mainRow: rowIndex };
          setDelete();
        }}
        onSubRowDelete={(mainRow, subRow) => {
          deleteRowIndex.current = { mainRow, subRow };
          setDelete();
        }}
        onSubRowInputChange={onSubRowInputChange}
      />
      {isDelete && (
      <ConfirmationAlert
        description="Constant attribute will be deleted permanently and cannot be restored in the future.Are you sure do you want to delete this constant attribute?"
        handleSubmit={deleteRowIndex.current.subRow ? onSubRowDelete : onRowDelete}
        isOpen={isDelete}
        handleClose={hideDelete}
      />
      )}
    </div>
  );
};
