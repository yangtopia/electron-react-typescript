import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { selectIsLoggedIn } from '@store/auth';
import BabylonContainer from './BabylonContainer';
import ThreeContainer from './ThreeContainer';

const Wrap = styled.div`
  position: relative;
  display: flex;
  height: 100vh;
`;

const MainContainer = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return (
    <Wrap>
      <BabylonContainer />
      <ThreeContainer />
    </Wrap>
  );
};

export default MainContainer;
