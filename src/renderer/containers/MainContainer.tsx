import React from 'react';
import { useSelector } from 'react-redux';

import Button from '@components/Button';
import { selectIsLoggedIn } from '@store/auth';

const MainContainer = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return (
    <>
      <h1>Hi from a react app!! {`${isLoggedIn}`}</h1>
      <h1>{process.env.ENV}</h1>
      <Button />
    </>
  );
};

export default MainContainer;
