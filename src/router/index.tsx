import * as React from 'react';
import Loadable from 'react-loadable';
// import Home from '../pages/Home';
// import RunModel from '../pages/RunModel';
import { Route, Router } from 'react-router-dom';
import LoadingMask from '../components/LoadingMask';
import history from './history';
import SignIn from '../pages/SignIn';
import './style.scss';

const Home = Loadable({
    loader: () => import('../pages/Home'),
    loading: () => <LoadingMask />
});
const RunModel = Loadable({
    loader: () => import('../pages/RunModel'),
    loading: () => <LoadingMask />
});

export default (
    <Router history={history}>
        <div className='router-content'>
            <Route exact path="/" component={SignIn}/>
            <Route path='/home' component={Home} />
            <Route path="/runModel" component={RunModel}/>
        </div>
    </Router>
);