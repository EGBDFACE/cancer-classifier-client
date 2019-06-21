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
					<i className="logo"></i>
					<div className="description">
						<h2>Cancer Classifier</h2>
						<p>for precisely predicting the classification of 12 cancer types</p>
					</div>
				</div>}
			</header>
		)
	}
}