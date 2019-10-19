import React, { Component } from 'react';
import Footer from 'src/layouts/Footer';
import Login from 'src/components/Welcome/Login';
import Nav from 'src/components/Welcome/Nav';
import './Welcome.scss';

interface IProps {
    // isLogin: boolean;
}
interface IStates {
    isTop: boolean;
}

export default class Welcome extends Component<IProps,IStates> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            isTop: true,
        };
    }
    render() {
        const NavProps = {
            // isLogin: this.props.isLogin,
            isLogin: false,
            isTop: false,
            prefix: 'Welcome',
        };
        const LoginProps = {
            isDisplay: true,
        };
        const FooterProps = {
            location: '/',
        };
        return (
            <div className='Welcome'>
                <Nav {...NavProps} />
                <Login {...LoginProps} />
                <div className='Welcome_main'>
                    <p className='Welcome_main_title'>A Superior Cancer Classifier</p>
                    <p className='Welcome_main_intro'>for precisely predicting the classification 
                        of 12 cancer types : CESC LUAD BRCA PAAD ACC KIRP STAD PRAD UCS HNSC BLCA LGG</p>
                    <div className='Welcome_main_button'>
                        <button>RUN CLASSIFICATION</button>
                    </div>
                </div>
                <div className='Welcome_detail'>
                    <blockquote>
                        <p className='Welcome_detail_intro'>The model is empowered by 
                            <strong>deep learning approach</strong> 
                            and comprehensive variant 
                            <strong>pathogenicity predictor</strong>.
                        </p>
                    </blockquote>
                </div>
                <Footer {...FooterProps}/>
            </div>
        )
    }
}