import React from 'react';
import Loadable from 'react-loadable';
import { Route, Router } from 'react-router-dom';
import history from './history';
import LoadingMask from 'src/components/shared/Mask/LoadingMask';

const Welcome = Loadable({
    loader: () => import('src/views/Welcome.tsx'),
    loading: () => <LoadingMask />
});
const RunModel = Loadable({
    loader: () => import('src/views/RunModel.tsx'),
    loading: () => <LoadingMask />
})

export default (
    <Router history={history}>
        <div className='router-content'>
            <Route exact path='/' component={Welcome} />
            <Route path='/model' component={RunModel} />
        </div>
    </Router>
)