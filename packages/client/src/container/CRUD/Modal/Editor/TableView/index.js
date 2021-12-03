/* eslint-disable no-plusplus */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable radix */
import React, { useState } from 'react';
import memoize from 'memoize-one';
import arrayMove from 'array-move';
import {
  last, cloneDeep, extend,
} from 'lodash';
import { VariableSizeList as List } from 'react-window';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';
import { TableHead } from './TableHead';
import { useEditor } from '../EditorProvider';
import TableRow from './TableData/TableRow';
// import { Loader } from '../../../../../components';
import Spinner from './TableData/tableRow.loader';
import SpinnerSql from './TableData/sqlTableRow.loader';
import { DB_TYPE } from '../../../../../constant/model';

const LOADING = 1;
const LOADED = 2;
// const itemStatusMap = {};

// const isItemLoaded = (index) => !!itemStatusMap[index];
// const loadMoreItems = (startIndex, stopIndex) => {
//   for (let index = startIndex; index <= stopIndex; index++) {
//     itemStatusMap[index] = LOADING;
//   }
//   return new Promise((resolve) => setTimeout(() => {
//     for (let index = startIndex; index <= stopIndex; index++) {
//       itemStatusMap[index] = LOADED;
//     }
//     resolve();
//   }, 500));
// };

// const TableRow = React.lazy(() => new Promise((resolve) => resolve(import('./TableData/TableRow'))));

const createItemData = memoize(({ items, ...otherProps }) => ({
  items,
  ...otherProps,
}));

const SortableItem = SortableElement(({
  row, mainRowId, index, rowIndex, itemStatusMap, ...otherProps
}) => (row ? (
  <>
    {
        itemStatusMap[rowIndex] === LOADED
          ? (
            <TableRow
              row={row}
              index={rowIndex}
              {...otherProps}
            />
          )
          : (
            <div className="border-t border-gray-200 py-2" id={row.key} style={otherProps.style}>
              {
                otherProps?.dbType === DB_TYPE.MONGODB ? <Spinner /> : <SpinnerSql />
              }
            </div>
          )
      }
  </>
) : null));

const getSize = (index, items, TABLE_TYPES, dbType) => {
  const isMongoDb = dbType === DB_TYPE.MONGODB;
  const r = items?.[index];
  let size = 48;
  if (r) {
    const subRow = isMongoDb && r.isExpand && (r.type === TABLE_TYPES.ARRAY || r.type === TABLE_TYPES.JSON);
    const doubleRow = (r?.filter === 'AS_DEFINED' || (isMongoDb && r.type === TABLE_TYPES.VIRTUAL_RELATION));
    if (doubleRow) size *= 2; // row having double fields
    if (subRow) {
    // row having sub-attributes
      size += (30 + 21); // for add sub-row text and padding
      if (r?.subRows?.length > 0) {
        const subDbRow = r.subRows.filter((x) => x.filter === 'AS_DEFINED');
        if (subDbRow?.length > 0) {
          size += ((48 * 2)) * subDbRow?.length;
          size += (48 * (r?.subRows?.length - subDbRow.length));
        } else { size += (48 * r?.subRows?.length); }
      }
      return size;
    }
  }
  return size; // single row
};

const Row = ({
  index, style, data,
}) => {
  const { items, itemStatusMap, ...otherProps } = data;
  const r = items[index];
  if (!r) return null;
  return (
    <SortableItem
      row={r}
      index={index}
      rowIndex={index}
      useDragHandle
      style={style}
      itemStatusMap={itemStatusMap}
      tableJson={items}
      {...otherProps}
    />
  );
};

