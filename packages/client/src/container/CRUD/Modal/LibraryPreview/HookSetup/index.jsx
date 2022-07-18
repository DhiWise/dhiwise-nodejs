import React from 'react';
import { NoData } from '../../../../../components';
import { getHookHeader, getHookFooter } from '../../../../../constant/model';
import { useEditor } from '../../Editor/EditorProvider';
import { useLibrary } from '../LibraryProvider';
import { HookEditor } from './HookEditor';
import { HookList } from './HookList';

export const HookSetup = () => {
  const { selectedModel } = useLibrary();
  const { dbType, currentApplicationCode } = useEditor();
  const [hookCode, setHookCode] = React.useState(1);

  const handleCode = (curHookId) => {
    if (!selectedModel?.hooks || !selectedModel?.name || !dbType || !currentApplicationCode) return;

    const header = getHookHeader({
      dbType, modelName: selectedModel?.name, currentApplicationCode, ...selectedModel.hooks[curHookId - 1],
    });
    const footer = getHookFooter({
      dbType, modelName: selectedModel?.name, currentApplicationCode, ...selectedModel.hooks[curHookId - 1],
    });

    const tHook = `${header}\n\n${selectedModel.hooks[curHookId - 1]?.code}\n\n${footer}`;
    setHookCode(tHook);
  };

  React.useEffect(() => {
    handleCode(1);
  }, []);

  return (
    <>
      <div className="w-full flex h-full">
        {selectedModel?.hooks?.length > 0 ? (
          <>
            <HookList
              hooks={selectedModel?.hooks || []}
              setCurHook={handleCode}
              currentApplicationCode={currentApplicationCode}
            />
            {hookCode && <HookEditor curHook={hookCode} />}
          </>
        ) : <NoData title="No hooks found" />}
      </div>
    </>
  );
};
