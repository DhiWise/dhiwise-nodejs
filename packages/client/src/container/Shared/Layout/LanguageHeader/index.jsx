import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icons } from '@dhiwise/icons';
import { useHistory } from 'react-router';
import { languageHeaderCss } from './languageHeaderCss';
import {
  Heading, MenuBox, LinkTag, ConfirmationAlert,
} from '../../../../components';
import { APPLICATION_DASHBOARD } from '../../../../constant/Project/applicationStep';
import { BuildAppDropdown } from '../../BuildApp/BuildAppDropdown';
import { useBoolean } from '../../../../components/hooks';
import { destroyApplication } from '../../../../api/project';
import { resetBuildState } from '../../../../redux/reducers/buildCode';

export const LanguageHeader = () => {
  const currentApplicationId = useSelector((state) => state.projects.currentApplicationId);
  const currentProjectDetail = useSelector((state) => state.projects.currentProjectDetail);
  const applicationCode = useSelector((state) => state.projects.currentApplicationCode);
  const history = useHistory();
  const dispatch = useDispatch();
  const currentApplicationName = currentProjectDetail?.applicationList?.find((application) => application?._id === currentApplicationId)?.name;
  const [isAlert, setAlert, hideAlert] = useBoolean(false);
  const destroyApp = () => {
    destroyApplication({ id: currentApplicationId, isHardDelete: true }).then(() => {
      dispatch(resetBuildState());
      history.push('/', { isNewApp: true });
      hideAlert();
    });
  };

  return (
    <>
      <div className={`header ${languageHeaderCss.headWrap}`}>
        <div className="w-4/12 flex">
          <MenuBox
            title="Create new app"
            isDropdown={false}
            isIcon
            onClick={setAlert}
            icon={<Icons.App />}
          />
          <hr className="bg-gray-100 h-auto my-2 m-auto mx-2 w-0.5" />
          <div className="flex items-center ml-2 w-8/12">
            <Heading variant="h6" className="truncate">
              <LinkTag whiteText className="hover:no-underline" link={APPLICATION_DASHBOARD[applicationCode]}>
                {currentApplicationName || ''}
                {' '}
              </LinkTag>
            </Heading>
          </div>
        </div>
        <div className="w-8/12 h-12 flex justify-end">

          <BuildAppDropdown />
        </div>
        <ConfirmationAlert
          description="To create a new application, your current application data will be deleted."
          handleSubmit={destroyApp}
          isOpen={isAlert}
          handleClose={hideAlert}
        />
      </div>

    </>
  );
};
