import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from 'src/routes';
import configureStore from 'src/redux/configureStore';
import 'src/index.scss';

let createHistory = require('history').createBrowserHistory;
const store = configureStore(undefined);
const _history = syncHistoryWithStore(createHistory(), store);

ReactDOM.render((
    <Provider store={store}>
        {routes(_history)}
    </Provider>
), document.getElementById('root'))