import React from 'react';
import {
  Route, Switch,
} from 'react-router-dom';
import LazyLoader from './LazyLoader';

const BuildProcess = LazyLoader({ loader: () => import('../container/common') });
const TechnologySetStep = LazyLoader({ loader: () => import('../container/Shared/TechnologySetStep') });

const PlatFormConfiguration = LazyLoader({ loader: () => import('../container/CRUD/Configuration') });
const Modal = LazyLoader({ loader: () => import('../container/CRUD/Modal') });
const ModelRoleAccess = LazyLoader({ loader: () => import('../container/RoleAccess') });
const Dashboard = LazyLoader({ loader: () => import('../container/Dashboard') });
const ModelPermission = LazyLoader({ loader: () => import('../container/CRUD/Permission') });
const NodeConstant = LazyLoader({ loader: () => import('../container/Constant') });
const Policy = LazyLoader({ loader: () => import('../container/Policy') });
const Routes = LazyLoader({ loader: () => import('../container/CRUD/Routes') });

const NodeEnvironment = LazyLoader({ loader: () => import('../container/EnvironmentVariable') });
const Configuration = LazyLoader({ loader: () => import('../container/Configuration') });

const App = () => {
  document.getElementsByTagName('html')[0].classList.add('theme-black');

  return (
    <>
      <Switch>
        <Route path="/" component={TechnologySetStep} exact />

        {/* project & application */}
        <Route path="/technology-step" component={TechnologySetStep} />

        {/* Nodejs */}
        {/* CRUD */}
        <Route path="/node/crud/platform" component={PlatFormConfiguration} />
        <Route path="/node/crud/model" component={Modal} />
        <Route path="/node/crud/permission" component={ModelPermission} />
        <Route path="/node/crud/routes" component={Routes} />

        <Route path="/node/dashboard" component={Dashboard} />
        <Route path="/node/role-access" component={ModelRoleAccess} />
        <Route path="/node/constant" component={NodeConstant} />
        <Route path="/node/middleware" component={Policy} />

        <Route path="/node/environment-variable" component={NodeEnvironment} />
        <Route path="/node/configuration" component={Configuration} />

        <Route path="/build-app" component={BuildProcess} />

        <Route path="*" component={() => (<div>Not Found</div>)} />

      </Switch>
    </>
  );
};
export default App;
