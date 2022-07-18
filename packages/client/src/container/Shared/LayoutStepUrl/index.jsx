import React from 'react';
import {
  ProSidebar, Menu,
} from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import '../../../assets/css/sidebar.css';
import ScrollArea from 'react-scrollbar';
import { ToggleBox } from '../../../components';
import { useBoolean } from '../../../components/hooks';
import { encryptStorage } from '../../../utils/localStorage';
import { SidebarCss } from '../Layout/Sidebar/sidebarCss';
import { BigToggleLayout, SmallToggleLayout } from './SidebarLayout';
import { stepSidebarData } from './stepSidebarData';

const LayoutStepUrl = ({
  children, moduleName = '', toggle = true,
  isOpenBigLayout = true,
}) => {
  const [tabToggle, , , handelTabToggle] = useBoolean(encryptStorage.get('sidebarToggle') ?? isOpenBigLayout);
  React.useEffect(() => {
    // to maintain global all tab toggle when false set
    ((isOpenBigLayout && !tabToggle) || (!isOpenBigLayout && tabToggle)) ? encryptStorage.set('sidebarToggle', tabToggle) : encryptStorage.remove('sidebarToggle');
  }, [tabToggle]);
  return (
    <>
      <div className="flex flex-grow h-0">
        <div className={`border-r border-gray-200 layoutStep relative z-10000 ${!tabToggle ? 'bg-gray-200 w-12' : 'bg-gray-300 xxl:w-1.5/12 w-2/12 '}`}>
          <ProSidebar className={`${SidebarCss.wrap} sm:w-full`}>
            <ScrollArea
              speed={0.8}
              className="area h-full"
              contentClassName="content"
              smoothScrolling
            >
              {tabToggle ? (
                <Menu iconShape="square">
                  {stepSidebarData[moduleName].map((d) => (

                    <BigToggleLayout
                      key={d.title}
                      linkSet={d.linkSet}
                      link={d.link}
                      title={d.title}
                      description={d.description}
                    />

                  ))}
                </Menu>
              ) : stepSidebarData[moduleName].map((d) => (

                <SmallToggleLayout
                  linkSet={d.linkSet}
                  link={d.link}
                  tooltipID={d.tooltipID}
                  iconActive={d.iconActive}
                  icon={d.icon}
                  tooltip={d.tooltip}
                  key={d.tooltipID}
                />
              ))}
            </ScrollArea>
          </ProSidebar>
        </div>
        <div
          className={`relative ${!tabToggle ? 'smallToggle' : 'xxl:w-10.5/12 w-10/12 '} flex flex-col`}
        >
          {toggle && <ToggleBox onClick={handelTabToggle} isSidebar={!tabToggle} />}
          {children}
        </div>
      </div>

    </>
  );
};
export default LayoutStepUrl;
