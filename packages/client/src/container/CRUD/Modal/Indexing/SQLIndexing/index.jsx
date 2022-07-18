/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { useTable } from 'react-table';
import '../../../../../assets/css/Table.css';
import { cloneDeep, isEmpty, last } from 'lodash';
import { Icons } from '@dhiwise/icons';
import { IconBox } from '../../../../../components';
import { DragHandle } from '../../Editor/TableView/TableData/Sortable';
import { EditableCell } from './EditableCells';
import { useIndex, MODEL_INDEX_ACTION_TYPES } from './IndexProvider';
import { SubRows } from './Subrow';
import { DeleteIndex } from './DeleteIndex';
import { useDraggable } from '../Draggable/useDraggable';
import { useDroppable } from '../Draggable/useDroppable';
import { SQL_INDEX } from '../../../../../constant/modelIndexing';

const defaultColumn = {
  Cell: EditableCell,
};

const Row = React.memo(({
  row, index, moveRow, rowProps, visibleColumns, renderRowSubComponent, onExpand,
}) => {
  const dragRef = React.useRef(null);

  const { drag, isDragging, preview } = useDraggable({ index });
  const { drop, dropRef } = useDroppable({ index, moveRow });

  const opacity = isDragging ? 0.5 : 1;

  preview(drop(dropRef));
  drag(dragRef);

  return (
    <>
      <tr {...row.getRowProps()} className="relative" ref={dropRef} style={{ opacity }}>
        <td>
          <div className="flex justify-start" ref={dragRef}>
            <DragHandle style={{
              left: '0', position: 'relative', margin: '0', top: 'auto',
            }}
            />
            {row?.original?.name !== 'PRIMARY' && !row?.original?.isDefault
        && (<DeleteIndex deleteObj={row} />)}
            {row?.original?.indexType && row?.original?.indexType !== SQL_INDEX.TYPE.UNIQUE && (
            <span {...row.getToggleRowExpandedProps?.()}>
              <div className="w-3 h-3 ml-3 cursor-pointer" onClick={() => onExpand(row)}>
                {row?.original?.isExpanded ? <Icons.DownArrow /> : <Icons.RightArrow />}
              </div>
            </span>
            )}
          </div>
        </td>
        {row.cells.map((cell) => <td key={cell.row.key} {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
      </tr>
      {row?.original?.indexType && row?.original?.indexType !== SQL_INDEX.TYPE.UNIQUE
      && row?.original?.isExpanded && renderRowSubComponent({ row, rowProps, visibleColumns })}
    </>
  );
});
Row.displayName = 'Row';
const Table = React.memo(({
  // eslint-disable-next-line no-unused-vars
  columns, data, renderRowSubComponent, onInputChange, moveRow, onAddRow, onExpand,
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
    defaultColumn,
    onInputChange,
    moveRow,
    onAddRow,
    onExpand,
  });
  // Render the UI for your table
  return (
    <DndProvider backend={HTML5Backend}>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="relative" key={`header${i}`}>
              <th key="col-icon" className="z-100">
                <IconBox
                  size="small"
                  tooltipPlace="right"
                  className=""
                  icon={<Icons.Plus color="#fff" />}
                  tooltip="Add indexing"
                  onClick={onAddRow}
                />
              </th>
              {headerGroup.headers.map((column, ci) => (
                <th {...column.getHeaderProps()} key={`col${i}${ci}`}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => prepareRow(row) || (
            <Row
              key={`row${index}`}
              index={index}
              row={row}
              moveRow={moveRow}
              onExpand={onExpand}
              renderRowSubComponent={renderRowSubComponent}
              visibleColumns={visibleColumns}
              rowProps={() => row.getRowProps()}
              {...row.getRowProps()}
            />
          ))}
        </tbody>
      </table>
    </DndProvider>
  );
});
Table.displayName = 'Table';
export const SQLIndexing = React.memo(() => {
  const {
    modelIndexList, dispatch, handleAddRow, handleAutoFocus,
  } = useIndex();

  const columns = React.useMemo(() => [
    {
      key: 'name',
      Header: 'Index name',
      accessor: 'name',
    },
    {
      key: 'indexType',
      Header: 'Data type',
      accessor: 'indexType',
    },
    {
      key: 'fields', // for table key
      Header: 'Attribute',
      accessor: 'fields', // to access value
    },
  ], []);

  // Create a function that will render our row sub components
  const renderRowSubComponent = React.useCallback(
    ({ row, rowProps, visibleColumns }) => (
      <SubRows
        row={row}
        rowProps={rowProps}
        visibleColumns={visibleColumns}
      />
    ),
    [],
  );
  const onInputChange = (rowIndex, columnId, value) => {
    // const newData = [...modelIndexList];
    let newData = cloneDeep(modelIndexList).map((row, index) => {
      if (index === rowIndex) {
        return {
          ...modelIndexList[rowIndex],
          [columnId]: value,
          indexFields: columnId === 'indexType' ? [] : row.indexFields, // clear sub-row on change type
        };
      }
      return row;
    });
    // newData[rowIndex] = {
    //   ...newData[rowIndex],
    //   [columnId]: value,
    // };
    if (columnId === 'indexType' && (value === SQL_INDEX.TYPE.GIN)) {
      // GIN type
      // on type change expand sub-row
      newData[rowIndex].isExpanded = true;
      newData[rowIndex].indexFields = [{ operator: '' }];
    }
    if (columnId === 'indexType' && (value === SQL_INDEX.TYPE.PARTIAL || value === SQL_INDEX.TYPE.BTREE)) {
    // on type change expand sub-row
      newData[rowIndex].isExpanded = true;
      // add new sub-row on type change
      if (!newData[rowIndex]?.indexFields?.length > 0) newData = handleAddRow({ indexList: newData, mainRow: { ...newData[rowIndex], index: rowIndex } });
    }
    if (columnId === 'name') {
      if (last(newData)?.[columnId]?.length > 0) { newData = handleAddRow({ indexList: newData }); }
    }
    dispatch({ type: MODEL_INDEX_ACTION_TYPES.SET_LIST, payload: newData });
  };

  const moveRow = (dragIndex, hoverIndex) => dispatch({ type: MODEL_INDEX_ACTION_TYPES.MOVE_ROW, payload: { dragIndex, hoverIndex } });
  const onAddRow = () => {
    dispatch({ type: MODEL_INDEX_ACTION_TYPES.ADD_ROW });
    requestAnimationFrame(() => {
    // auto focus on add new row
      handleAutoFocus({ idPrefix: 'rcell', focusField: 'name' });
    });
  };
  const onExpand = (row) => dispatch({ type: MODEL_INDEX_ACTION_TYPES.EXPAND, payload: { row } });

  return (
    <>
      <div className="dhiTable firstColTable text-left flex-grow h-full">
        {
          !isEmpty(modelIndexList)
            ? (
              <Table
                columns={columns}
                data={modelIndexList}
                renderRowSubComponent={renderRowSubComponent}
                onInputChange={onInputChange}
                moveRow={moveRow}
                onAddRow={onAddRow}
                onExpand={onExpand}
              />
            ) : null
        }
      </div>
    </>
  );
});
SQLIndexing.displayName = 'SQLIndexing';
