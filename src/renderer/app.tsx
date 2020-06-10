import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

import LayoutContainer from '@containers/LayoutContainer';
import store from './store';
import './style/global.scss';

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

const render = (Component: () => JSX.Element) => {
  ReactDom.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    mainElement,
  );
};

render(LayoutContainer);
