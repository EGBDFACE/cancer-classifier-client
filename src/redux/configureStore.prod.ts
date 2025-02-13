// 生成 Redux store
import { applyMiddleware, createStore, combineReducers, compose, } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import ThunkMiddleware from 'redux-thunk';
import fetchMiddleware from 'src/utils/fetchMiddleware'; 
import rootReducer from 'src/redux/reducer';   

let createHistory = require('history').createBrowserHistory;

/**
 * @function finalCreateStore
 * 不直接使用 createStore ，利用 compose 方法对 createStore 增强
 * 
 * 使用 middleware，可以让 Redux 解析各种类型的 action（方法、promise 等）
 * 
 * React Router 是一个独立的路由处理库，routerMiddleware 将 React Router 
 * 中维持的状态暴露给 Redux 应用，即在 Redux 应用中修改 React Router 的状态
 * 之后就可以在任何可以拿到 store.dispatch 的环境中通过 
 * store.dispatch(push('routerPath')) 修改路由
 * 
 * fetchMiddle 是自己写的中间件，当发送特定类型的 action 时就会被使用，
 * 用于网络请求的分发与响应数据的处理
 * 
 * thunk middle ：当 action 为函数时不调用 next 或 dispatch，而是返回 action
 * 的调用
 */

const finalCreateStore = compose(
    applyMiddleware( ThunkMiddleware, fetchMiddleware, routerMiddleware(createHistory())),
)(createStore);

// rootReducer 中已经汇总整个应用的 reducer，
// routerReducer 帮助实现路由状态和 Redux store 的统一
const reducer = combineReducers(Object.assign({}, rootReducer, {
    routing: routerReducer,
}));

export function configureStore (initialState: any) {
    const store = finalCreateStore( reducer, initialState);

    return store;
}