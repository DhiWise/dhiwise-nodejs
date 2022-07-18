import React from 'react';
import { CodeEditor } from '../../../../../../components';

export const HookEditor = ({ curHook }) => (
  <div style={{ width: 'calc(100% - 14rem)' }} className="xl:h-full xxl:h-full">
    <CodeEditor
      readOnly
      className="w-full h-full"
      language="javascript"
      defaultValue=""
      value={curHook}
    />
  </div>
);
