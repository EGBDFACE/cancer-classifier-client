// 自定义解决 history 方案，可以在组件中使用 push 操作等
// let createHistory = require('history').createBrowserHistory;

// export default createHistory();

/**
 * 将 React Router 与 Redux store 绑定， 获得一个增强的 history 对象
 * 将这个 history 对象传递给 React Router 中的 <Router> 组件作为 props
 * 给 React Router Redux 提供了观察路由变化并改变 store 的能力
 */
//import { browserHistory } from 'react-router' // not support in v4
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory';






