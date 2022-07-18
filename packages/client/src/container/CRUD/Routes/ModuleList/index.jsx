import React from 'react';
import { sortBy, isEmpty, concat } from 'lodash';
import { Menu, MenuItem } from 'react-pro-sidebar';
import { useSelector } from 'react-redux';
import { SidebarList } from '../../../Shared/Layout/Sidebar/SubSidebar';
import { SidebarMenuListCss } from '../../../../components/SidebarMenuList/sidebarMenuListCss';
import { useAddToggle } from '../AddToggleProvider';
import { useRoute } from '../RouteProvider';

export const ModuleList = () => {
  const modelList = useSelector((state) => state.models.modelList);
  const { hideAddModal, addModal } = useAddToggle();
  const { dispatch, selectedModelId, generalizedModel } = useRoute();

  React.useEffect(() => {
    const randomObject = { name: 'General', _id: Math.random().toString() };

    isEmpty(generalizedModel) && dispatch({ type: 'SetGeneralizedModel', payload: randomObject });

    isEmpty(modelList) ? dispatch({ type: 'SetSelectionModel', payload: generalizedModel }) : dispatch({ type: 'SetSelectionModel', payload: modelList?.[0] });
  }, [modelList]);

  return (
    <SidebarList
      style={{ top: '0' }}
      isAddButton={false}
      title="Models"
    >
      <Menu iconShape="square" className="p-2">
        {concat(sortBy(modelList, ['name']), [generalizedModel])?.map((model) => (
          <MenuItem
            key={`model${model._id}`}
            onClick={() => {
              if (addModal)hideAddModal();
              dispatch({ type: 'SetSelectionModel', payload: model });
            }}
            className={`${SidebarMenuListCss.menuList} ${
              selectedModelId === model._id && SidebarMenuListCss.menuActive
            }`}
          >
            <span
              className={`text-primary-text text-sm ${
                selectedModelId === model._id && 'text-defaultWhite'
              }`}
            >
              {model?.name}
            </span>
          </MenuItem>
        ))}
      </Menu>
    </SidebarList>
  );
};
