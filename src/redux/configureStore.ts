import { applyMiddleware, createStore, combineReducers, compose, } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import ThunkMiddleware from 'redux-thunk';
import fetchMiddleware from 'src/utils/fetchMiddleware';
import rootReducer from './reducer';

let createHistory = require('history').createBrowserHistory;

const finalCreateStore = compose(
    applyMiddleware(ThunkMiddleware, fetchMiddleware, routerMiddleware(createHistory()))
)(createStore);

const reducer = combineReducers(Object.assign({}, rootReducer, {
    routing: routerReducer,
}));

export default function configureStore (initialState: any) {
    const store = finalCreateStore( reducer, initialState);

    return store;
}