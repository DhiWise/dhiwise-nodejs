/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useTable, useExpanded } from 'react-table';
// import { TableViewCss } from '@assets/css/tableViewCss';
// import '@assets/css/Table.css';
import '../../../../assets/css/Table.css';
// import HTML5Backend from 'react-dnd-html5-backend';
// import { DndProvider } from 'react-dnd';
import { useSelector } from 'react-redux';
import { Icons } from '@dhiwise/icons';
import { last } from 'lodash';
import {
  DeleteIcon,
} from '../../../../components';
import EditableCell from './EditableCell';
import { CONSTANT_GENERATE_TYPE } from '../../../../constant/applicationConstant';

const defaultColumn = {
  Cell: EditableCell,
};

function Table({
  // eslint-disable-next-line no-unused-vars
  columns, data, onInputChange, onAddSubRow, mainRowIndex, onSubRowDelete, totalRowCount,
}) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    // headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
    defaultColumn,
    onInputChange,
    mainRowIndex,
    isSubRow: true,
    totalRowCount,
  },
  useExpanded);
  // Render the UI for your table
  const isDisable = useSelector(({ constants }) => constants.constantList.find((d) => d._id === constants.currentId)?.type === CONSTANT_GENERATE_TYPE.AUTO);

  return (
  // <DndProvider backend={HTML5Backend}>
    <table {...getTableProps()} className="w-full">
      {/* <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} className="relative">
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead> */}
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <>
              <tr {...row.getRowProps()} className="relative align-middle">

                <td style={{ minWidth: '60px', maxHeight: '60px', width: '60px' }}>
                  {!isDisable && (
                  <div className="flex justify-start items-center h-full">
                    {/* <DragHandle style={{
                        position: 'relative', top: 'auto', left: 'auto', right: '0', margin: '0',
                      }}
                      /> */}
                    <DeleteIcon
                      onClick={() => onSubRowDelete(mainRowIndex, row.id)}
                      size="small"
                      icon={<Icons.Close />}
                      tooltip="Delete"
                      className="mx-2"
                    />
                  </div>
                  )}
                </td>
                {row.cells.map((cell, index) => <td key={index} className="text-left" {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
              </tr>

            </>
          );
        })}
      </tbody>
      {!isDisable && (
        <td colSpan="5">
          <div
            className="ml-16 pb-2 text-sm text-gray-white flex underline items-center cursor-pointer labelGroup focus:outline-none focus:text-primary-dark"
          >
            <div
              className="w-4 h-4 mr-2"
              onClick={onAddSubRow}
            >
              <Icons.Add />
            </div>
            <span onClick={onAddSubRow}>Add row</span>
          </div>
        </td>
      )}
    </table>
  // </DndProvider>
  );
}

export const SubRow = ({
  subRows, onAddSubRow, onSubRowInputChange, mainRowIndex, onSubRowDelete, totalRowCount,
}) => {
  const isAutoGenerated = useSelector(({ constants }) => constants.constantList.find((d) => d._id === constants.currentId)?.type === CONSTANT_GENERATE_TYPE.AUTO);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Attribute/Key',
        accessor: 'attribute',
        minWidth: 230,
        width: 230,
        maxWidth: 230,
      },
      {
        Header: 'Type',
        accessor: 'type',
        minWidth: 240,
        width: 240,
        maxWidth: 240,
      },
      {
        Header: 'Value',
        accessor: 'value',
        minWidth: 250,
        width: 250,
        maxWidth: 250,
      },
    ],
    [],
  );
  React.useEffect(() => {
    if (last(subRows)?.attribute?.length > 0 && !isAutoGenerated) onAddSubRow();
  }, []);
  return (
    <>
      <td colSpan="4" className="subRow">
        <Table
          columns={columns}
          data={subRows}
          totalRowCount={totalRowCount}
          mainRowIndex={mainRowIndex}
          onInputChange={onSubRowInputChange}
          onAddSubRow={onAddSubRow}
          onSubRowDelete={onSubRowDelete}
        />
      </td>
    </>
  );
};