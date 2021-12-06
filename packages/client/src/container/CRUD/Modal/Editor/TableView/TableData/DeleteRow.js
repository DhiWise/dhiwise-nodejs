import React from 'react';
import { isArray, last } from 'lodash';
import { Icons } from '@dhiwise/icons';
import { TableViewCss } from '../../../../../../assets/css/tableViewCss';
import { ConfirmationAlert } from '../../../../../../components';
import { useToastNotifications } from '../../../../../hooks';
import { useEditor } from '../../EditorProvider';
import useBoolean from '../../../../../../components/hooks/useBoolean';

export const RowDeleteMessage = 'Row has been deleted successfully.';
const DeleteRow = React.memo(({ deleteObj, isSubRow, disabled }) => {
  const {
    tableJson, setTableJson, listRef, tableToCodeViewParser, currentModel, handleAddRow,
    dependency,
  } = useEditor();
  const [isDelete, setIsDelete, hideIsDelete] = useBoolean(false);
  const { addSuccessToast } = useToastNotifications();
  const handleDeleteRow = React.useCallback(() => {
    // delete row by key
    let newTable = [...tableJson];
    const index = newTable.findIndex((r) => r.key === deleteObj.key);
    newTable = newTable.filter((r) => r.key !== deleteObj.key);
    newTable.map((x, i) => {
      // re-arrange keys
      // eslint-disable-next-line no-param-reassign
      x.key = `r${i}`;
      return x;
    });
    const isExist = currentModel?.schemaJson && Object.keys(currentModel.schemaJson)?.find((x) => x === deleteObj.attr); // check for exist in db
    if (isExist) {
      tableToCodeViewParser({
        isSave: true,
        msg: RowDeleteMessage,
        tableArr: newTable,
        showMsg: true,
        tDependency: dependency.map((x) => {
          if (deleteObj.attr === x.oldKey) {
            return { ...x, isDelete: true };
          }
          return x;
        }),
      });
    } else {
      addSuccessToast(RowDeleteMessage);
      if (!newTable?.length) {
        // if 0 length
      } else if (last(newTable)?.attr?.length > 0) handleAddRow(newTable);
      else setTableJson(newTable);
    }
    listRef?.current?.resetAfterIndex(index);
  }, [tableJson, deleteObj, listRef?.current, tableToCodeViewParser, currentModel?.schemaJson]);

  const isSubRowExist = (rowAttr) => {
    if (currentModel?.schemaJson && rowAttr) {
      const isRowExist = Object.keys(currentModel.schemaJson)?.find((x) => x === rowAttr);
      if (isRowExist) {
        let isSubExist;
        if (isArray(currentModel.schemaJson[isRowExist])) {
        // ARRAY type
          isSubExist = Object.keys(currentModel.schemaJson[isRowExist][0])?.find((x) => x === deleteObj.attr);
        } else {
        // JSON type
          isSubExist = Object.keys(currentModel.schemaJson[isRowExist])?.find((x) => x === deleteObj.attr);
        }
        if (isSubExist) return true;
        return false;
      }
      return false;
    } return false;
  };

  const handleDeleteSubRow = React.useCallback(() => {
    // delete sub row by key
    const newTable = [...tableJson];
    const index = newTable.findIndex((r) => r.key === deleteObj.rowKey);
    if (index < 0) return;
    const newSubTable = newTable[index].subRows.filter(
      (sr) => sr.key !== deleteObj.key,
    );
    newSubTable.map((x, i) => {
      // re-arrange keys
      // eslint-disable-next-line no-param-reassign
      x.key = `rs${i}`;
      return x;
    });
    newTable[index].subRows = newSubTable;

    const isExist = !!deleteObj.attr; // blank row
    if (isExist && isSubRowExist(newTable[index].attr)) {
      tableToCodeViewParser({
        isSave: true,
        msg: RowDeleteMessage,
        tableArr: newTable,
        showMsg: true,
        isDelete: true,
        tDependency: dependency.map((x) => {
          if (deleteObj.attr === x.oldKey) {
            return { ...x, parentKey: newTable[index].attr, isDelete: true };
          }
          return x;
        }),
      });
    } else {
      setTableJson(() => newTable);
      addSuccessToast(RowDeleteMessage);
    }

    listRef?.current?.resetAfterIndex(index);
  }, [tableJson, deleteObj, listRef?.current, currentModel?.schemaJson]);

  const handleDeleteModal = React.useCallback(() => {
    if (isSubRow) handleDeleteSubRow();
    else { handleDeleteRow(); }
    hideIsDelete();
  }, [isSubRow, handleDeleteRow, handleDeleteSubRow]);
  return (
    <>
      { isDelete
        ? (
          <ConfirmationAlert
            description="You want to delete this model attribute with all its references from relationships, routes, custom query and model permission permanently. Also, the deleted model attribute cannot be restored in the future."
            isOpen={isDelete}
            handleSubmit={handleDeleteModal}
            handleClose={hideIsDelete}
          />
        )
        : null}
      <div
        className={`${isSubRow ? TableViewCss.subTableClose : TableViewCss.tableClose}
        ${(disabled) ? ' opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => {
          if (disabled) { return; }
          setIsDelete();
        }}
      >
        <Icons.Close />
      </div>
    </>
  );
});
export { DeleteRow };
DeleteRow.displayName = 'DeleteRow';
