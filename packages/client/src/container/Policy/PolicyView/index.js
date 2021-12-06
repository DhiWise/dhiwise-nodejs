import React from 'react';
import { useSelector } from 'react-redux';
import Editor from '@monaco-editor/react';
import { isEmpty } from 'lodash';
import { Icons } from '@dhiwise/icons';
import { PolicyHead } from './PolicyHead';
import {
  POLICY_GENERATE_TYPE,
} from '../../../constant/policy';
import DeletePolicy from '../DeletePolicy';
import { Button, Error } from '../../../components';
import { useBoolean } from '../../../components/hooks';

export const PolicyView = React.memo(() => {
  const selectedPolicy = useSelector((state) => state.policy.currentId);
  const policyList = useSelector((state) => state.policy.policyList);
  const currentPolicyData = policyList.find((d) => d._id === selectedPolicy);
  const isDisable = currentPolicyData?.type === POLICY_GENERATE_TYPE.AUTO;
  const [code, setCode] = React.useState(JSON.stringify({}));
  const [isError, setShowError, setHideError] = useBoolean(false);
  const [codeEditorError, setCodeEditorError] = React.useState([]);
  const updateRef = React.useRef();
  const [loading, setLoading, hideLoading] = useBoolean(false);

  React.useEffect(() => {
    setCode(currentPolicyData?.customJson);
  }, [selectedPolicy, currentPolicyData]);

  const onSubmit = () => {
    updateRef.current?.handelPolicyProperty('customJson', code);
    updateRef.current?.setHideEdit();
  };
  const handleShowError = () => {
    setShowError();
  };
  return (
    <div className="flex flex-col w-full">
      <div className="px-5 py-3 flex justify-between headTop items-center">
        <PolicyHead updateRef={updateRef} isDisable={isDisable} setLoading={setLoading} hideLoading={hideLoading} />
        <div className="flex items-center">
          {!isDisable && (
            <Button
              onClick={handleShowError}
              className="ml-2"
              variant="secondary"
              shape="rounded"
              size="medium"
              isIcon
              label={`${!isEmpty(codeEditorError) ? 1 : 0} error`}
              icon={!isEmpty(codeEditorError) ? <Icons.Alert color="#E24C4B" /> : <Icons.Alert />}
            />
          )}
          <DeletePolicy selectedPolicy={selectedPolicy} isDisable={isDisable} />
          {!isDisable && (
            <Button
              size="medium"
              variant="primary"
              shape="rounded"
              className="ml-2"
              onClick={() => { if (!isError) onSubmit(); }}
              loading={loading}
            >
              Save
            </Button>
          )}
        </div>
      </div>
      <div
        className={`flex-grow ${isDisable ? 'readonlyEditor' : ''}`}
        onKeyDown={(e) => {
          // stop copy past
          if (isDisable) {
            e.preventDefault();
          }
        }}
      >
        <Editor
          // eslint-disable-next-line react/jsx-props-no-spreading
          height="100%"
          defaultValue={code}
          value={code}
          theme="vs-dark"
          className="rounded"
          options={{ readOnly: isDisable, contextmenu: !isDisable }}
          // readOnly={isDisable}
          onChange={(tempCode) => {
            setCode(tempCode);
          }}
          onValidate={(error) => {
            setCodeEditorError(error);
          }}
        />

        {isError ? (
          <Error
            isOpen={isError}
            error={
              !isEmpty(codeEditorError) && {
                message: `On line no ${codeEditorError[0]?.endLineNumber} ${codeEditorError[0]?.message}`,
              }
            }
            handleCancel={setHideError}
          />
        ) : null}
      </div>
    </div>
  );
});
PolicyView.displayName = 'PolicyView';
