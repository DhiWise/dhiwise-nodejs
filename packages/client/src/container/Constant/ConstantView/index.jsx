import React from 'react';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { Button } from '../../../components';
import { ConstantHead } from './ConstantHead';
import { useBoolean } from '../../../components/hooks';
import { CONSTANT_GENERATE_TYPE, NODE_DATA_TYPE } from '../../../constant/applicationConstant';
import { CodeEditor } from '../../../components/CodeEditor';
import { Error } from '../../../components/Error';
import DeleteConstant from '../DeleteConstant';
import { RowDeleteMessage, TableView } from './TableView';
import { useToastNotifications } from '../../hooks';

const jsonLint = require('jsonlint');

const tableToJsonParser = (table) => {
  const a = {};
  table.forEach((tb) => {
    if (isEmpty(tb.attribute) || isEmpty(tb.type)) return;
    a[tb.attribute] = tb.type !== NODE_DATA_TYPE.JSON ? tb.value : tableToJsonParser(tb.subRows);
  });
  return a;
};
export const ConstantView = React.memo(() => {
  const selectedConstant = useSelector((state) => state.constants.currentId);
  const constantList = useSelector((state) => state.constants.constantList);
  const currentConstantData = constantList.find((d) => d._id === selectedConstant);
  const isDisable = currentConstantData?.type === CONSTANT_GENERATE_TYPE.AUTO;
  const [code, setCode] = React.useState(JSON.stringify({}));
  const [isError, setShowError, setHideError] = useBoolean(false);
  const [jsonError, setJsonError] = React.useState(false);
  const [loading, setLoading, hideLoading] = useBoolean(false);
  const onSaveRef = React.useRef('');
  const codeRef = React.useRef();
  const updateRef = React.useRef();
  const tableJsonRef = React.useRef([]);
  const { addSuccessToast } = useToastNotifications();

  const handleUpdate = async (deleteJson) => {
    if (jsonError) {
      setShowError();
      return;
    }
    const tableToCode = tableToJsonParser(deleteJson || tableJsonRef.current);
    if (isEmpty(tableToCode) && !deleteJson && isEmpty(currentConstantData?.customJson)) return;
    setLoading();
    await updateRef.current?.handelConstantProperty('customJson', tableToCode, !deleteJson);
    await updateRef.current?.setHideEdit();
    hideLoading();
    onSaveRef.current?.updateTableJson();
    if (deleteJson) {
      addSuccessToast(RowDeleteMessage);
    }
    setCode(JSON.stringify(tableToCode, null, 2));
  };

  React.useEffect(() => {
    codeRef.current = code;
  }, [code]);

  React.useEffect(() => {
    setCode(isDisable && typeof currentConstantData?.customJson !== 'object' ? currentConstantData?.customJson : JSON.stringify(JSON.parse(JSON.stringify(currentConstantData?.customJson || {})), null, 2));
  }, [selectedConstant]);
  return (
    <div className="flex flex-col w-full h-full">
      <div className="px-3 py-3 flex justify-between headTop">
        <ConstantHead updateRef={updateRef} isDisable={isDisable} />
        <div className="flex items-center">

          <DeleteConstant selectedConstant={selectedConstant} isDisable={isDisable} />
          {!isDisable && (
            <Button
              variant="primary"
              onClick={() => {
                handleUpdate();
              }}
              shape="rounded"
              size="medium"
              className="ml-2"
              loading={loading}
            >
              Save
            </Button>
          )}
        </div>
      </div>

      <div className="flex h-0 w-full flex-grow">
        <TableView
          handelConstantProperty={updateRef.current}
          defaultTableJson={tableJsonRef.current}
          onSaveRef={onSaveRef}
          handleUpdate={handleUpdate}
          setTableJsonRef={(tableJson) => {
            tableJsonRef.current = tableJson;
            setCode(JSON.stringify(tableToJsonParser(tableJson), null, 2));
          }}
        />

        <div className="w-5/12 h-full border-1 border-gray-200">
          <CodeEditor
            readOnly
            value={code}
            className="bg-gray-black py-2"
            onChange={(tempCode) => {
              try {
                jsonLint.parse(tempCode);
                setJsonError(false);
                setHideError();
                setCode(tempCode);
              } catch (err) {
                if (code && !tempCode) {
                  setCode('{}');
                }
                setJsonError(err);
              }
            }}
            onValidate={(errors) => {
              if (isEmpty(errors)) {
                setHideError();
                setJsonError(false);
              }
            }}
            isJSONStringify={false}
          />
        </div>
      </div>

      { isError
        ? <Error isOpen={isError} error={jsonError} handleCancel={setHideError} /> : null}
    </div>
  );
});
ConstantView.displayName = 'ConstantView';
