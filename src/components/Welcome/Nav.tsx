import React, { Component } from 'react';
import './Nav.scss';

interface IProps {
    isLogin: boolean;
    isTop: boolean;
}
interface IStates {}
export default class WelcomeNav extends Component<IProps, IStates> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const prefix = 'Welcome';
        return (
            <nav className={prefix+'_main_header'}>
                <span>CANCER CLASSIFIER</span>
                <div className={prefix+'_mian_header__menu'}>
                    <span>RUN CLASSIFICATION</span>
                    <span>LOGIN</span>
                </div>
            </nav>
        )
    }
}