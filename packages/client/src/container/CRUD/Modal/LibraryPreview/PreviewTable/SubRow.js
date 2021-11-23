/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useTable, useExpanded, useFlexLayout } from 'react-table';
import { Checkbox } from '../../../../../components';

function Table({
  // eslint-disable-next-line no-unused-vars
  columns, data, selectedFlatRows,
}) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    rows,
    prepareRow,

  } = useTable({
    columns,
    data,
    initialState: {
      selectedRowIds: selectedFlatRows,
    },
  },
  useExpanded,
  useFlexLayout);
  return (
    <table {...getTableProps()}>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <>
              <tr {...row.getRowProps()} className="relative">
                {row.cells.map((cell) => <td key={cell.row.key} {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
              </tr>
            </>
          );
        })}
      </tbody>
    </table>
  );
}
export const SubRow = ({ subRowData, selectedFlatRows, onChangeCheckBox }) => {
  const columns = [{
    id: 'expander', // It needs an ID
    Cell: ({ row }) => (
      <div className="flex justify-end items-center smallCheckbox">
        <Checkbox
          onChange={(checked) => { onChangeCheckBox(row.original.id, checked); }}
          checked={selectedFlatRows.includes(row.original.id)}
        />
      </div>
    ),

  },
  {
    Header: 'Attribute',
    accessor: 'attr',
    Cell: ({ value }) => (
      <div className="text-left min-w-40">
        {value}
        {/* <Input dark size="small" disabled value={value} /> */}
      </div>
    ),
  }, {
    Header: 'Data type',
    accessor: 'type',
    Cell: ({ value }) => (
      <div className="text-left min-w-40">
        {value}
        {/* <Input dark disabled size="small" value={value} /> */}
      </div>
    ),
  }, {
    Header: 'Description',
    accessor: 'description',
    Cell: ({ value }) => (
      <div className=" text-left">
        {value}
        {/* <Input placeHolder="Description" dark WrapClassName="flex-grow" disabled size="small" value={value} /> */}
      </div>
    ),
  }];

  return (
    <>
      <td colSpan="4" className="subRow text-left">
        <Table
          columns={columns}
          data={subRowData}
          selectedFlatRows={selectedFlatRows}
        />
      </td>
    </>
  );
};
