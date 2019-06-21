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
			<footer>
				{this.props.location.pathname == '/' && <div className="footer">
					<p className="data-src">Credit: data used for creating visualization of 10 top cancer types sourced from<br /> Centers for Disease Control and Prevention (CDC) and the National Cancer Institute (NCI).</p>
					<p className="copyright">&copy; {new Date().getFullYear()}</p>
				</div>}
				{this.props.location.pathname !== '/' && <div className="footer" style={{'justifyContent': 'center'}}>
					<p className="copyright">&copy; {new Date().getFullYear()}</p>
				</div>}
			</footer>
		)
	}
}