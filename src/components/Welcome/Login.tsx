import React, { Component, Dispatch } from 'react';
import { connect } from 'react-redux';
// import { push } from 'react-router-redux';
import './Login.scss';
import { IStoreState } from 'src/redux/reducer';
import * as welcomeReducer from 'src/views/WelcomeRedux';
import * as loginReducer from 'src/components/Welcome/LoginRedux';

interface IProps {
    isDisplay: boolean;
    isLogining: boolean;
    isLoginWrong: boolean;
    loginDialog?: (value: boolean) => void;
    loginSubmit?: (params: loginReducer.IUserInfo) => void;
}
interface IStates extends loginReducer.IUserInfo{
    isShowWrongTip: boolean;
    inputWrongTipTitle: string;
    // isInputWrong: boolean;
    // inputWrongTip: string;
}

class Login extends Component<IProps, IStates> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowWrongTip: false,
            inputWrongTipTitle: '',
            // isInputWrong: false,
            // inputWrongTip: '',
        };
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleUserNameChange = this.handleUserNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
    }

    handleUserNameChange(e: any) {
        this.setState({
            // isInputWrong: false,
            isShowWrongTip: false,
            username: e.target.value
        });
    }
    handlePasswordChange(e: any) {
        this.setState({
            // isInputWrong: false,
            isShowWrongTip: false,
            password: e.target.value
        });
    }
    handleSubmit() {
        const { username, password } = this.state;
        if (username === '' || password === '') {
            this.setState({
                isShowWrongTip: true,
                // isInputWrong: true,
                inputWrongTipTitle: 'Please enter both your email and password.'
            });
        } else {
            this.setState({
                // isInputWrong: false
                isShowWrongTip: false,
            });
            const params: loginReducer.IUserInfo = {
                username,
                password
            };
            this.props.loginSubmit(params);
        }
    }
    handleCloseDialog () {
        this.props.loginDialog(false);
    }

    UNSAFE_componentWillReceiveProps(newProps: IProps) {
        const prevProps = this.props;
        if (newProps.isLoginWrong !== prevProps.isLoginWrong) {
            // console.log(newProps.isLoginWrong);
            this.setState({
                isShowWrongTip: newProps.isLoginWrong,
                inputWrongTipTitle: newProps.isLoginWrong ? 'wrong username or password' : this.state.inputWrongTipTitle
            })
        }
    }

    render() {
        const { isDisplay, isLogining, isLoginWrong } = this.props;
        const { username, password, isShowWrongTip, inputWrongTipTitle } = this.state;
        const titleParams = 'Log in to Cancer Classifier';
        const isRendering =  !isDisplay ? { display: 'none'} : null;
        const isUserNameInputing = username!=='';
        const isPasswordInputing = password!=='';
        return (
            <div className='login' style={isRendering}>
                <div className='login_background' />
                <div className='login_dialog'>
                    <div className='login_dialog_header'>
                        <div className='login_dialog__close' onClick={this.handleCloseDialog}>
                            <svg width="22px" height="23px" viewBox="0 0 22 23">
                                <g stroke="none" strokeWidth="1" fill="none" 
                                    fillRule="evenodd"  strokeLinecap="square">
                                    <g transform="translate(-1047.000000, -266.000000)" 
                                        stroke="#6B7790" strokeWidth="2">
                                        <g transform="translate(500.000000, 235.500000)">
                                            <g transform="translate(548.000000, 32.000000)">
                                                <path d="M0.625,19.375 L19.375,0.625"></path>
                                                <path d="M0.625,0.625 L19.375,19.375"></path>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>
                    <div className='login_dialog__body'>
                        <div className='login_dialog__body_title'>{titleParams}</div>
                        <div className='login_dialog__body_username_label'>USER NAME</div>
                        <input className={isUserNameInputing ? 
                                    'login_dialog__body_input_active' : 
                                    'login_dialog__body_username_input'} 
                            type='text' 
                            placeholder='Enter user name'
                            value = { username }
                            onChange = {this.handleUserNameChange}
                            />
                        <div className='login_dialog__body_password_label'>PASSWORD</div>
                        <input className= {isPasswordInputing ?
                                    'login_dialog__body_input_active' :
                                    'login_dialog__body_password_input' 
                                    }
                            type='password' 
                            placeholder='Enter password'
                            value = { password }
                            onChange = {this.handlePasswordChange}
                            />
                        <div className='login_dialog__body_wrong_tip'
                            style={!isShowWrongTip ? {display: 'none'} : null}
                            >{inputWrongTipTitle}</div>
                        <button className='login_dialog__body_submit'
                            onClick={this.handleSubmit}
                            >LOG IN</button>
                    </div>
                    <div className='login_dialog_footer'>
                        <span>Don't hava an account? </span>
                        <a href='mailto:makehust@gmail.com'>contact MaKe</a>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps (state: IStoreState) {
    return {
        isDisplay: state.welcome.displayState.isLoginDialog,
        isLogining: state.welcome.login.isLogining,
        isLoginWrong: state.welcome.login.isLoginWrong
    }
}
function mapDispatchToProps (dispatch: Dispatch<any>) {
    return {
        // goto: (value: string) => dispatch(push(value)),
        loginDialog: (value: boolean) => dispatch(welcomeReducer.actionCreator(welcomeReducer.LOGIN_DIALOG, value)),
        // 为什么这里 loginReducer.login(value) 会是一个 promise
        // 因为 login 是一个 async 函数 ，async 函数的返回值就是一个 promise
        loginSubmit: (value: loginReducer.IUserInfo) => dispatch(loginReducer.login(value)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);