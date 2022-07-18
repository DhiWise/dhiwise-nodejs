import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { ConstantView } from './ConstantView';
import Layout from '../Shared/Layout';
import { BoxLayout, NoData, Loader } from '../../components';
import { listConstants } from '../../redux/thunks/constants';
import { AddConstant } from './AddConstant';
import { LeftConstantList } from './LeftConstantList';
import { listModels } from '../../redux/thunks/models';

export default function Constant() {
  const addModalRef = React.useRef();
  const {
    constantList, loading, applicationId, selectedConstants,
  } = useSelector(({ constants, projects }) => ({
    constantList: constants.constantList,
    loading: constants.listConstantFetching,
    applicationId: projects.currentApplicationId,
    selectedConstants: constants.currentId,
    currentApplicationCode: projects.currentApplicationCode,
  }), shallowEqual);

  const dispatch = useDispatch();
  const fetchAllConstant = () => {
    dispatch(listConstants({
      applicationId,
      isActiveDeactivateDisplay: true,
    }));
  };
  React.useEffect(() => {
    fetchAllConstant();
    dispatch(listModels({ applicationId }));
  }, []);
  return (
    <Layout isSidebar>

      <div className="w-sidebarRight flex">
        {loading && <Loader style={{ minHeight: 'auto' }} className="w-full" />}
        { !loading && (
        <>
          {!isEmpty(constantList) ? (
            <>
              <LeftConstantList
                addConstant={() => {
                  addModalRef.current?.showConstantModal();
                }}
              />
              <BoxLayout variant="subRight">
                <ConstantView key={selectedConstants} />
              </BoxLayout>
            </>
          )
            : (
              <NoData
                onClick={() => {
                  addModalRef.current?.showConstantModal();
                }}
                btnText="Add constant"
                title="No constant found"
              />
            )}
          <AddConstant
            addModalRef={addModalRef}
          />
        </>
        )}
      </div>

    </Layout>

  );
}
