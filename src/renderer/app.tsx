import React from 'react';
import ReactDom from 'react-dom';
import { Provider, useSelector } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

import Button from '@components/Button';

import store from './store';
import { selectIsLoggedIn } from './store/auth';

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

const App = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return (
    <>
      <h1>Hi from a react app!! {`${isLoggedIn}`}</h1>
      <Button />
    </>
  );
};

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

render(App);
