import { fetchGetSalt, fetchLogin } from 'src/api';
import { hmacTime } from 'src/utils/hmacTime';
import { store } from 'src/index';

export interface ILoginState {
    isLogined: boolean,
    isLogining: boolean,
    isLoginError: boolean,
    isLoginWrong: boolean
}

const initialState: ILoginState = {
    isLogined: false,
    isLogining: false,
    isLoginError: false,
    isLoginWrong: false,
};

const LOGIN = 'LOAGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';
const LOGIN_WRONG = 'LOGIN_WRONG';

export interface IUserInfo {
    username: string,
    password: string
}

// 属于一个 promise action 而不是 函数 action
export async function login (params: IUserInfo) {
    
    store.dispatch({
        type: LOGIN,
    });

    const getSaltParams = {username: params.username};
    let getSaltResult = undefined;
    try{
       getSaltResult = await fetchGetSalt(getSaltParams);
    }catch (err) {
        return {
            type: LOGIN_ERROR,
            err,
        }
    }
    if (getSaltResult.data.code === '000001') {
        // let loginResult = undefined;
        const loginParams = { ...params, password: hmacTime(params.password, getSaltResult.data.data)};
        return {
            types: [LOGIN, LOGIN_SUCCESS, LOGIN_WRONG, LOGIN_ERROR],
            func: fetchLogin(loginParams),
        }
    } else {
        return {
            type: LOGIN_WRONG,
            title: 'wrong username or password'
        }
    }
}

export default function loginState (state = initialState, action:any) {
    switch( action.type ) {
        case LOGIN: {
            return {
                ...state,
                isLogined: false,
                isLoginError: false,
                isLogining: true,
                isLoginWrong: false
            };
        }
        case LOGIN_SUCCESS: {
            return {
                ...state,
                isLogined: true,
                isLoginError: false,
                isLogining: false
            };
        }
        case LOGIN_ERROR: {
            return {
                ...state,
                isLogined: false,
                isLoginError: true,
                isLogining: false
            };
        }
        case LOGIN_WRONG: {
            return {
                ...state,
                isLogined: false,
                isLoginEror: false,
                isLogining: false,
                isLoginWrong: true
            }
        }
        default : 
            return state;
    }
}