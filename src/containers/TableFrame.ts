import TableFrame from '../components/TableFrame';
import { StoreState } from '../store/store';
import { connect } from 'react-redux';
import * as actions from '../actions/action';
import { Dispatch } from 'react';

function mapStateToProps(state:StoreState){
    return{
        totalFile: state.fileUpload.totalFile,
        currentPageNumber: state.tableFrameVCF.currentPageNumber,
        totalPageNumber: state.tableFrameVCF.totalPageNumber,
        singlePageDisplayNumber: state.tableFrameVCF.singlePageDisplayNumber
    }
}
function mapDispatchToProps(dispatch:Dispatch<actions.TableDisplay>){
    return {
        Next: () => dispatch(actions.VCFTableFrame_Next()),
        Previous: () => dispatch(actions.VCFTableFrame_Previous()),
        InputPage: (page:number) => dispatch(actions.VCFTableFrame_InputPage(page)),
        SinglePage: (rows:number) => dispatch(actions.VCFTableFrame_SinglePage(rows))
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(TableFrame);