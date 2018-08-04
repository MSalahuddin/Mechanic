import rootReducer from './index'
import {createStore, applyMiddleware, compose} from 'redux'
import {persistStore, persistReducer} from 'redux-persist'
import thunk from 'redux-thunk'
import {AsyncStorage} from 'react-native'
import promise from 'redux-promise-middleware'
//import logger from 'redux-logger'

const enhancer = compose(
    applyMiddleware(thunk, promise())
);

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

//let store = createStore(rootReducer, enhancer);
let store = createStore(persistedReducer, enhancer);

//store.subscribe(() =>
//    store.getState()
//);

let persistor = persistStore(store);
export { store, persistor };