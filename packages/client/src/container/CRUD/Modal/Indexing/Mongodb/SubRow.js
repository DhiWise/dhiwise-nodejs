/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { useTable } from 'react-table';
import '../../../../../assets/css/Table.css';
import { cloneDeep, last } from 'lodash';
import { Icons } from '@dhiwise/icons';
import ReactTooltip from 'react-tooltip';
import { DragHandle } from '../../Editor/TableView/TableData/Sortable';
import { EditableCell } from '../SQLIndexing/EditableCells';
import { DeleteIndex } from '../SQLIndexing/DeleteIndex';
import { useDraggable } from '../Draggable/useDraggable';
import { useDroppable } from '../Draggable/useDroppable';
import { MODEL_INDEX_ACTION_TYPES, useIndex } from '../SQLIndexing/IndexProvider';
import { MONGO_INDEX } from '../../../../../constant/modelIndexing';

const Row = React.memo(({
  row, index, moveRow, mainRow,
}) => {
  const dragRef = React.useRef(null);

  const { drag, isDragging, preview } = useDraggable({ index, type: 'sub-row' });
  const { drop, dropRef } = useDroppable({ index, moveRow, type: 'sub-row' });

  const opacity = isDragging ? 0.5 : 1;

  preview(drop(dropRef));
  drag(dragRef);

  return (
    <>
      <tr {...row.getRowProps()} className="relative" ref={dropRef} style={{ opacity }}>
        <td>
          <div className="flex justify-start" ref={dragRef}>
            <DragHandle style={{
              left: '0', position: 'relative', margin: '0', top: '0',
            }}
            />
            <DeleteIndex deleteObj={row} mainRow={mainRow} />
          </div>
        </td>
        {row.cells.map((cell) => <td key={cell.row.key} {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
      </tr>
    </>
  );
});
Row.displayName = 'Row';
const Table = React.memo(({
  columns, data, onInputChange, moveRow, onAddRow, mainRow, maxAllowedSubRows,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    visibleColumns,
    prepareRow,
  } = useTable({
    columns,
    data,
    defaultColumn: {
      Cell: EditableCell,
    },
    onInputChange,
    moveRow,
    onAddRow,
    mainRow,
  });
  // Render the UI for your table
  return (
    <DndProvider backend={HTML5Backend}>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="relative" key={`sub-header${i}`}>
              <th> </th>
              {headerGroup.headers.map((column, ci) => (
                <th {...column.getHeaderProps()} key={`sub-col${i}${ci}`}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => prepareRow(row) || (
            <Row
              key={`sub-row${index}`}
              index={index}
              row={row}
              moveRow={moveRow}
              visibleColumns={visibleColumns}
              mainRow={mainRow}
              rowProps={() => row.getRowProps()}
              {...row.getRowProps()}
            />
          ))}
        </tbody>
        <td colSpan="5">
          <div
            data-tip
            data-for="info"
          >
            <div
              className={`ml-20 pb-2 text-sm text-gray-white flex underline items-center cursor-pointer labelGroup focus:outline-none focus:text-primary-dark ${(rows?.length >= maxAllowedSubRows) && 'cursor-not-allowed opacity-50'}`}
            >
              <div
                className="w-4 h-4 mr-2"
                onClick={() => {
                  rows?.length >= maxAllowedSubRows ? undefined : onAddRow();
                }}
              >
                <Icons.Add />
              </div>
              <span onClick={() => {
                rows?.length >= maxAllowedSubRows ? undefined : onAddRow();
              }}
              >
                Add row
              </span>
            </div>
            {(rows?.length >= maxAllowedSubRows)
            && <ReactTooltip place="bottom" id="info" type="dark">{`There can be no more than ${maxAllowedSubRows} fields in a compound index.`}</ReactTooltip>}
          </div>
        </td>
      </table>
    </DndProvider>
  );
});
Table.displayName = 'Table';
export function SubRows({
  //   row,data
  row, rowProps,
}) {
  const {
    modelIndexList, dispatch, handleAddRow, handleAutoFocus,
  } = useIndex();

  const columns = React.useMemo(() => ([
    { key: 'attribute', Header: 'Attribute', accessor: 'attribute' },
    { key: 'type', Header: 'Index type', accessor: 'type' },
  ]), []);

  const handleAddSubRow = () => {
    dispatch({
      type: MODEL_INDEX_ACTION_TYPES.ADD_SUB_ROW,
      payload: { indexFields: row?.original?.indexFields, mainRow: row },
    });
    requestAnimationFrame(() => {
    // auto focus on add new sub-row
      handleAutoFocus({ mainRow: row, idPrefix: `srcell${row.index}`, focusField: 'attribute' });
    });
  };
  const moveRow = (dragIndex, hoverIndex) => dispatch({
    type: MODEL_INDEX_ACTION_TYPES.MOVE_SUB_ROW,
    payload: { dragIndex, hoverIndex, mainRow: row },
  });

  const onInputChange = (rowIndex, columnId, value) => {
    let newData = cloneDeep(modelIndexList);
    let tempFields = [...newData[row.index]?.indexFields];
    tempFields = tempFields.map((srow, index) => {
      if (index === rowIndex) {
        return {
          ...tempFields[rowIndex],
          [columnId]: value,
        };
      }
      return srow;
    });
    newData[row.index].indexFields = tempFields;
    if (columnId === 'attribute') {
      if (last(newData[row.index].indexFields)?.[columnId] && !(newData[row?.index]?.indexFields?.length >= MONGO_INDEX.MAX_SUB_ROWS_ALLOWED)) {
        newData = handleAddRow({ mainRow: row, indexList: newData });
      }
    }
    dispatch({ type: MODEL_INDEX_ACTION_TYPES.SET_LIST, payload: newData });
  };
  const subRows = row?.original?.indexFields || handleAddSubRow;

  return (
    <>
      <tr {...rowProps}>
        <td colSpan="4" className="subRow text-left">
          <Table
            columns={columns}
            data={subRows}
            onInputChange={onInputChange}
            moveRow={moveRow}
            onAddRow={handleAddSubRow}
            mainRow={row}
            maxAllowedSubRows={MONGO_INDEX.MAX_SUB_ROWS_ALLOWED}
          />
        </td>
      </tr>
    </>
  );
}
