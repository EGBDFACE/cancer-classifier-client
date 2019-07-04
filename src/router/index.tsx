import * as React from 'react';
import Loadable from 'react-loadable';
import '@/css/base.scss';
import Home from '../pages/Home';
// import RunModel from '../pages/RunModel';
// import { Route, Router } from 'react-router-dom';
import { Route, BrowserRouter as Router} from 'react-router-dom';
import history from './history';

// const SignIn = Loadable({
//     loader: () => import('../pages/SignIn'),
//     loading: () =>  <div className='loadingPage'><div className='sk-rotating-plane'></div></div>
// });
// const SignUp = Loadable({
//     loader: () => import('../pages/SignUp'),
//     loading: () => <div className='loadingPage'><div className='sk-rotating-plane'></div></div>
// });
const RunModel = Loadable({
    loader: () => import('../pages/RunModel'),
    loading: () => <div className='loadingPage'><div className='sk-rotating-plane'></div></div>
});

export default (
    // <Router history={history}>
    <Router basename='/cancer-classifier'>
        <div>
            <Route exact path="/" component={Home}/>
            <Route path="/runModel" component={RunModel}/>
        </div>
    </Router>
);