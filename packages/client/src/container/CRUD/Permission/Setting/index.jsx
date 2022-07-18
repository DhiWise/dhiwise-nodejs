/* eslint-disable no-nested-ternary */
import React from 'react';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import Drawer from 'rc-drawer';
import { capitalize } from 'lodash';
import { TabCSs } from '../../../../assets/css/tab';
import {
  Description, DrawerFooter, DrawerHead, DrawerClose,
} from '../../../../components';
import { SettingDetail } from './SettingDetail';
import {
  CRUD_OPERATIONS, LINKED_CRUD_OPERATION, DEVICE_TYPE_NAME,
} from '../../../../constant/permission';

export const Setting = ({
  onDrawerClose, isOpen, onClose, permissionData, platformType, policyList, handleSave, onChange,
}) => {
  const [activeTab, setActiveTab] = React.useState(CRUD_OPERATIONS.C);

  const handleTabChange = (type) => {
    setActiveTab(type);
  };
  return (
    <Drawer
      open={isOpen}
      handleSubmit={onClose}
      onClose={onDrawerClose}
      handleCancel={onClose}
      ease
      level={null}
      handler={false}
      placement="right"
      wrapperClassName=""
    >

      <DrawerClose onClick={onClose} />
      <DrawerHead title={`${permissionData?.schemaId?.name} - ${capitalize((DEVICE_TYPE_NAME[platformType?.toUpperCase()] ?? platformType) ?? '')}`} className="xl:block xxl:block">
        <Description className="mt-2">{`Set up middleware and its attributes for ${permissionData?.schemaId?.name} for the ${capitalize((DEVICE_TYPE_NAME[platformType?.toUpperCase()] ?? platformType) ?? '')}.`}</Description>
      </DrawerHead>
      <Tabs selectedTabPanelClassName="h-0 flex-grow" className="flex-grow h-0 flex flex-col" selectedTabClassName={TabCSs.selectTab}>
        <TabList className={`${TabCSs.tabHead} settingTab pt-2 mx-5 flex-shrink-0`}>
          {
             Object.keys(LINKED_CRUD_OPERATION)?.map((operation) => (
               <Tab className={`${TabCSs.tabTitle}`} key={CRUD_OPERATIONS[operation]} onClick={() => handleTabChange(CRUD_OPERATIONS[operation])}>
                 {CRUD_OPERATIONS[operation]}
               </Tab>
             ))
            }
        </TabList>
        {
             Object.keys(LINKED_CRUD_OPERATION)?.map((operation) => (
               <TabPanel key={CRUD_OPERATIONS[operation]}>
                 <div className="px-5 overflow-auto h-full">
                   <SettingDetail policyList={policyList} permissionData={permissionData} platformType={platformType} onChange={onChange} linkedOperation={LINKED_CRUD_OPERATION[operation]} />
                 </div>
               </TabPanel>
             ))
          }
      </Tabs>
      <DrawerFooter
        cancelTitle="Cancel"
        submitTitle="Submit"
        handleCancel={onClose}
        handleSubmit={() => {
          handleSave(activeTab);
          onClose();
        }}
      />

    </Drawer>
  );
};
