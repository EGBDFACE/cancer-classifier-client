function isPromise (val:any) {
    return val && typeof val.then === 'function';
}
// action 为网络请求时，处理的中间件
const fetchMiddleware = (store:any) => (next:any) => (action:any) => {
    if (!isPromise(action.func) || !Array.isArray(action.types)) {
        return next(action);
    }

    const [ LOADING, SUCCESS, WRONG, ERROR ] = action.types;

    next({
        type: LOADING,
        // loading: true,
        // ...action,
    });

    action.func
    .then( (result:any) => {
        if (result.data.code === '000001') {
            next({
                type: SUCCESS,
                payload: result.data.data
            })
        } else {
            next({
                type: WRONG,
                payload: result.data.msg
            })
        }
    })
    .catch( (err:any) => {
        next({
            type: ERROR,
            // loading: false,
            error: err,
        });
    });
}

export default fetchMiddleware;