/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useSelector } from 'react-redux';
import { useTable, useExpanded, useFlexLayout } from 'react-table';
import '../../../../../../assets/css/Table.css';
import { DB_CONST, DB_TYPE } from '../../../../../../constant/model';
import { MONGO_TYPE_OPTIONS, SQL_INDEX } from '../../../../../../constant/modelIndexing';

function Table({ columns, data }) {
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
  },
  useExpanded,
  useFlexLayout);
  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead style={{ zIndex: '0' }}>
        {headerGroups.map((headerGroup, index) => (
          <tr key={index} {...headerGroup.getHeaderGroupProps()} className="relative">
            {headerGroup.headers.map((column) => (
              <th key={column.id} {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
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

export const SubRow = ({ data, mainRow }) => {
  const dbType = useSelector((state) => DB_CONST[state.projects.applicationDatabase.databaseType]);

  const rowIndexType = React.useMemo(() => ({
    isBTree: mainRow?.original?.indexType === SQL_INDEX.TYPE.BTREE,
    isGin: mainRow?.original?.indexType === SQL_INDEX.TYPE.GIN,
    isPartial: mainRow?.original?.indexType === SQL_INDEX.TYPE.PARTIAL,
    isUnique: mainRow?.original?.indexType === SQL_INDEX.TYPE.UNIQUE,
  }), [mainRow?.original?.indexType]);

  const columns = React.useMemo(() => (dbType === DB_TYPE.MONGODB
    ? [
      {
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: () => (
          <div className="flex justify-start items-center smallCheckbox" />
        ),
        SubCell: () => null, // No expander on an expanded row
      },
      {
        key: 'attribute',
        Header: 'Attribute',
        accessor: 'attribute',
        Cell: ({ row }) => (
          <div className="w-full min-w-40 text-left">
            {row?.original?.attribute}
          </div>
        ),
      },
      {
        key: 'type',
        Header: 'Index type',
        accessor: 'type',
        Cell: ({ row }) => (
          <div className="w-full min-w-40 text-left">
            {MONGO_TYPE_OPTIONS.find((x) => x.id === row?.original?.type)?.name}
          </div>
        ),
      }] : rowIndexType.isBTree ? [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: () => (
          <div className="flex justify-start items-center smallCheckbox" />
        ),
        SubCell: () => null, // No expander on an expanded row
      },
      {
        Header: 'Attribute',
        accessor: 'name',
        Cell: ({ row }) => (
          <div className="w-full min-w-40 text-left">
            {row?.original?.attribute}
          </div>
        ),
      },
      {
        Header: 'Order',
        accessor: 'order',
        Cell: ({ row }) => (
          <div className="w-full min-w-40 text-left">
            {row?.original?.order}
          </div>
        ),
      },
      {
        Header: 'Length',
        accessor: 'Length',
        Cell: ({ row }) => (
          <div className="w-full text-left">
            {row?.original?.length}
          </div>
        ),
      },
    ] : rowIndexType.isPartial ? [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: () => (
          <div className="flex justify-start items-center smallCheckbox" />
        ),
        SubCell: () => null, // No expander on an expanded row
      },
      {
        Header: 'Attribute',
        accessor: 'name',
        Cell: ({ row }) => (
          <div className="w-full min-w-40 text-left">
            {row?.original?.attribute}
          </div>
        ),
      },
      {
        Header: 'Operator',
        accessor: 'Operator',
        Cell: ({ row }) => (
          <div className="w-full min-w-40 text-left">
            {row?.original?.operator}
          </div>
        ),
      },
      {
        Header: 'Value',
        accessor: 'Value',
        Cell: ({ row }) => (
          <div className="w-full text-left">
            {row?.original?.value}
          </div>
        ),
      },
    ] : []),
  [dbType]);
  return (
    <>
      <td colSpan="4" className="subRow text-left">
        <Table
          columns={columns}
          data={data}
        />
      </td>
    </>
  );
};
