import { fetchGetSalt, fetchLogin } from 'src/api';
import { hmacTime } from 'src/utils/hmacTime';

const initialState = {
    isLogined: false,
    isLogining: false,
    isLoginError: false,
    isLoginWrong: false,
};

const LOGIN = 'LOAGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';
const LOGIN_WRONG = 'LOGIN_WRONG';

interface IUserInfo {
    username: string,
    password: string
}

export async function login (params: IUserInfo) {
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
        // try {
        //     loginResult = await fetchLogin(loginParams);
        // } catch (err) {
        //     return {
        //         type: LOGIN_ERROR,
        //         err,
        //     }
        // }
        // if (loginResult.data.code === '000001') {
        //     localStorage.setItem('token', loginResult.data.data);
        //     localStorage.setItem('token_exp', new Date().getTime().toString());
        //     return {
        //         type: LOGIN_SUCCESS,
        //     }
        // } else {
        //     return {
        //         type: LOGIN_ERROR,
        //         err: 'wrong username or password'
        //     }
        // }
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