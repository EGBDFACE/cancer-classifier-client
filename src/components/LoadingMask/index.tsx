import * as React from 'react';
import './style.scss';

export default class LoadingMask extends React.Component {
    public render() {
        return(
            <div className='lds-content'>
                <div className='lds-roller'>
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                </div>
            </div>
        )
    }
}