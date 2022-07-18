import React from 'react';
import { isEmpty } from 'lodash';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { PolicyView } from './PolicyView';
import Layout from '../Shared/Layout';
import { BoxLayout, NoData, Loader } from '../../components';
import { AddPolicy } from './AddPolicy';
import { LeftPolicyList } from './LeftPolicyList';
import { listPolicy } from '../../redux/thunks/policy';
import { listModels } from '../../redux/thunks/models';

export default function Policy() {
  const addModalRef = React.useRef();
  const {
    policyList, loading, applicationId,
  } = useSelector(({ policy, projects }) => ({
    policyList: policy.policyList,
    loading: policy.listPolicyFetching,
    applicationId: projects.currentApplicationId,
    currentApplicationCode: projects.currentApplicationCode,
  }), shallowEqual);

  const dispatch = useDispatch();

  const fetchAllPolicy = () => {
    dispatch(listPolicy({
      applicationId,
      isActiveDeactivateDisplay: true,
    }));
  };

  React.useEffect(() => {
    fetchAllPolicy();
    dispatch(listModels({ applicationId }));
  }, []);

  return (
    <Layout isSidebar>

      <div className="w-sidebarRight">
        {/* {loading && <LazyLoader />} */}
        {loading && <Loader className="min-h-body" />}
        {!loading && (
          <>
            {!isEmpty(policyList) ? (
              <div className="flex h-full">
                <LeftPolicyList
                  addPolicy={() => {
                    addModalRef.current?.showPolicyModal();
                  }}
                />
                <BoxLayout variant="subRight" className="overflow-hidden">
                  <PolicyView />
                </BoxLayout>
              </div>
            )
              : (
                <NoData
                  onClick={() => {
                    addModalRef.current?.showPolicyModal();
                  }}
                  btnText="Add middleware"
                  title="No middleware found"
                />
              )}
            <AddPolicy
              addModalRef={addModalRef}
            />
          </>
        )}
      </div>

    </Layout>

  );
}
