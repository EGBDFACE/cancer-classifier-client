import React from 'react';
import Loadable from 'react-loadable';
import { Route, Router, Switch } from 'react-router-dom';
import LoadingMask from 'src/components/shared/Mask/LoadingMask';

const Welcome = Loadable({
    loader: () => import('src/views/Welcome.tsx'),
    loading: () => <LoadingMask />
});
const RunModel = Loadable({
    loader: () => import('src/views/RunModel.tsx'),
    loading: () => <LoadingMask />
})

// export default (
//     <Router history={history}>
//         <div className='router-content'>
//             <Route exact path='/' component={Welcome} />
//             <Route path='/model' component={RunModel} />
//         </div>
//     </Router>
// )

// 传入将 React Router 与 Redux store 绑定之后的增强 history 对象
const routes = (_history:any) => (
    <Router history={_history} >
        <Switch>
            <Route exact path='/' component={Welcome} />
            <Route path='/model' component={RunModel} />
        </Switch>
    </Router>
);

export default routes;