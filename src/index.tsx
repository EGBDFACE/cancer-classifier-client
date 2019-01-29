import * as React from 'react';
import * as ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import route from './router/router';
import store from './store/store';

ReactDom.render(
    <Provider store= {store}>
        {route}
    </Provider>,
    document.getElementById('root')
)