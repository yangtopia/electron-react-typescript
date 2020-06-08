import { createSelector } from 'reselect';
import { RootState } from '../rootReducer';

export const authSelector = (state: RootState) => state.auth;

export const selectIsLoggedIn = createSelector(
  [authSelector],
  (authState) => authState.isLoggedIn,
);
