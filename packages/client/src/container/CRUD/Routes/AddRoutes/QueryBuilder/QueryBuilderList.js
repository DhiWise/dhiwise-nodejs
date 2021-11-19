import React from 'react';
import { Menu } from 'react-pro-sidebar';
import { useFormContext } from 'react-hook-form';
import { SidebarList } from '../../../../Shared/Layout/Sidebar/SubSidebar';
import { SidebarMenuList } from '../../../../../components';
import { useQueryResponse } from './ResponseProvider';
import { useRoute } from '../../RouteProvider';

export const QueryBuilderList = ({ addModalRef }) => {
  const methods = useFormContext();
  const { editRouteData } = useRoute();

  const {
    watch,
  } = methods;

  const { currentResponseId, setResponseId } = useQueryResponse();
  React.useEffect(() => {
    setResponseId(0);
  }, []);

  return (

    <SidebarList addClick={() => { addModalRef.current?.showResponseModal(); }} isAddButton style={{ width: '16rem', position: 'inherit' }} title="Response" tooltip="Add response">
      <Menu iconShape="square" className="p-2">
        <SidebarMenuList
          mainMenuList={watch('queryBuilder') || editRouteData.queryBuilder?.map((query, index) => ({ filterJson: { id: Math.random(), type: 'group' }, ...query, _id: index }))}
          titleKey="outputVariable"
          onClick={(id) => { setResponseId(id); }}
          initialSelectedId={currentResponseId}
        />
      </Menu>
    </SidebarList>

  );
};
