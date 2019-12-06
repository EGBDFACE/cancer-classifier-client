function isPromise (val:any) {
    return val && typeof val.then === 'function';
}
// action 为网络请求时，处理的中间件
const fetchMiddleware = (store: any) => (next: any) => (action: any) => {

    if (isPromise(action)) {
        // 返回 store.dispatch 之后就可以在 action 中返回正常 action 重新发起 action
        // ？？？
        // 应该是此异步 action resolve 之后返回的正常的 action 为参数执行了这里的 store.dispatch

        // 这里其实是自动将 action.then 的返回值执行了 store.dispatch
        return action.then(store.dispatch);
        // .then( (result: any) => {
        //     return result;
        // })
        // .catch( (err: any) => {
        //     return {
        //         type: 'PROMISE_ERROR',
        //         payload: err
        //     }
        // })
    }

    if (!isPromise(action.func) || !Array.isArray(action.types)) {
        return next(action);
    }

    // const [ LOADING, SUCCESS, WRONG, ERROR ] = action.types;

    // next({
    //     type: LOADING,
    //     // loading: true,
    //     // ...action,
    // });

    // action.func
    // .then( (result:any) => {
    //     if (result.data.code === '000001') {
    //         next({
    //             type: SUCCESS,
    //             payload: result.data.data
    //         })
    //     } else {
    //         next({
    //             type: WRONG,
    //             payload: result.data.msg
    //         })
    //     }
    // })
    // .catch( (err:any) => {
    //     next({
    //         type: ERROR,
    //         // loading: false,
    //         error: err,
    //     });
    // });
}

export default fetchMiddleware;