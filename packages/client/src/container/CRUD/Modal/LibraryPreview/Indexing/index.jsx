/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useSelector } from 'react-redux';
import { useTable, useExpanded, useRowSelect } from 'react-table';
import '../../../../../assets/css/Table.css';
import { Icons } from '@dhiwise/icons';
import {
  Checkbox, NoData,
} from '../../../../../components';
import { SubRow } from './SubRow';
import { useLibrary } from '../LibraryProvider';
import { DB_CONST, DB_TYPE } from '../../../../../constant/model';
import { SQL_INDEX } from '../../../../../constant/modelIndexing';
import { setAlreadyChecked } from '../PreviewTable';

const setDefaultChecked = (data) => {
  // Default set all id to checked
  const defaultChecked = {};
  data.map((mainRow, i) => {
    defaultChecked[i] = true;
    return mainRow;
  });
  return defaultChecked;
};

function Table({
  columns, data, setCheckedRefData,
}) {
  // Use the state and functions returned from useTable to build your UI
  const { checkedData } = useLibrary();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    toggleRowSelected,
    toggleAllRowsSelected,
  } = useTable({
    columns,
    data,
    initialState: {
      selectedRowIds: checkedData.indexCheckedData !== null ? setAlreadyChecked(checkedData.indexCheckedData) : setDefaultChecked(data),
    },
  },
  useExpanded,
  useRowSelect,
  (hooks) => {
    hooks.visibleColumns.push(() => [
      {
        id: 'selection',
        Header: ({ isAllRowsSelected }) => (
          <Checkbox
            checked={isAllRowsSelected}
            onChange={(select) => { toggleAllRowsSelected(select); }}
          />
        ),
        Cell: ({ row }) => (
          <div className="flex justify-start items-center smallCheckbox">
            <Checkbox checked={row.isSelected} onChange={(checked) => { toggleRowSelected(row.id, checked); }} />
            { row?.original?.indexType !== SQL_INDEX.TYPE.UNIQUE
              ? (
                <span {...row.getToggleRowExpandedProps()}>
                  {row.isExpanded
                    ? (
                      <div className="w-3 h-3 ml-3 cursor-pointer">
                        <Icons.DownArrow />
                      </div>
                    )
                    : (
                      <div className="w-3 h-3 ml-3 cursor-pointer">
                        <Icons.RightArrow />
                      </div>
                    )}
                </span>
              ) : null}
          </div>
        ),
      },
      ...columns,
    ]);
  });

  React.useEffect(() => {
    setCheckedRefData(selectedFlatRows);
  }, [selectedFlatRows]);

  // React.useEffect(() => {
  //   toggleAllRowsSelected(true);
  // }, [toggleAllRowsSelected]);

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead className="z-1">
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
              {
                  row.isExpanded
                  && <tr><SubRow mainRow={row} data={row?.original?.indexFields || []} /></tr>
              }
            </>
          );
        })}
      </tbody>
    </table>
  );
}

export const Indexing = ({ setCheckedRefData }) => {
  const { selectedModel, indexes, dispatch } = useLibrary();
  const dbType = useSelector((state) => DB_CONST[state.projects.applicationDatabase.databaseType]);
  const checkedRefData = React.useRef([]); // to manage global data
  React.useEffect(() => () => {
    dispatch({ type: 'SetCheckedData', payload: { indexCheckedData: checkedRefData.current } });
  }, []);
  const columns = React.useMemo(
    () => [
      {
        id: 'name',
        Header: 'Index name',
        accessor: 'name',
        Cell: ({ row }) => (
          <div className="w-full min-w-40 text-left">
            {row?.original?.name}
          </div>
        ),
      },
      {
        id: 'indexType',
        Header: dbType === DB_TYPE.MONGODB ? 'Create TTL' : 'Data type',
        accessor: 'indexType',
        Cell: ({ row }) => (
          <div className="w-full min-w-40 text-left">
            {dbType === DB_TYPE.MONGODB ? `${row?.original?.ttl ? `${row?.original?.expireAfterSeconds} seconds` : 'No'} ` : row?.original?.indexType}
          </div>
        ),
      },
      {
        id: 'fields',
        Header: dbType === DB_TYPE.MONGODB ? 'Unique index' : 'Attribute',
        accessor: 'fields',
        Cell: ({ row }) => {
          const iFields = row?.original?.fields;
          let fields = '-';
          if (dbType !== DB_TYPE.MONGODB) {
            if (iFields?.length > 0) {
              fields = iFields.toString();
            }
          }

          return (
            <div className="w-full  text-left">
              {dbType === DB_TYPE.MONGODB ? `${row?.original?.unique ? 'Yes' : 'No'}` : fields}
            </div>
          );
        },
      },
    ],
    [],
  );
  return (
    <>
      <div className="dhiTable firstColTable onlyReadView text-left flex-grow h-full">
        {selectedModel?.modelIndexes?.length > 0 ? (
          <Table
            columns={columns}
            data={indexes}
            setCheckedRefData={(data) => {
              checkedRefData.current = data;
              setCheckedRefData(data);
            }}

          />
        ) : <NoData title="No indexing found" />}
      </div>
    </>
  );
};
