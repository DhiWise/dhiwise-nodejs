import React, { useState } from 'react';
import { cloneDeep } from 'lodash';
import { useSelector } from 'react-redux';
import { HookEditor } from './HookEditor';
import { HookList } from './HookList';
import { useEditor } from '../Editor/EditorProvider';
import { CodeEditor } from '../../../../components';
import { getHookFooter, getHookHeader } from '../../../../constant/model';

export const HookSetup = ({
  onHookError,
}) => {
  const {
    hooks, currentModel, setHooks, dbType,
    // saveJSON,
  } = useEditor();
  const currentApplicationCode = useSelector((state) => state.projects.currentApplicationCode);

  const [currentHook, setCurrentHook] = useState();
  const typeRef = React.useRef(null);

  React.useMemo(() => {
    typeRef.current = hooks.map((x) => x.hookType);
    if (!currentHook) { setCurrentHook(hooks[0]); }
  }, [hooks]);

  const handleChangeCode = React.useCallback((code, isErr) => {
    const newData = cloneDeep(hooks);
    const index = newData.findIndex((x) => x._id === currentHook?._id);
    if (index > -1) {
      newData[index].code = code;
      newData[index].isErr = isErr;
      setCurrentHook(newData[index]);
    }
    setHooks(newData);
  }, [hooks, currentHook]);

  const header = React.useMemo(() => {
    if (!currentHook || !currentModel || !dbType || !currentApplicationCode) return '';
    return getHookHeader({
      dbType, modelName: currentModel.name, currentApplicationCode, ...currentHook,
    });
  }, [dbType, currentModel?.name, currentHook?.hookType]);

  const footer = React.useMemo(() => getHookFooter({ dbType, currentApplicationCode }), [dbType]);

  return (
    <>
      <div className="w-full flex h-full">
        <HookList
          currentModel={currentModel}
          hooks={hooks}
          currentHook={currentHook}
          setCurrentHook={setCurrentHook}
          currentApplicationCode={currentApplicationCode}
        />

        <div style={{ width: 'calc(100% - 14rem)' }} className="xl:h-full xxl:h-full flex flex-col">
          <>
            <CodeEditor
              readOnly
              language="javascript"
              height={100}
              lineNumbers={false}
              className="sm:h-auto flex-shrink-0 smallEditor"
              value={header}
              isShowError={false}
              loading={false}
              scrollbar={{
                vertical: 'hidden',
                handleMouseWheel: false,
              }}
            />
            <HookEditor currentModel={currentModel} onHookError={onHookError} onChangeCode={handleChangeCode} currentHook={currentHook} currentApplicationCode={currentApplicationCode} />
            <CodeEditor
              readOnly
              language="javascript"
              height={100}
              lineNumbers={false}
              className="sm:h-auto flex-shrink-0 smallEditor"
              defaultValue={footer}
              loading={false}
              scrollbar={{
                vertical: 'hidden',
                handleMouseWheel: false,
              }}
            />
          </>
        </div>
      </div>

    </>
  );
};