const SortableList = SortableContainer((props) => {
  const { TABLE_TYPES } = useEditor();
  const { items, listRef, ...otherProps } = props;
  const [itemStatusMap, setItemMap] = useState({});
  const itemData = createItemData({ items, itemStatusMap, ...otherProps });

  return (
    <div className="h-full">
      <AutoSizer style={{ height: '100%', width: '100%' }}>
        {({ height }) => (
          <InfiniteLoader
            isItemLoaded={(index) => !!itemStatusMap[index]}
            itemCount={items.length}
            loadMoreItems={(startIndex, stopIndex) => {
              for (let index = startIndex; index <= stopIndex; index++) {
                setItemMap((old) => {
                  const newObj = { ...old };
                  newObj[index] = LOADING;
                  return newObj;
                });
              }
              return new Promise((resolve) => setTimeout(() => {
                for (let index = startIndex; index <= stopIndex; index++) {
                  setItemMap((old) => {
                    const newObj = { ...old };
                    newObj[index] = LOADED;
                    return newObj;
                  });
                }
                resolve();
              }, 500));
            }}
          >
            {({ onItemsRendered, ref }) => (
              <List
                ref={(list) => {
                  ref(list);
                  listRef.current = list;
                }}
                height={height} // total height calc height "tableScroll"
                // width={calcWidthPixel}
                style={{ overflowX: 'hidden' }}
                itemCount={items.length} // as new row will be added
                itemData={itemData}
                itemSize={(index) => getSize(index, items, TABLE_TYPES, otherProps.dbType)}
                onItemsRendered={onItemsRendered}
                useDragHandle
                useIsScrolling
                itemKey={(idx, data) => {
                  const { key } = data.items[idx];
                  return key;
                }}
              >
                {Row}
              </List>
            )}
          </InfiniteLoader>
        )}
      </AutoSizer>
    </div>
  );
});

