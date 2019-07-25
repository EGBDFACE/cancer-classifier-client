import * as React from 'react';
import './style.scss';
import {  fetchGetSalt, fetchLogin } from 'src/api';
import LoadingMask from 'src/components/LoadingMask';
import Footer from 'src/components/Footer';

const bcrypt = require('bcryptjs');
const jsSHA = require('jssha');

interface IProps {
    location: any
}
interface IStates {
    errorFlag: boolean,
    password: string,
    signInFlag: boolean,
    username: string,
}

export default class SignIn extends React.Component <IProps, IStates> {
    constructor (props: IProps) {
        super(props);
        this.state = {
            errorFlag: false,
            password: '',
            signInFlag: false,
            username: ''
        }
        this.userNameInput = this.userNameInput.bind(this);
        this.passwordInput = this.passwordInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleKeyEnter = this.handleKeyEnter.bind(this);
    }
    public userNameInput(e: any){
        this.setState ({
            errorFlag: false,
            username: e.target.value
        })
    }
    public passwordInput(e: any){
        this.setState ({
            errorFlag: false,
            password: e.target.value
        })
    }
    public handleKeyEnter(e: any){
        if(e.keyCode === 13){
            this.handleSubmit();
        }
    }
    public handleSubmit(){
        this.setState({
            signInFlag: true
        })
        const { password, username } = this.state;
        if(username && password){
            fetchGetSalt({username: username})
            .then (res => {
                if(res.data.code === '000001'){
                    // success
                    const salt:string = res.data.data;
                    const nowTime: string = Math.floor(new Date().getTime()/60000).toString();
                    const passwordWithSalt: string = bcrypt.hashSync(password,salt);
                    
                    const shaObj = new jsSHA('SHA-512','TEXT');
                    shaObj.update(passwordWithSalt);
                    shaObj.update(nowTime);
                    const passwordWithSaltTime: string = shaObj.getHash('HEX');

                    const userInfo = {
                        username: username,
                        password: passwordWithSaltTime
                    };
                    
                    fetchLogin(userInfo)
                    .then ( res => {
                        if (res.data.code === '000001'){
                            // console.log(res);
                            localStorage.setItem('token',res.data.data);
                            localStorage.setItem('token_exp', new Date().getTime().toString());
                            location.pathname = '/home';
                        }else{
                            alert('wrong username or password');
                            this.setState({
                                signInFlag: false
                            });
                        }
                    })
                    .catch (err => {
                        console.error(err);
                        this.setState({
                            signInFlag: false
                        })
                    })

                }else if(res.data.code === '000002'){
                    // no such user
                    alert('no such user');
                    this.setState({
                        signInFlag: false
                    })
                }else{
                    // database error
                    this.setState({
                        signInFlag: false
                    })
                }
            })
            .catch( err => {
                console.error(err);
                this.setState({
                    signInFlag: false
                })
            })
        }else{
            this.setState({
                errorFlag: true,
                signInFlag: false
            })
        }
    }
    public render() {
        if(this.state.signInFlag){
            return(
                <LoadingMask />
            )
        }
        const { errorFlag, password, username } = this.state;
        const placeHolder = {
            // username: '用户名',
            // password: '密码'
            username: '',
            password: ''
        };
        const placeHolderError = {
            username: '请输入用户名',
            password: '请输入密码'
        };
        return (
            <div className='sign-in-page'>
                <div className='sign-in__header'>Please use the invitation info to login</div>
                <div className='sign-in__username'>
                    <div className='username-label'>User Name</div>
                    <input className={errorFlag?'username-input input-error':'username-input'}
                        type='text' 
                        value={username} 
                        onChange={this.userNameInput}
                        placeholder={errorFlag?placeHolderError.username:placeHolder.username}
                    />
                </div>
                <div className='sign-in__password'>
                    <div className='password-label'>Password</div>
                    <input className={errorFlag?'password-input input-error':'password-input'} 
                        type='password'
                        value={password}
                        onChange={this.passwordInput}
                        onKeyUp={this.handleKeyEnter}
                        placeholder={errorFlag?placeHolderError.password:placeHolder.password}
                    />
                </div>
                <div className='sign-in__submit'
                    onClick={this.handleSubmit}
                >Sign In</div>
                <Footer location={this.props.location} />
            </div>
        )
    }
}