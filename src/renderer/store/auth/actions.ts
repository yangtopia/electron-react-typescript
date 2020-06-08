import { createAction } from 'typesafe-actions';

export const loginAction = createAction('auth/LOGIN')<void>();

export type AuthActionTypes = ReturnType<typeof loginAction>;
