import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../Shared/Layout';
import { CodeGenerateConfiguration } from './CodeGenerateConfiguration';
import { useBoolean } from '../../components/hooks';
import { getApplicationConfig } from '../../api/applicationConfig';
import { listModels } from '../../redux/thunks/models';
import Spinner from './CodeGenerateConfiguration/CodeGenerateConfiguration.loader';
import { useToastNotifications } from '../hooks';

const Configuration = () => {
  const applicationId = useSelector((state) => state.projects.currentApplicationId);
  const [isLoading, setLoading, unsetLoading] = useBoolean(false);
  const [projectConfig, setProjectConfig] = React.useState([]);
  const [fetchMasters, setFetchMasters] = React.useState(false); // to fetch master's list based on flag
  const { addErrorToast } = useToastNotifications();
  const dispatch = useDispatch();

  function fetchApplicationConfig() {
    if (applicationId) {
      setLoading();
      getApplicationConfig({ applicationId }).then(
        (configRes) => {
          setProjectConfig(configRes?.data?.list?.[0] || []);
          setFetchMasters(true);
          unsetLoading();
        },
      ).catch(addErrorToast).finally(unsetLoading);
    }
  }

  React.useEffect(() => {
    fetchApplicationConfig();
  }, [applicationId]);

  React.useEffect(() => {
    if (applicationId) {
      dispatch(listModels({ applicationId }));
    }
  }, [applicationId]);

  return (
    <Layout isSidebar>
      {isLoading ? <Spinner /> : <CodeGenerateConfiguration projectConfig={projectConfig} applicationId={applicationId} fetchMasters={fetchMasters} />}
    </Layout>
  );
};
export default Configuration;
