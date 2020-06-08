import { createReducer } from 'typesafe-actions';
import { AuthActionTypes, loginAction } from './actions';

export interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  error: any;
}

const INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

const reducer = createReducer<AuthState, AuthActionTypes>(
  INITIAL_STATE,
).handleAction(loginAction, (state) => {
  return {
    ...state,
    isLoggedIn: !state.isLoggedIn,
  };
});

export default reducer;
