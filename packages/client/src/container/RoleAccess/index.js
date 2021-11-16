import React from 'react';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import Layout from '../Shared/Layout';
import { RoleAccessList } from './RoleAccessList';
import { RoleList } from './RoleList';
import { BoxLayout, Loader, NoData } from '../../components';
import { AddRole } from './AddRole';
import { RoleAccessProvider, useRoleAccess } from './RoleAccessProvider';
import { listModels } from '../../redux/thunks/models';
import { useBoolean } from '../../components/hooks';
import { useToastNotifications } from '../hooks';

const RoleAccess = () => {
  const dispatch = useDispatch();
  const addModalRef = React.useRef();
  const { addErrorToast } = useToastNotifications();
  const [modelLoader, setModelLoader, hideModelLoader] = useBoolean(false);

  const applicationId = useSelector((state) => state.projects.currentApplicationId);

  const { isLoading, roleAccessList } = useRoleAccess();

  React.useEffect(() => {
    setModelLoader();
    dispatch(listModels({ applicationId }))
      .then(unwrapResult)
      .catch(addErrorToast)
      .finally(hideModelLoader);
  }, [applicationId]);

  return (
    <Layout isSidebar>
      {(isLoading || modelLoader)
      && (
        <div className="w-full">
          <Loader />
        </div>
      )}
      {(!isLoading && !modelLoader)
        && (
          !isEmpty(roleAccessList)
            ? (
              <BoxLayout variant="mainRight" className="flex">
                <RoleList handleShow={() => {
                  addModalRef.current?.showAddRoleModal();
                }}
                />
                <BoxLayout variant="subRight" className="flex flex-col">
                  <RoleAccessList />
                </BoxLayout>
              </BoxLayout>
            )
            : (
              <div className="flex items-center w-full">
                <NoData
                  onClick={() => {
                    addModalRef.current?.showAddRoleModal();
                  }}
                  btnText="Add Role"
                  title="No roles found"
                />
              </div>
            )
        )}
      <AddRole addModalRef={addModalRef} />
    </Layout>
  );
};

const RoleAccessMain = () => (
  <RoleAccessProvider>
    <RoleAccess />
  </RoleAccessProvider>
);

export default RoleAccessMain;
