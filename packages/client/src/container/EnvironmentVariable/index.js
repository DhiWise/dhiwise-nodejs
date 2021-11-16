import React, { useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import Layout from '../Shared/Layout';
import { EnvironmentValue } from './environmentValue';
import { BoxLayout } from '../../components';
import { getEnvs, upsertEnvs } from '../../api/envVariable';
import { useToastNotifications, useBoolean } from '../hooks';

export const EnvDeleteMessage = 'The environment variable has been deleted successfully.';

const EnvironmentVariable = () => {
  const { addErrorToast, addSuccessToast } = useToastNotifications();
  const envRef = useRef(null);
  const { applicationId, currentApplicationCode } = useSelector(({ projects }) => ({
    applicationId: projects.currentApplicationId,
    currentApplicationCode: projects.currentApplicationCode,
  }), shallowEqual);
  const [loader, setLoader, hideLoader] = useBoolean(false);
  const [upsertLoader, setUpsertLoader, hideUpsertLoader] = useBoolean(false);
  const [envList, setEnvList] = useState([]);

  const fetch = () => {
    setLoader();
    getEnvs({ applicationId }).then((data) => {
      setEnvList(data?.data);
      hideLoader();
    }).catch(() => {
      hideLoader();
      setEnvList();
    });
  };

  React.useEffect(() => {
    fetch();
  }, []);

  const handleSave = (request, isDelete) => {
    if (!envRef?.current) return;
    if (!isDelete && isEmpty(request?.customJson)) return;

    setUpsertLoader();
    upsertEnvs({ ...request, applicationId, definitionType: currentApplicationCode }).then((data) => {
      addSuccessToast(isDelete ? EnvDeleteMessage : data.message);
      hideUpsertLoader();
      setEnvList(data?.data);
    }).catch((e) => {
      addErrorToast(e);
      hideUpsertLoader();
      setEnvList();
    });
  };

  return (
    <Layout isSidebar>
      <BoxLayout variant="mainRight" className="flex flex-col">
        <EnvironmentValue
          ref={envRef}
          envList={envList}
          loader={loader}
          onSave={handleSave}
          upsertLoader={upsertLoader}
          EnvDeleteMessage={EnvDeleteMessage}
        />
      </BoxLayout>
    </Layout>
  );
};
export default EnvironmentVariable;
