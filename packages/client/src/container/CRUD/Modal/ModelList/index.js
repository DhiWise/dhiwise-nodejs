/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import ScrollArea from 'react-scrollbar';
import { Menu, MenuItem } from 'react-pro-sidebar';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { TabCSs } from '../../../../assets/css/tab';
import { SidebarList } from '../../../Shared/Layout/Sidebar/SubSidebar';
import { LinkTag, Description } from '../../../../components';
import { CreateModel } from '../AddModalPopup';
import { setCurrentModel } from '../../../../redux/reducers/models';
import { useBoolean } from '../../../hooks';
import { SidebarMenuListCss } from '../../../../components/SidebarMenuList/sidebarMenuListCss';
import {
  ModelPanel,
} from '../../../../constant/model';
import { useModel } from '../Editor/ModelProvider';
import { ModelLibrary } from './ModelLibrary';
import DeleteModel from '../DeleteModel';
import { getModelDetail } from '../../../../redux/thunks/models';

export const ModelList = ({ setPanel, modelPanel }) => {
  const { isError, isJsonError } = useModel();
  const [modalStatus, showModal, hideModal] = useBoolean(false);
  const modelList = useSelector((state) => state.models.modelList);
  const currentId = useSelector((state) => state.models.currentId);
  const currentModel = React.useMemo(() => modelList.find((model) => model._id === currentId), [currentId, modelList]);
  const dispatch = useDispatch();
  const location = useLocation();

  const openCreateModel = () => {
    showModal();
  };
  React.useEffect(() => {
    if (location.state?.isOpenPopup) {
      // when dashboard redirect open popup
      openCreateModel();
    }
  }, [location.state?.isOpenPopup]);
  return (
    <>
      <SidebarList
        {...(ModelPanel.CUSTOM.name === modelPanel && { isAddButton: true })}
        sidebarClass="modelList z-10 xxl:w-2/12"
        style={{ top: '0', width: '16rem' }}
        title="Models"
        addClick={openCreateModel}
        tooltip="Add model"
        Scroll
      >

        <Tabs selectedIndex={modelPanel === ModelPanel.CUSTOM.name ? ModelPanel.CUSTOM.tabIndex : ModelPanel.LIBRARY.tabIndex} className="flex-grow flex flex-col h-0" selectedTabPanelClassName="h-0 flex-grow" selectedTabClassName={TabCSs.selectTab}>
          <TabList className={`${TabCSs.tabHead} modelListTab`}>
            <Tab onClick={() => { setPanel(ModelPanel.CUSTOM.name); }} className={TabCSs.tabSmallTitle}>Custom</Tab>
            <Tab onClick={() => { setPanel(ModelPanel.LIBRARY.name); }} className={TabCSs.tabSmallTitle}>Library</Tab>
          </TabList>
          <TabPanel>
            <div className="overflow-auto h-full">
              <ScrollArea
                speed={0.8}
                className="area h-full justify-between"
                contentClassName="w-full"
                smoothScrolling
              >
                {modelList.length ? (
                  <Menu iconShape="square" className="p-2 cursor-text">
                    {modelList.map((d) => (
                      <MenuItem
                        key={`model${d._id}`}
                        className={`${SidebarMenuListCss.menuList} sm:py-0 relative ${currentId === d._id && (!!isError(d.name) || (isJsonError && currentModel?.name === d.name)) ? 'bg-secondary-red border-secondary-red' : ''}  ${currentId === d._id && SidebarMenuListCss.menuActive}`}
                      >
                        <div
                          className="flex items-center justify-between w-full py-1 pr-8"
                          onClick={() => {
                            if (d._id === currentId) return;
                            dispatch(setCurrentModel({ currentId: d._id }));
                            dispatch(getModelDetail(d._id));
                          }}
                        >
                          <span className={`text-primary-text text-sm leading-5 truncate ${(!!isError(d.name) || (isJsonError && currentModel?.name === d.name)) ? 'text-secondary-red' : ''} ${currentId === d._id && 'text-defaultWhite'}`}>
                            {d.name}
                          </span>
                        </div>
                        {!d?.isDefault && <DeleteModel isDeleteWhiteIcon={currentId === d._id} className="absolute right-2 py-2 top-0 bottom-0 m-auto" currentId={d._id} />}
                      </MenuItem>
                    ))}
                  </Menu>
                )
                  : (
                    <div className="flex justify-center">
                      <div className="text-center py-5 px-2">
                        <h4 className="text-lg text-primary-text mb-1">Create New Model</h4>
                        <Description>
                          {/* No model is available in this application. */}
                          <LinkTag onClick={openCreateModel}> Click here</LinkTag>
                          to add a model in your application.
                        </Description>
                      </div>
                    </div>
                  )}
              </ScrollArea>
            </div>
          </TabPanel>
          <TabPanel>
            <ModelLibrary />
          </TabPanel>
        </Tabs>
        <CreateModel
          handleCancel={hideModal}
          closeModal={hideModal}
          isOpen={modalStatus}
        />
      </SidebarList>

    </>
  );
};
