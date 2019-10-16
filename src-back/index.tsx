import * as ReactDom from 'react-dom';
import route from './router';
import './style.scss';

ReactDom.render(
    route,
    document.getElementById('root')
)