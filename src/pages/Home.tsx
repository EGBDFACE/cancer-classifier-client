import * as React from 'react'
import {Link} from 'react-router-dom'
import '@/css/home.scss'
import Header from '../components/Header'
import Footer from '../components/Footer'

interface Props {
	location: any
}

interface States {

}

export default class Home extends React.Component<Props, States> {
	constructor(props: Props) {
		super(props)
	}

	render() {
		// console.log(this.props)
		return (
		<div className="page">
			<Header location={this.props.location}/>
			<div className="main">
				<div className="title">
					<h1>A Superior Cancer Classifier</h1>
					<p className='title_info'>for precisely predicting the classification of 12 cancer types</p>
					<p className='title_cancer-type'>CESC LUAD BRCA PAAD ACC KIRP STAD PRAD UCS HNSC BLCA LGG</p>
				</div>
				<div className="method">
					<p>The model is empowered by <span className="emphasis-font-black">deep learning approach</span> &<br/> comprehensive variant <span className="emphasis-font-blue">pathogenicity predictor</span>.</p>
				</div>
				<div className="run-model-wrapper">
					<Link to="/runModel" className="btn-run-model"><i className="icon-run-model"></i>Run Classification</Link>
				</div>
				<div className="method-arc-wrapper"
					style={{opacity: 0}}>
					<img src={require('../css/img/methodArch.png')} width="100%" alt="Method Architecture"/>
				</div>
			</div>
			<Footer location={this.props.location}/>
		</div>)
	}
}