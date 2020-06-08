import React from 'react';
import { useDispatch } from 'react-redux';
import { loginAction } from '@store/auth';

const Button: React.FC = () => {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(loginAction());
  };
  return (
    <button type="button" onClick={handleClick}>
      Button
    </button>
  );
};

export default Button;
