import React from 'react';
import { RecoilRoot } from 'recoil';
import { ToastProvider } from 'react-toast-notifications';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import store from './redux/store';
import Root from './config/Root';

const persistor = persistStore(store);

function MainApp() {
  return (
    <RecoilRoot>

      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastProvider>
            <Router>
              <Root />
            </Router>
          </ToastProvider>
        </PersistGate>
      </Provider>

    </RecoilRoot>
  );
}
function App() {
  return <MainApp />;
}

export default App;
