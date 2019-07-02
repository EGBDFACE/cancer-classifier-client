import * as React from 'react';
import '@/css/base.scss';
import * as PIXI from 'pixi.js';
// import loadingPNF from '../images/loading.png';
const loadingPNG = require('@/css/img/loading.png');

interface Props{
    index: number
}
interface States{

}
 
export default class LoadingLabel extends React.Component<Props,States>{
    constructor(props:Props){
        super(props);
    }

    componentDidMount(){
        let app = new PIXI.Application({
            width:20,
            height:20,
            antialias: true,
            backgroundColor: 0xF5F5F5,
            resolution: 5
        });
        const { index } = this.props;
        document.getElementById('loadingLabel'+index).appendChild(app.view);
        // document.body.appendChild(app.view);
        // console.log(loadingPNG);
        let loadingIcon = PIXI.Sprite.from(loadingPNG);
        // console.log(loadingIcon);
        loadingIcon.anchor.set(0.5);
        loadingIcon.width = 20;
        loadingIcon.height = 20; 
        loadingIcon.x = app.screen.width/2 + 2 ;
        loadingIcon.y = app.screen.height/2 + 2 ;
        app.stage.addChild(loadingIcon);
        app.ticker.add(delta => {
            loadingIcon.rotation += 0.1 * delta;
        });
    }

    render(){
        const { index } = this.props;
        return(
            <i id={'loadingLabel'+index}></i>
        )
    }
}