import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import logoLoader from '../assets/images/gif/logo-loader.gif';

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <img width="200" height="200" src={logoLoader} alt="loader" />
    </div>
  );
}

const BuildProcess = lazy(() => import('../container/common'));
const TechnologySetStep = lazy(() => import('../container/Shared/TechnologySetStep'));

const PlatFormConfiguration = lazy(() => import('../container/CRUD/Configuration'));
const Modal = lazy(() => import('../container/CRUD/Modal'));
const ModelRoleAccess = lazy(() => import('../container/RoleAccess'));
const Dashboard = lazy(() => import('../container/Dashboard'));
const ModelPermission = lazy(() => import('../container/CRUD/Permission'));
const NodeConstant = lazy(() => import('../container/Constant'));
const Policy = lazy(() => import('../container/Policy'));
const Routes = lazy(() => import('../container/CRUD/Routes'));
const NodeEnvironment = lazy(() => import('../container/EnvironmentVariable'));
const Configuration = lazy(() => import('../container/Configuration'));

const App = () => {
  document.getElementsByTagName('html')[0].classList.add('theme-black');

  return (
    <Suspense fallback={<Loader />}>
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

        <Route path="*" component={() => <div>Not Found</div>} />
      </Switch>
    </Suspense>
  );
};

export default App;