const TableView = () => {
  const {
    tableJson, setTableJson,
    tableToCodeViewParser, listRef, dbType, TABLE_TYPES, currentApplicationCode,
  } = useEditor();

  // const editorLoader = useSelector((state) => state.models.editorLoader);

  // const dispatch = useDispatch();
  const [localRef, setLocalRef] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [loader, setLoader, hideLoader] = useBoolean(false);

  const handleCurEleFocus = React.useCallback((key) => {
    // handle new row focus
    requestAnimationFrame(() => {
      const nextfield = document.querySelector(`#${key} input[name="attr"]`);
      nextfield?.focus();
    });
  }, []);

  const handleAddRow = React.useCallback((tableArr, isAutoFocus) => {
    // add new row
    const newTable = tableArr ? cloneDeep(tableArr) : [...tableJson];
    const obj = {
      key: `r${newTable.length}`,
    };
    newTable.push(obj);
    setTableJson(newTable);
    // setLoading(false);
    requestAnimationFrame(() => {
      listRef?.current?.scrollToItem?.(newTable.length - 1); // add new row from head
    });
    if (isAutoFocus) {
      setTimeout(() => {
        handleCurEleFocus(obj.key);
      }, 1000);
    }
  }, [tableJson, listRef?.current, handleCurEleFocus]);

  const handleAddSubRow = React.useCallback((row, isAutoFocus, opt) => {
    // add new sub row
    const newTable = [...tableJson];
    const index = newTable.findIndex((r) => r.key === row.key);
    if (index > -1) {
      const newSubTable = newTable[index].subRows
        ? [...newTable[index].subRows]
        : [];
      let obj = {
        key: `rs${newSubTable.length}`,
        rowKey: row.key,
      };
      if (opt?.isAdd) {
        obj = extend(obj, opt.dataObj);
      }
      newSubTable.push(obj);
      newTable[index].subRows = newSubTable;
      setTableJson(newTable);
      listRef?.current?.resetAfterIndex?.(index);
      if (isAutoFocus) {
        handleCurEleFocus(obj.key);
      }
    }
  }, [tableJson, listRef?.current]);

  const handleSortEnd = React.useCallback(({ oldIndex, newIndex }, row) => {
    if (oldIndex === newIndex) return;
    let newTable = [...tableJson];
    if (row?.subRows) {
      // sub row sorting
      const newSubTable = row.subRows ? [...row.subRows] : [];
      const index = newTable.findIndex((r) => r.key === row.key);
      if (index < 0) return;
      newTable[index].subRows = arrayMove(newSubTable, oldIndex, newIndex);
    } else newTable = arrayMove(newTable, oldIndex, newIndex);
    setTableJson(newTable);
  }, [tableJson, listRef?.current]);

  const handleExpand = React.useCallback((row, str) => {
    const newTable = [...tableJson];
    const index = newTable.findIndex((r) => r.key === row.key);
    if (index < 0) return;
    newTable[index].isExpand = !newTable[index].isExpand;
    if ((!newTable[index].subRows || newTable[index].subRows?.length === 0) && str === 'sub-attr') {
      // add sub row for empty
      newTable[index].subRows = [{ key: `rs${newTable[index].subRows?.length || 0}`, rowKey: row.key }];
      handleCurEleFocus('rs0');
    } else if (newTable[index].isExpand && newTable[index].subRows?.length > 0 && last(newTable[index].subRows)?.attr?.length > 0) {
      // add sub row for existing on expand
      newTable[index].subRows.push({ key: `rs${newTable[index].subRows.length}`, rowKey: row.key });
    }
    setTableJson(newTable);
    listRef?.current?.resetAfterIndex?.(index); // to reset virtual scroll height
  }, [tableJson, listRef?.current, handleCurEleFocus]);

  React.useEffect(() => {
    setLocalRef(tableJson?.map((x) => x.attr));
  }, [tableJson]);

  const handleChangeInput = React.useCallback(({ key, index, value }) => {
    let forceUpdate = true;
    if (key === 'attr') {
      setLocalRef(tableJson.map((x) => x.attr));
      if (last(tableJson).attr?.length > 0) {
        forceUpdate = false;
        handleAddRow();
      } else tableToCodeViewParser();
    }

    if (key === 'isEnum') {
      const tableData = tableJson.map((x) => x);
      setTableJson(tableData);
    }
    if (key === 'isEnum' || (key === 'filter' || (key === 'type'))) {
    // to reset virtual scroll height
      listRef?.current?.resetAfterIndex?.(index);
    }
    if (key === 'type' && value === TABLE_TYPES.ARRAY && dbType === DB_TYPE.MONGODB) {
      const tableData = tableJson.map((x) => x);
      if (!tableData[index].subRows?.find((x) => x.type === '_id')) {
        // default value false of__id
        tableData[index].subRows = extend(tableData[index].subRows || [], [{
          key: `rs${tableData[index].subRows?.length ? tableData[index].subRows.length - 1 : 0}`,
          attr: '_id',
          default: 'false',
          type: '_id',
          rowKey: tableData[index].key,
        }]);
        setTableJson(tableData);
      }
    } else if (key === 'type' && value === TABLE_TYPES.JSON && dbType === DB_TYPE.MONGODB) {
      // default value false of__id
      const tableData = tableJson.map((x) => x);
      tableData[index].subRows = tableData[index].subRows?.filter((x) => x.type !== '_id');
      setTableJson(tableData);
    }
    if (key !== 'attr') { tableToCodeViewParser(); }
    if (forceUpdate && (key === 'attr' || key === 'type') && dbType !== DB_TYPE.MONGODB) {
      // for SQL databse force-render table
      const tableData = tableJson.map((x) => x);
      setTableJson(tableData);
    }
  }, [tableJson, tableToCodeViewParser, listRef?.current, handleAddRow, dbType]);

  const handleSubRowChange = React.useCallback(({ key, rowIndex }) => {
    if ((key === 'filter')) {
    // to reset virtual scroll height
      listRef?.current?.resetAfterIndex?.(rowIndex);
    }
    tableToCodeViewParser();
  }, [tableJson, tableToCodeViewParser, listRef?.current]);

  return (
    <div className="tableAuto" style={{ overflowY: 'hidden' }}>
      {
      //  loader
      //    ? (
      //      <Loader
      //        style={{ minHeight: '100%' }}
      //      />
      //    )
      //    : (
        <table className="tableScroll flex flex-col sm:p-0">
          <TableHead onAddRow={handleAddRow} dbType={dbType} currentApplicationCode={currentApplicationCode} />
          <div className="h-0 flex-grow">
            {/* <React.Suspense fallback={<p>loading</p>}> */}
            <SortableList
              useDragHandle
              items={tableJson}
              onSortEnd={handleSortEnd}
              onAddSubRow={handleAddSubRow}
              onSubSortEnd={handleSortEnd}
              onExpand={handleExpand}
              onChange={handleChangeInput}
              onSubRowChange={handleSubRowChange}
              localRef={localRef}
              listRef={listRef}
              lengthOfData={tableJson?.length}
              dbType={dbType}
            />
            {/* </React.Suspense> */}
          </div>
        </table>
            }
    </div>
  );
};
export default TableView;
