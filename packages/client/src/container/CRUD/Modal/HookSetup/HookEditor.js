import React, { useState } from 'react';
import { debounce } from 'lodash';
import { CodeEditor } from '../../../../components';
import { HOOK_TAB_TITLE } from '../../../../constant/model';

export const HookEditor = React.memo(({
  currentHook, onChangeCode, currentModel, currentApplicationCode,
}) => {
  const [code, setCode] = useState(currentHook?.code);

  React.useMemo(() => {
    setCode(currentHook?.code);
  }, [currentHook?._id]);

  React.useMemo(() => {
    const isExist = currentModel?.hooks?.find((hook) => (currentHook?._id === (`${hook.type}-${hook.operation}`)));
    if (isExist) { setCode(isExist?.code); } else setCode('');
  }, [currentModel?.hooks]);

  const debounceSave = debounce(onChangeCode, 1000);

  return (
    <>
      <CodeEditor
        className="w-full h-full flex-grow"
        language="javascript"
        defaultValue=""
        value={code}
        onChange={(tcode) => {
          try {
            setCode(tcode);
            debounceSave(tcode);
          } catch (err) {
            if (err) {
              // setHErr(true);
            }
          }
        }}
        onValidate={(errors) => {
          if (errors?.length <= 0) {
            if (currentHook?.code !== code || currentHook?.isErr) { debounceSave(code, false); }
          } else {
            debounceSave(code, {
              name: `${HOOK_TAB_TITLE[currentApplicationCode]} error`, message: `${currentHook?.hookType}: parse error ${errors[0]?.message}`, isCustom: true, isHookErr: true,
            });
          }
        }}
      />
    </>
  );
});
HookEditor.displayName = 'HookEditor';
