import * as React from 'react'
import './style.scss';

interface Props {
	location: any
}

interface States {
}

export default class Footer extends React.Component<Props, States> {
	constructor(props: Props) {
		super(props)
	}

	render() {
		if(this.props.location.pathname === '/runModel'){
			return(
				<footer>
					<div className="footer" style={{'justifyContent': 'center'}}>
						<p className="copyright">&copy; {new Date().getFullYear()}</p>
					</div>
				</footer>
			)
		}else{
			return( 
				<footer>
					<div className="footer">
						<p className="copyright">&copy; {new Date().getFullYear()}</p>
					</div>
				</footer>
			)
		}
	}
}