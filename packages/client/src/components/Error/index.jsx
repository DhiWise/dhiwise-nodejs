import React from 'react';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import Drawer from 'rc-drawer';
import { Icons } from '@dhiwise/icons';
import { TabCSs } from '../../assets/css/tab';
import { Count } from '../Count';
import { DrawerClose } from '../ReactDrawer/DrawerClose';
import { MODEL_ERROR_TABS } from '../../constant/model';

const NoError = React.memo(() => (
  <div className="flex items-center p-2 h-48 justify-center">
    <div className="flex-grow-0 flex items-center">
      <div className="justify-end lex text-xl text-gray-400 font-normal">
        No Errors found.
      </div>
    </div>
  </div>
));
NoError.displayName = 'NoError';

export const ErrorList = React.memo(({
  isError, isWarring, error, attribute,
}) => {
  if (!error) {
    return (
      <NoError />
    );
  }
  return (
    <div className="flex items-center p-2 border-b-1 border-gray-100">
      <div className="flex-grow-0 flex items-center">
        <div className="w-3 h-3 mr-2">
          {isError
            && (
              <>
                <Icons.Alert color="#E24C4B" />
                {' '}
              </>
            )}
          {isWarring
            && <><Icons.Warring color="#ffbe00" /></>}
        </div>
        <div className="text-primary-text">{error.name}</div>
        <hr className="w-px h-4 bg-gray-100 mx-2" />
        {!!attribute && (
          <>
            <div className="text-primary-text text-xs">{attribute}</div>
            <hr className="w-px h-4 bg-gray-100 mx-2" />
          </>
        )}
        <div className="justify-endlex text-xs text-gray-400 font-normal">
          {error.message}
        </div>
      </div>
      <div className="flex-grow flex justify-end">
        {/* <div className="w-4 h-4 cursor-pointer">
          <Icons.Redirect />
        </div> */}
      </div>
    </div>
  );
});
ErrorList.displayName = 'ErrorList';
export const Error = React.memo(({
  isOpen,
  handleCancel,
  error,
  modelErrors = [],
  modelErrCount = 0,
  isModelTab = false,
  handletabChange,
}) => (
  <div>
    <Drawer
      open={isOpen}
      handleSubmit={handleCancel}
      onClose={handleCancel}
      handleCancel={handleCancel}
      // ease
      level={null}
      showMask={false}
      handler={false}
      placement="bottom"
      wrapperClassName=""
    >
      {/* <ReactDrawer
      type="horizontal"
      open={isOpen}
      position="bottom"
      onClose={handleCancel}
      onDrawerClose={handleCancel}
      noOverlay
    > */}
      <DrawerClose onClick={handleCancel} />
      <Tabs selectedTabClassName={TabCSs.selectTab}>
        <TabList className={`${TabCSs.tabHead} flex justify-between items-center`}>
          <div className="flex items-center">
            <Tab className={`${TabCSs.tabTitle} flex items-center`} onClick={() => handletabChange && handletabChange(MODEL_ERROR_TABS.JSON_ERROR)}>
              JSON error
              <Count total={error ? 1 : 0} />
            </Tab>
            {
              isModelTab
              && (
                <Tab className={`${TabCSs.tabTitle} flex items-center`} onClick={() => handletabChange && handletabChange(MODEL_ERROR_TABS.MODEL_ERROR)}>
                  Model error
                  <Count total={modelErrCount} />
                </Tab>
              )
            }
          </div>
        </TabList>
        <TabPanel>
          <div className="px-2 overflow-auto h-48">
            <ErrorList error={error} isError />
          </div>
        </TabPanel>
        {
          isModelTab
          && (
            <TabPanel>
              <div className="px-2 overflow-auto h-48">
                {
                  modelErrCount === 0
                    ? <NoError />
                    : modelErrors.map((x) => x.error.map((e) => (
                      <ErrorList
                        key={e.modelName}
                        error={{
                          name: x.modelName,
                          message: e,
                        }}
                        isError
                        attribute={x.attribute}
                      />
                    )))
                }
                {/* <ErrorList error={error} isError name="User auth" attribute="Password" />
            <ErrorList error={error} isError name="User auth" attribute="Password" /> */}
              </div>
            </TabPanel>
          )
        }
      </Tabs>
    </Drawer>
    {/* </ReactDrawer> */}
  </div>
));
Error.displayName = 'Error';
