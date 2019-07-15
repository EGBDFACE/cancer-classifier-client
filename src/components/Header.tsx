import * as React from 'react'

interface Props {
	location: any
}

interface States {
}

export default class Header extends React.Component<Props, States> {
	constructor(props: Props) {
		super(props)
	}
	
	render() {
		return (
			<header>
				{this.props.location.pathname !== '/' && <div className="header">
					{/* <a className="logo" href="/"></a> */}
					<a className='logo' href='/cancer-classifier' />
					<div className="description">
						<h2>Cancer Classifier</h2>
						<p>for precisely predicting the classification of 12 cancer types</p>
						<p className='header_cancer-type'>CESC LUAD BRCA PAAD ACC KIRP STAD PRAD UCS HNSC BLCA LGG</p>
					</div>
				</div>}
			</header>
		)
	}
}