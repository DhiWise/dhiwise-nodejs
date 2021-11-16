/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import { Controller, useFormContext } from 'react-hook-form';
import { last } from 'lodash';
import { useSelector } from 'react-redux';
import { TabCSs } from '../../../../assets/css/tab';
import {
  BoxLayout,
  Button,
  Heading,
} from '../../../../components';
import { QueryBuilder } from './QueryBuilder';
import { RouteTabIndexName, useAddRoute } from './AddRouteProvider';
import { useAddToggle } from '../AddToggleProvider';
import Basic from './Basic';
import Advance from './Advance';
import { Configuration } from './Configuration';
import { useRoute } from '../RouteProvider';
import { useBoolean } from '../../../../components/hooks';
import { ModelPermission } from './ModelPermission';
import { ROUTE_GENERATE_TYPE } from '../../../../constant/routes';
import { NestedQueryBuilder } from './QueryBuilder/NestedQueryBuilder';
import { ResponseProvider } from './QueryBuilder/ResponseProvider';
import { getModelPermissions } from '../../../../api/models';

export const AddRoutes = () => {
  const applicationId = useSelector((state) => state.projects.currentApplicationId);
  const { addModal, hideAddModal } = useAddToggle();
  const {
    setTabIndex, handleSave, loadingCallBack, tabIndex, resetData,
  } = useAddRoute();
  const { dispatch, editRouteData } = useRoute();
  const methods = useFormContext();
  const [loading,,, setToggle] = useBoolean();
  const { control, reset } = methods;

  const [permissionData, setPermissionData] = React.useState([]);

  React.useEffect(() => {
    if (!addModal) {
      dispatch({ type: 'ResetEditRouteData' });
      // TODO:Make provide
      setTabIndex(0);
      resetData();
      reset();
    }
  },
  [addModal]);

  React.useEffect(() => {
    if (editRouteData?.type === ROUTE_GENERATE_TYPE.AUTO && editRouteData?.modelId) {
      getModelPermissions({ applicationId, _id: editRouteData?.modelId })
        .then((data) => {
          setPermissionData(data.data?.list?.[0] || []);
        });
    }
  }, [editRouteData]);

  return (
    addModal && (
      <BoxLayout variant="subRight">
        <div className="w-full flex flex-col">
          <div className="w-full flex justify-between items-center px-5 py-3 headTop flex-shrink-0">
            <Heading variant="h4" className="mr-2">
              {editRouteData._id ? 'Edit routes' : 'Add routes'}
            </Heading>
            <div className="flex justify-end items-center">
              <Button
                onClick={() => {
                  hideAddModal();
                  // props.routesListRef.current?.fetchAllModelRoutes();
                }}
                type="cancel"
                size="medium"
                shape="rounded"
                variant="outline"
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                onClick={() => { loadingCallBack(setToggle); handleSave(); }}
                type="submit"
                size="medium"
                shape="rounded"
                loading={loading}
              >
                Save
              </Button>
            </div>
          </div>

          <Tabs selectedTabPanelClassName="flex-grow h-0" className="flex-grow flex flex-col" selectedIndex={tabIndex} selectedTabClassName={TabCSs.selectTab} onSelect={(index) => { setTabIndex(index); }}>
            <TabList className={`${TabCSs.tabHead} routesTab flex-shrink-0`}>
              { Object.values(((editRouteData?.type ?? ROUTE_GENERATE_TYPE.MANUAL) === ROUTE_GENERATE_TYPE.MANUAL) ? (RouteTabIndexName[editRouteData?.type ?? ROUTE_GENERATE_TYPE.MANUAL]) : (RouteTabIndexName[editRouteData?.type][editRouteData?.method][['{{id}}', 'list', '{{}}', 'updateBulk'].includes(last(editRouteData?.route?.split('/'))) ? last(editRouteData?.route?.split('/')) : 'default']))?.map((tab) => (
                <Tab
                  key={tab}
                  className={`${TabCSs.tabTitle}`}
                >
                  {tab}
                </Tab>
              ))}
            </TabList>

            {/* Tabs for Manual routes */}
            {(editRouteData?.type ?? ROUTE_GENERATE_TYPE.MANUAL) === ROUTE_GENERATE_TYPE.MANUAL
              && (
              <>
                <TabPanel>
                  <div className="px-5 overflow-auto h-full">
                    <Basic />
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="px-5 overflow-auto h-full">
                    <Advance />
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="px-5 overflow-auto h-full">
                    <Controller
                      control={control}
                      name="uploads"
                      defaultValue={editRouteData?.fileUpload?.uploads[0]}
                      render={(controlProps) => (
                        <Configuration
                          {...controlProps}
                        />
                      )}
                    />
                  </div>
                </TabPanel>
                <TabPanel>
                  <Controller
                    control={control}
                    name="queryBuilder"
                    defaultValue={editRouteData?.queryBuilder?.map((query, index) => ({ filterJson: { id: Math.random(), type: 'group' }, ...query, _id: index }))}
                      // rules={{ required: true }}
                    render={(controlProps) => (
                      <QueryBuilder {...controlProps} />
                    )}
                  />
                </TabPanel>
              </>
              )}

            {/* Tabs for Auto generated routes */}
            {editRouteData?.type === ROUTE_GENERATE_TYPE.AUTO && (
            <>
              {(Object.values((RouteTabIndexName[editRouteData?.type][editRouteData?.method][['{{id}}', 'list', '{{}}', 'updateBulk'].includes(last(editRouteData?.route?.split('/'))) ? last(editRouteData?.route?.split('/')) : 'default']))?.includes('Query builder'))
                    && (
                    <TabPanel>
                      <div className="overflow-hidden h-full">
                        <Controller
                          control={control}
                          name="nestedQueryBuilder"
                          defaultValue={editRouteData.nestedQueryBuilder?.map((query, index) => ({ filterJson: { id: Math.random(), type: 'group' }, ...query, _id: index }))}
                          // rules={{ required: true }}
                          render={(controlProps) => (
                            <ResponseProvider>
                              <NestedQueryBuilder {...controlProps} />
                            </ResponseProvider>
                          )}
                        />
                      </div>
                    </TabPanel>
                    )}
              <TabPanel>
                <div className="p-5 overflow-auto h-full">
                  <Controller
                    control={control}
                    name="permissionData"
                    defaultValue={permissionData}
                    render={(controlProps) => (
                      <ModelPermission {...controlProps} />
                    )}
                  />
                </div>
              </TabPanel>
            </>
            )}
          </Tabs>
        </div>
      </BoxLayout>
    )
  );
};
