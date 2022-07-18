import React from 'react';
import { Helmet } from 'react-helmet';
import Sidebar from './Sidebar';
import { LanguageHeader } from './LanguageHeader';

const Layout = ({
  isSidebar, children, hideHeader, bodyClass, wrapClass, ...props
}) => (
  <div className={`flex flex-col h-screen ${wrapClass}`}>
    <Helmet>
      <title>DhiWise</title>
      <meta name="description" content="Our mission is to build the most intelligent programming platform in the world" />
    </Helmet>
    <>

      {!hideHeader && <LanguageHeader />}
    </>

    <div className={`flex bg-body flex-grow overflow-auto ${bodyClass}`}>
      {isSidebar
          // eslint-disable-next-line react/jsx-props-no-spreading
          && <Sidebar {...props} />}
      {children}
    </div>
  </div>
);
export default Layout;
