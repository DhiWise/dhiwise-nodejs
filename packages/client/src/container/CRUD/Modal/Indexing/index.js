/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useTable } from 'react-table';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { isBoolean, isEmpty } from 'lodash';
import '@assets/css/Table.css';
import { Icons } from '@dhiwise/icons';
import {
  ConfirmationAlert, Description, IconBox, NoData,
} from '../../../../components';
import { PopOver } from '../../../../components/PopOver';
import { DragHandle } from '../Editor/TableView/TableData/Sortable';
import { modelIndexOptions, AddIndexing } from './AddIndexing';
import { MODEL_INDEX_ACTION_TYPES, useModelIndex } from './ModelIndexProvider';
import { useEditor } from '../Editor/EditorProvider';
import { useToastNotifications } from '../../../hooks';

const DND_ITEM_TYPE = 'row';

const Row = ({
  row, index, moveRow, handleShow, onDelete,
}) => {
  const dropRef = React.useRef(null);
  const dragRef = React.useRef(null);

  const { dispatch, showModelIndexLoader, hideModelIndexLoader } = useModelIndex();
  const [isDelete, setIsDelete] = React.useState(false);
  const [deleteIndexData, setDeleteIndexData] = React.useState({});

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    hover(item, monitor) {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveRow(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: DND_ITEM_TYPE, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;

  preview(drop(dropRef));
  drag(dragRef);

  return (
    <tr {...row.getRowProps()} className="relative" ref={dropRef} style={{ opacity }}>
      <td style={{ width: '120px' }} ref={dragRef}>
        <DragHandle style={{ top: 'auto' }} />
        {row?.original?.name !== 'PRIMARY' && !row?.original?.isDefault
        && (
        <div className="flex items-center pl-8">
          <ConfirmationAlert
            handleSubmit={() => {
              onDelete(deleteIndexData);
              setIsDelete(false);
            }}
            isOpen={isDelete}
            handleClose={() => setIsDelete(false)}
          />
          <div
            className="w-4 h-4 cursor-pointer"
            onClick={() => {
              setDeleteIndexData(row?.original);
              setIsDelete(true);
            }}
          >
            <Icons.Close />
          </div>
          <div
            className="w-4 h-4 ml-4 cursor-pointer"
            onClick={() => {
              dispatch({ type: MODEL_INDEX_ACTION_TYPES.EDIT_DATA, payload: row?.original });
              showModelIndexLoader();
              hideModelIndexLoader();
              handleShow();
            }}
          >
            <Icons.Edit />
          </div>
        </div>
        )}
      </td>
      {row.cells.map((cell) => <td {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
    </tr>
  );
};

const Table = ({
  columns, data, handleShow, onDelete,
}) => {
  // Use the state and functions returned from useTable to build your UI
  const [records, setRecords] = React.useState([]);

  React.useMemo(() => setRecords(data), [data]);

  const { dispatch } = useModelIndex();
  const getRowId = React.useCallback((row) => row?.index, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    data: records,
    columns,
    getRowId,
  });

  const moveRow = (dragIndex, hoverIndex) => {
    const dragRecord = records[dragIndex];
    const recs = update(records, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRecord],
      ],
    });
    setRecords(recs);
    dispatch({ type: MODEL_INDEX_ACTION_TYPES.FETCH_LIST, payload: recs });
  };

  // Render the UI for your table
  return (
    <DndProvider backend={HTML5Backend}>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="relative">
              <th style={{ width: '120px' }}>
                <IconBox onClick={handleShow} size="small" className="" icon={<Icons.Plus color="#fff" />} tooltip="Add indexing" />
              </th>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(
            (row, index) => prepareRow(row) || (
            <Row
              index={index}
              row={row}
              moveRow={moveRow}
              handleShow={handleShow}
              onDelete={onDelete}
              {...row.getRowProps()}
            />
            ),
          )}
        </tbody>
      </table>
    </DndProvider>
  );
};

export const Indexing = () => {
  // eslint-disable-next-line no-unused-vars

  const { addSuccessToast } = useToastNotifications();
  const { saveJSON } = useEditor();
  const [show, setIsShow] = useState();
  const {
    dispatch, modelIndexList, modelIndexLoader,
  } = useModelIndex();

  const handleShow = () => {
    setIsShow(true);
  };

  const handleCancel = () => {
    dispatch({ type: MODEL_INDEX_ACTION_TYPES.RESET_EDIT_DATA });
    setIsShow(false);
  };

  const handleDel = (obj) => {
    const temp = modelIndexList?.filter((modelIndex) => modelIndex?.name !== obj?.name);
    if (obj.isExist) saveJSON({ indexes: temp, msg: 'Index has been deleted successfully', showMsg: true });
    else {
      dispatch({ type: MODEL_INDEX_ACTION_TYPES.REMOVE, payload: obj });
      addSuccessToast('Index has been deleted successfully');
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Sr no.',
        accessor: 'no',
        Cell: (data) => {
          const srNo = data?.row?.index + 1;
          return srNo;
        },
      },
      {
        Header: 'Index name',
        accessor: 'name',
        Cell: (data) => {
          const indexName = data?.row?.original?.name;
          return (
            (indexName?.length <= 25) ? (
              <div className="flex justify-center">
                {indexName}
              </div>
            )
              : (
                <div className="flex justify-center">
                  {indexName?.slice(0, 25)}
                  <PopOver
                    className="inline-block text-primary-dark hover:underline cursor-pointer ml-1"
                    data="..."
                    popOverValue={
                      <Description className="max-w-xl">{indexName}</Description>
                      }
                  />
                </div>
              )
          );
        },
      },
      {
        Header: 'Attribute - index type',
        accessor: 'indexFields',
        Cell: (data) => {
          const indexFields = data?.row?.original?.indexFields;
          return (
            <div className="flex justify-center">
              {Object.keys(indexFields)?.[0]}
              {' '}
              -
              {' '}
              {modelIndexOptions?.find((option) => option?.id === Object.values(indexFields)?.[0])?.name}
              {' '}
              {Object.keys(indexFields)?.length > 1 && (
                <PopOver
                  className="inline-block text-primary-dark hover:underline cursor-pointer ml-1"
                  data={`${Object.keys(indexFields)?.length - 1}+`}
                  popOverValue={
                    Object.keys(indexFields)?.slice(1)?.map((key) => (
                      <p>
                        {key}
                        {' '}
                        -
                        {' '}
                        {modelIndexOptions?.find((option) => option?.id === indexFields[key])?.name}
                        {' '}
                      </p>
                    ))
                  }
                />
              )}
            </div>
          );
        },
      },
      {
        Header: 'TTL',
        accessor: 'options.expireAfterSeconds',
        Cell: (data) => (data?.row?.original?.options?.expireAfterSeconds || '-'),
      },
      {
        Header: 'Unique index',
        accessor: 'options.unique',
        Cell: (data) => {
          const unique = data?.row?.original?.options?.unique;
          return isBoolean(unique) ? unique?.toString() : '-';
        },
      },
    ],
    [],
  );

  return (
    <>
      {show && <AddIndexing isOpen={show} handleCancel={handleCancel} />}
      {/* <SQLAddIndexing /> */}
      <div className="dhiTable leftSpace flex-grow h-full">
        {!modelIndexLoader && (
          !isEmpty(modelIndexList) ? (
            <Table
              columns={columns}
              data={modelIndexList}
              handleShow={handleShow}
              onDelete={handleDel}
            />
          )
            : (
              <NoData
                onClick={handleShow}
                btnText="Add indexing"
                title="No indexing found"
              />
            )
        )}
      </div>
    </>
  );
};
