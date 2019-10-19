import React, { Component } from 'react';
import './Nav.scss';

interface IProps {
    isLogin: boolean;
    isTop: boolean;
    prefix: string;
}
interface IStates {}
export default class WelcomeNav extends Component<IProps, IStates> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { isLogin, isTop, prefix } = this.props; 
        const hidden = isLogin ? {display: 'none'} : null;
        return (
            <nav className={isTop ? prefix+'_main_header' : `${prefix}_main_header-scroll`}>
                <span className={prefix+'_main_header__icon'}>CANCER CLASSIFIER</span>
                <div className={prefix+'_main_header__menu'}>
                    <div className={isTop ? 
                        prefix+'_main_header__menu_run' :
                        prefix+'_main_header__menu_run-scroll'
                        }><button>RUN CLASSIFICATION</button></div>
                    <div style={hidden} className={ isTop ?
                        prefix+'_main_header__menu_login':
                        prefix+'_main_header__menu_login-scroll'
                        }>LOG IN</div>
                </div>
            </nav>
        )
    }
}