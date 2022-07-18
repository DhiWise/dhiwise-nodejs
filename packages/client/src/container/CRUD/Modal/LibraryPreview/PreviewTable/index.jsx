/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  useTable, useExpanded, useRowSelect, useFlexLayout,
} from 'react-table';
// import { TableViewCss } from '@assets/css/tableViewCss';
import { isEmpty } from 'lodash';
import '../../../../../assets/css/Table.css';
import { Icons } from '@dhiwise/icons';
import {
  Checkbox, Description,
} from '../../../../../components';
import { SubRow } from './SubRow';
import { useLibrary } from '../LibraryProvider';
import { useEditor } from '../../Editor/EditorProvider';
import { PopOver } from '../../../../../components/PopOver';

const columns = [{
  Header: 'Attribute',
  accessor: 'attr',
  minWidth: 180,
  width: 180,
  maxWidth: 180,
  Cell: ({ value }) => (
    <div className="text-left min-w-40">
      {value}
      {/* <Input size="small" disabled value={value} /> */}
    </div>
  ),
}, {
  Header: 'Data type',
  accessor: 'type',
  minWidth: 130,
  width: 130,
  maxWidth: 130,
  Cell: ({ value }) => (
    <div className="text-left min-w-40">
      {value}
      {/* <Input WrapClassName="flex-grow" disabled size="small" value={value} /> */}
    </div>
  ),
}, {
  Header: 'Description',
  accessor: 'description',
  minWidth: 250,
  width: 250,
  maxWidth: 250,
  Cell: ({ value }) => (
    <>
      <div className="flex justify-between">
        <div className="text-left whitespace-normal">
          {value ? value.slice(0, 80) : '-'}
          {/* <Input placeHolder="Description" className="truncate" WrapClassName="flex-grow" disabled size="small" value={value} /> */}

          {value?.trim()?.length >= 80
            && (
            <PopOver
              className="inline-block text-primary-dark hover:underline cursor-pointer ml-1"
              data="Read more"
              place="left"
              popOverValue={
                <Description className="max-w-xl sm:text-primary-text opacity-80">{value}</Description>
        }
            />
            )}
        </div>
      </div>
    </>
  ),
}];
const setDefaultChecked = (data) => {
  // Default set all id to checked
  const defaultChecked = {};
  data.forEach((mainRow) => {
    if (!isEmpty(mainRow.subRows)) {
      mainRow.subRows.forEach((sub) => { defaultChecked[`${mainRow.key.slice(1)}.${sub.key.slice(2)}`] = true; });
    }
    defaultChecked[mainRow.key.slice(1)] = true;
  });
  return defaultChecked;
};
// To manage global all tab checked Data
export const setAlreadyChecked = (data) => {
  const defaultChecked = {};
  data.forEach((mainRow) => {
    if (!isEmpty(mainRow.subRows)) {
      // when subRow in not Expanded
      mainRow.subRows.forEach((sub) => { defaultChecked[sub.id] = sub.isSelected !== undefined ? sub.isSelected : true; });
    }
    defaultChecked[mainRow.id] = true;
  });
  return defaultChecked;
};
const Table = ({
  data, setCheckedRefData,
}) => {
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
      // null checked because all data empty
      selectedRowIds: checkedData.schemaCheckedData !== null ? setAlreadyChecked(checkedData.schemaCheckedData) : setDefaultChecked(data),
    },
  }, useExpanded,
  useRowSelect,
  useFlexLayout,
  (hooks) => {
    hooks.visibleColumns.push((allColumns) => [
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
            {!isEmpty(row.subRows) && (
            <span {...row?.getToggleRowExpandedProps?.()}>
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
            )}
          </div>
        ),
      },
      ...allColumns,
    ]);
  });
  React.useEffect(() => {
    setCheckedRefData(selectedFlatRows);
  }, [selectedFlatRows]);

  React.useEffect(() => {
    toggleAllRowsSelected(true);
  }, [toggleAllRowsSelected]);
  return (
    <table {...getTableProps()} className="">
      <thead>
        {headerGroups.map((headerGroup, index) => (
          <tr key={index} {...headerGroup.getHeaderGroupProps()} className="relative">
            {headerGroup.headers.map((column) => (
              <th key={column.id} {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => prepareRow(row) || (
          <>
            {row.depth === 0 && (
            // to remove dupliacte subrow
            <tr {...row.getRowProps()} className="relative">

              {row.cells.map((cell) => (
                <td key={cell.row.id} {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
            )}
            {
                 !isEmpty(row.subRows) && row.isExpanded
                  && (
                  <tr>
                    <SubRow
                      onChangeCheckBox={
                        toggleRowSelected
}
                      selectedFlatRows={selectedFlatRows.map((selected) => selected.id)}
                      subRowData={row.subRows.map((sub) => ({ id: sub.id, ...sub.original }))}
                    />
                  </tr>
                  )
              }
          </>
        ))}
      </tbody>
    </table>
  );
};

export const PreviewTable = ({ setCheckedRefData }) => {
  const {
    selectedModel, libraryModelList, dispatch,
  } = useLibrary();
  const checkedRefData = React.useRef([]); // to manage global data
  const { prepareTableView } = useEditor();
  const [tableData, setTableData] = React.useState([]);
  React.useEffect(() => {
    setTableData(prepareTableView({
      isExcludeArrayId: true,
      tCode: { ...selectedModel.schemaJson },
      isMount: true,
      isReturnTempArray: true,
      customModelList: libraryModelList,
    }) ?? []);
  }, [selectedModel._id]);
  React.useEffect(() => () => {
    // set already checkedData
    dispatch({ type: 'SetCheckedData', payload: { schemaCheckedData: checkedRefData.current } });
  }, []);
  return (
    <>
      <div className="dhiTable firstColTable onlyReadView text-left flex-grow h-full">
        <Table
          data={tableData}
          setCheckedRefData={(data) => {
            checkedRefData.current = data;
            setCheckedRefData(data);
          }}
        />
      </div>
    </>
  );
};
