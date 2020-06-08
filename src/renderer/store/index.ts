import { applyMiddleware, createStore, Store, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import rootReducer, { RootState } from './rootReducer';

const configureStore = (
  initialState?: RootState,
): Store<RootState | undefined> => {
  const middlewares: any[] = [thunkMiddleware];
  const enhancer =
    process.env.NODE_ENV !== 'production'
      ? compose(applyMiddleware(...middlewares))
      : composeWithDevTools({})(applyMiddleware(...middlewares));
  return createStore(rootReducer, initialState, enhancer);
};

const store = configureStore();

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept(() => {
    store.replaceReducer(require('./rootReducer').default);
  });
}

export default store;
