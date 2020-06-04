import React from 'react';
import ReactDom from 'react-dom';

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

ReactDom.render(<App />, mainElement);
