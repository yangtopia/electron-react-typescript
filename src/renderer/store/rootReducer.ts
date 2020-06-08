import { combineReducers } from 'redux';
import auth, { AuthState } from './auth/reducer';

export interface RootState {
  auth: AuthState;
}

const rootReducer = combineReducers<RootState>({
  auth,
});

export default rootReducer;
