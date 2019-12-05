// 将各个 view 中的 reducer 汇总成整个应用的 reducer
import { welcomeReducer as welcome , IWelcomeState }from 'src/views/WelcomeRedux';

export interface IStoreState {
    welcome: IWelcomeState
}

export default {
    welcome,
}