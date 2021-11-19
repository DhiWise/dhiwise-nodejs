/* eslint-disable no-nested-ternary */
import React from 'react';
import { Helmet } from 'react-helmet';
import Layout from '../Shared/Layout';
import {
  BoxLayout,
} from '../../components';
import { MenuShortCut } from './MenuShortCut';

function Dashboard() {
  return (
    <>
      <Layout isSidebar>
        <Helmet>
          <meta name="viewport" content="width=1200, initial-scale=0, maximum-scale=0,user-scalable=0" />
        </Helmet>
        <BoxLayout variant="mainRight" className="flex">
          <div
            className="overflow-auto py-5 px-5 w-full"
          >
            <div className="flex">
              <div className="w-full">
                <div className="">
                  <MenuShortCut />
                </div>

              </div>
            </div>
          </div>
        </BoxLayout>
      </Layout>
    </>
  );
}
export default Dashboard;
