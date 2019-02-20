import Upload from '../components/Upload';
import * as actions from '../actions/action';
import { StoreState } from '../store/store';
import { connect } from 'react-redux';
import { Dispatch } from 'react';

function mapStateToProps(state:StoreState){
    return{
        selectedFileName:state.fileUpload.selectedFileName
    }
}

function mapDispatchToProps(dispatch:Dispatch<actions.UploadStatus>){
    return {
        fileSelect: (file:object) => dispatch(actions.FileSlected(file))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Upload);