import React from 'react';
import { useDispatch } from 'react-redux';
import { loginAction } from '@store/auth';
import styled from 'styled-components';

const StyledButton = styled.button`
  color: blue;
`;

const Button: React.FC = () => {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(loginAction());
  };
  return (
    <StyledButton type="button" onClick={handleClick}>
      Button
    </StyledButton>
  );
};

export default Button;
