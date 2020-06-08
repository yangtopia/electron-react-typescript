import React from 'react';
import ReactDom from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Button from '@components/Button';

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

const App = () => {
  return (
    <>
      <h1>Hi from a react app!</h1>
      <Button />
    </>
  );
};

const render = (Component: () => JSX.Element) => {
  ReactDom.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    mainElement,
  );
};

render(App);
