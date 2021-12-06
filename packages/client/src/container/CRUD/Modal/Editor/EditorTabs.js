/* eslint-disable no-nested-ternary */
/* eslint-disable radix */
import React from 'react';

import { useSelector } from 'react-redux';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import { isArray } from 'lodash';
import { TabCSs } from '../../../../assets/css/tab';

import {
  DB_TYPE, HOOK_TAB_TITLE,
} from '../../../../constant/model';
import { HookSetup } from '../HookSetup';
import TableView from './TableView';
import { useEditor } from './EditorProvider';
import { MongoIndexing } from '../Indexing/Mongodb/index';
import { SQLIndexing } from '../Indexing/SQLIndexing/index';
import { useIndex } from '../Indexing/SQLIndexing/IndexProvider';

export const EditorTabs = React.memo(React.forwardRef(({
  jsonError, setJsonError,
}, ref) => {
  const {
    code, activeTab, customSetting, hooks, tableToCodeViewParser,
    handleTabSelect, mainActiveTab, dbType, dependency,
  } = useEditor();
  const { modelIndexList } = useIndex();
  const currentApplicationCode = useSelector((state) => state.projects.currentApplicationCode);

  React.useImperativeHandle(ref, () => ({
    code, customSetting, hooks, tableToCodeViewParser, modelIndexList, activeTab, mainActiveTab, dependency,
  }));

  React.useMemo(() => {
    if (isArray(hooks)) {
      const isErr = hooks.find((x) => x.isErr)?.isErr;
      if (isErr) {
        setJsonError(isErr);
      } else if (!isErr && jsonError?.isHookErr) {
        setJsonError(false);
      }
    }
  }, [hooks]);

  return (
    <>
      <Tabs
        selectedTabClassName={TabCSs.selectTab}
        selectedTabPanelClassName="flex-grow h-0"
        className="relative flex-grow flex flex-col h-full"
        onSelect={handleTabSelect}
      >
        <TabList
          className={`${TabCSs.tabHead} flex items-center justify-between pt-0 pr-5 modelTab relative flex-shrink-0`}
        >
          <div className="flex items-center">
            <Tab className={TabCSs.tabTitle}>
              Schema
            </Tab>
            <Tab className={TabCSs.tabTitle}>{HOOK_TAB_TITLE[currentApplicationCode]}</Tab>
            <Tab className={TabCSs.tabTitle}>Indexing</Tab>
          </div>
        </TabList>
        <TabPanel>
          <div className="h-full">
            <TableView />
          </div>
        </TabPanel>
        <TabPanel>
          <HookSetup
            ref={{}}
          />
        </TabPanel>
        <TabPanel>
          {dbType === DB_TYPE.MONGODB ? <MongoIndexing /> : <SQLIndexing />}
        </TabPanel>
      </Tabs>

    </>
  );
}));
EditorTabs.displayName = 'EditorTabs';
