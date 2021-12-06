/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { useTable } from 'react-table';
import '../../../../../../assets/css/Table.css';
import { cloneDeep, last } from 'lodash';
import { Icons } from '@dhiwise/icons';
import { DragHandle } from '../../../Editor/TableView/TableData/Sortable';
import { EditableCell } from '../EditableCells';
import { SQL_INDEX } from '../../../../../../constant/modelIndexing';
import { DeleteIndex } from '../DeleteIndex';
import { useDraggable } from '../../Draggable/useDraggable';
import { useDroppable } from '../../Draggable/useDroppable';
import { MODEL_INDEX_ACTION_TYPES, useIndex } from '../IndexProvider';

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
          <div className="flex items-center" ref={dragRef}>
            <DragHandle style={{
              left: '0', position: 'relative', margin: '0', top: '0',
            }}
            />
            {mainRow?.original?.name !== 'PRIMARY' && !mainRow?.original?.isDefault && (
            <DeleteIndex deleteObj={row} mainRow={mainRow} />)}
          </div>
        </td>
        {row.cells.map((cell) => <td key={cell.row.key} {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
      </tr>
    </>
  );
});
Row.displayName = 'Row';
const Table = React.memo(({
  columns, data, onInputChange, moveRow, onAddRow, mainRow,
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
        {mainRow?.original?.name !== 'PRIMARY' && !mainRow?.original?.isDefault
        && mainRow?.original?.indexType !== SQL_INDEX.TYPE.GIN
          ? (
            <td colSpan="5">
              <div
                className="ml-20 text-sm text-gray-white flex underline items-center cursor-pointer labelGroup focus:outline-none focus:text-primary-dark"
              >
                <div
                  className="w-4 h-4 mr-2"
                  onClick={onAddRow}
                >
                  <Icons.Add />
                </div>
                <span onClick={onAddRow}>Add row</span>
              </div>
            </td>
          )
          : null}
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
  const rowIndexType = React.useMemo(() => ({
    isBTree: row?.original?.indexType === SQL_INDEX.TYPE.BTREE,
    isGin: row?.original?.indexType === SQL_INDEX.TYPE.GIN,
    isPartial: row?.original?.indexType === SQL_INDEX.TYPE.PARTIAL,
    isUnique: row?.original?.indexType === SQL_INDEX.TYPE.UNIQUE,
  }), [row?.original?.indexType]);

  const columns = React.useMemo(() => (rowIndexType.isBTree ? [
    { key: 'attribute', Header: 'Attribute', accessor: 'attribute' },
    // { key: 'collate', Header: 'Collate', accessor: 'collate' },
    { key: 'order', Header: 'Order', accessor: 'order' },
    { key: 'length', Header: 'Length', accessor: 'length' },
  ] : rowIndexType.isPartial ? [
    { key: 'attribute', Header: 'Attribute', accessor: 'attribute' },
    { key: 'operator', Header: 'Operator', accessor: 'operator' },
    { key: 'value', Header: 'Value', accessor: 'value' },
  ] : rowIndexType.isGin ? [
    { key: 'operator', Header: 'Operator', accessor: 'operator' },
  ] : []), [rowIndexType]);

  // if (loading) { //add this for async
  //   return (
  //     <tr>
  //       <td />
  //       <td colSpan={visibleColumns.length - 1}>
  //         Loading...
  //       </td>
  //     </tr>
  //   );
  // }
  // error handling here :)

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
        if (columnId === 'attribute') { // clear length field value while switching attributes
          return {
            ...tempFields[rowIndex],
            length: '',
            [columnId]: value,
          };
        }
        return {
          ...tempFields[rowIndex],
          [columnId]: value,
        };
      }
      return srow;
    });
    newData[row.index].indexFields = tempFields;
    if (columnId === 'attribute') {
      if (last(newData[row.index].indexFields)?.[columnId]) {
        newData = handleAddRow({ mainRow: row, indexList: newData });
      }
    }
    dispatch({ type: MODEL_INDEX_ACTION_TYPES.SET_LIST, payload: newData });
  };
  const subRows = row?.original?.indexFields || handleAddSubRow;

  return (
    <>
      <tr {...rowProps}>
        <td colSpan="4" className="subRow">
          {
          !rowIndexType?.isUnique
            ? (
              <Table
                columns={columns}
                data={subRows}
                onInputChange={onInputChange}
                moveRow={moveRow}
                onAddRow={handleAddSubRow}
                mainRow={row}
              />
            ) : null
        }
        </td>
      </tr>
    </>
  );
}
