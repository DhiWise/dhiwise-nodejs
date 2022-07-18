import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Heading, Popup, CardView,
} from '../../../components';
import { useBoolean } from '../../../components/hooks';
import { BUILD_ARCHITECTURE_CODE } from '../../../constant/buildProcessConstant';
import { setBuildCodeState } from '../../../redux/reducers/buildCode';
import { codeGenerator } from '../../../redux/thunks/buildCode';
import { BuildVSCodePopup } from '../../Shared/BuildApp/BuildAppDropdown';

const BuildOptions = [
  {
    name: 'MVC',
    id: BUILD_ARCHITECTURE_CODE.MVC,
  },
  {
    name: 'Clean Code',
    id: BUILD_ARCHITECTURE_CODE.CC,
  },
];
export const BuildCodeStructure = ({ openBuildRef }) => {
  const [isOpen, handelOpen, handelClose] = useBoolean(false);
  const applicationId = useSelector((state) => state.projects.currentApplicationId);

  const dispatch = useDispatch();
  const buildProject = (type) => {
    dispatch(setBuildCodeState({ buildArchitecture: type }));

    dispatch(codeGenerator({ applicationId, projectType: type }));

    handelClose();
  };
  React.useImperativeHandle(openBuildRef, () => ({ handelOpen }));
  return (
    <>
      <Popup closeModal={handelClose} size="w-6/12 xxl:w-4/12" isOpen={isOpen} title="Code generator architecture">
        <div className="grid grid-cols-2 gap-5">
          {BuildOptions.map((options) => (
            <CardView
              key={options.id}
              onClick={() => {
                buildProject(options.id);
              }}
            >
              <Heading variant="h4">{options.name}</Heading>
            </CardView>
          ))}
        </div>
      </Popup>
      <BuildVSCodePopup />
    </>
  );
};
