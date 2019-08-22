import * as React from 'react';
import Loadable from 'react-loadable';
// import { Route, Router } from 'react-router-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import LoadingMask from 'src/components/LoadingMask';
import history from './history';
import SignIn from 'src/pages/SignIn';
import './style.scss';

const Home = Loadable({
    loader: () => import('src/pages/Home'),
    loading: () => <LoadingMask />
});
const RunModel = Loadable({
    loader: () => import('src/pages/RunModel'),
    loading: () => <LoadingMask />
});

export default (
    // <Router history={history}>
    <Router basename='/cancer-classifier'>
        <div className='router-content'>
            <Route exact path="/" component={SignIn}/>
            <Route path='/home' component={Home} />
            <Route path="/runModel" component={RunModel}/>
            {/* <Route path='/' exact component={RunModel} /> */}
        </div>
    </Router>
);