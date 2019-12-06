import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from 'src/routes';
import configureStore from 'src/redux/configureStore';
import 'src/index.scss';
import DevTools from 'src/redux/devTools';

let createHistory = require('history').createBrowserHistory;
export const store = configureStore();
const _history = syncHistoryWithStore(createHistory(), store);

ReactDOM.render((
    <Provider store={store}>
        {routes(_history)}
        <DevTools />
    </Provider>
), document.getElementById('root'))