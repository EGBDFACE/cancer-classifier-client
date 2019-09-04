import { saveAs } from 'file-saver';
import * as React from 'react';
import * as SparkMD5 from 'spark-md5';
import {  CANCER_LABEL as cancerLabel } from 'src/constant';
import './style.scss';
import Header from 'src/components/Header';
import Footer from 'src/components/Footer'
import { fetchGetResult, fetchUploadFile } from 'src/api';

interface FileItemScore {
	label: string,
	confidence: string
}
interface FileItem {
	fileMD5: string
	fileName: string
	fileSize: number
	fileObj: any
	label: string,
	labelChooseFlag: boolean,
	progress: number,
	// score: number,
	score: Array<FileItemScore>,
	status: string,
	uploaded: boolean,
	predicted: boolean,
	id: string
}

interface IExcelData{
	name: string,
	rawLabel: string,
	result: string
}

interface Props {
	location: any
}

interface States {
	applyAllFileItemFlag: boolean,
	fileStatus: string,
	// fileObj: any,
	fileList: FileItem[],
	showClassifier: boolean,
	showResults: boolean
}

export default class RunModel extends React.Component<Props, States> {
	private fileInput: React.RefObject<HTMLInputElement>
	private timeStamp: number
	private count: number
	constructor(props: Props) {
		super(props)
		this.state = {
			applyAllFileItemFlag: false,
			fileStatus: 'FILE_NOT_SELECTED',
			// fileObj: null,
			fileList: [],
			showClassifier: false,
			showResults: false
		}
		this.fileInput = React.createRef()
		this.timeStamp = new Date().getTime()
		this.count = 0;
		this.handleFileItemLabelClick = this.handleFileItemLabelClick.bind(this);
		this.handleFileItemTypeClick = this.handleFileItemTypeClick.bind(this);
		this.handleApplyAllFileItemFlagChange = this.handleApplyAllFileItemFlagChange.bind(this);
		this.createExcelFileDown = this.createExcelFileDown.bind(this);
	}
	createExcelFileDown(){
		let resultStr = 'Sample Name , Raw Label , Top 1 Inference , Top 2 Inference , Top 3 Inference \n';
		const { fileList } = this.state;
		for(let i=0; i<fileList.length; i++){
			// const score = fileList[i].score.split('\n');
			resultStr += fileList[i].fileName + '\t,'
					+fileList[i].label + '\t,';
			for (let j=0; j<fileList[i].score.length; j++){
				resultStr += fileList[i].score[j].label + '\t' 
					+fileList[i].score[j].confidence + '\t,';
			}
			resultStr += '\n';
			if(fileList[i].status !== 'RUN_SUCCESS'){
				return;
			}
		}
		const fileName = 'result.csv';
		const blobObj = new Blob([resultStr],{type: "text/plain;charset=utf-8"});
		saveAs(blobObj,fileName);
		// let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(resultStr);
		// let link = document.createElement('a');
		// link.href = uri;
		// link.download = 'result.csv';
		// document.body.appendChild(link);
		// link.click();
		// document.body.removeChild(link);
	}

	handleApplyAllFileItemFlagChange = (itemIndex: number) => (e:any) => {
		const {fileList} = this.state;
		const newFileList = JSON.parse(JSON.stringify(fileList));
		newFileList[itemIndex].labelChooseFlag = true;
		this.setState({
			applyAllFileItemFlag: e.target.checked,
			fileList: newFileList
		});
		// this.createExcelFileDown();
	}
	handleFileItemTypeClick = (itemIndex:number, label:string) => (e:any) => {
		// e.preventDefault();
		e.stopPropagation();
		if(label === cancerLabel[cancerLabel.length-1]) return;
		const { applyAllFileItemFlag, fileList } = this.state;
		const newFileList: FileItem[] = JSON.parse(JSON.stringify(fileList));
		if(applyAllFileItemFlag){
			for(let i=0; i<newFileList.length; i++){
				newFileList[i].label = label
			}
		}else{
			newFileList[itemIndex].label = label;
		}
		newFileList[itemIndex].labelChooseFlag = false;
		this.setState({
			fileList: newFileList
		})
		// this.createExcelFileDown();
	}
	handleFileItemLabelClick = (index:number) => (e:any) => {
		const { fileList }= this.state;
		const newFileList = JSON.parse(JSON.stringify(fileList));
		newFileList[index].labelChooseFlag = !fileList[index].labelChooseFlag;
		this.setState({
			fileList: newFileList
		})
	}
	initialUpload(value: any) {
		this.setState({
			showClassifier: true
		})
		this.fileInputChange(value)
	}

	addFiles(value: any) {
		this.fileInputChange(value)
	}

	fileInputChange(value: any) {
		const fileList = this.state.fileList.slice()
		for (let i = 0; i < value.length; i++) {
			fileList.push({
				fileMD5: '',
				fileName: value[i].name,
				fileSize: value[i].size / 1024,
				fileObj: value[i],
				progress: 0,
				label: '',
				labelChooseFlag: false,
				score: [],
				status: 'PREPARE_TO_RUN',
				uploaded: false,
				predicted: false,
				id: this.timeStamp + '-' + this.count
			})
			this.count++
		}
		this.setState({
			fileStatus: 'FILE_UPLOADING',
			// fileObj: value,
			fileList: JSON.parse(JSON.stringify(fileList))
		}, () => {
				// 上传未上传的文件
				this.uploadFiles(fileList.filter(item => !item.uploaded))
		})
	}

	uploadFiles(value: any) {
		for (let i = 0; i < value.length; i++) {
			this.handleFile(value[i])
		} 
	}

	updateFileList(callback: Function) {
		const fileList = this.state.fileList.slice();
		// let allDoneFlag = true;
		for (let i = 0; i < fileList.length; i++) {
			callback(fileList[i])
			if(fileList[i].status !== 'RUN_SUCCESS'){
				// allDoneFlag = false;
			}
		}
		// if(allDoneFlag){
		// 	this.createExcelFileDown();
		// 	// console.log(exportData);
		// }
		// this.createExcelFileDown();
		this.setState({
			fileList: JSON.parse(JSON.stringify(fileList))
		})
	}

	handleFile(value: FileItem) {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader()
			let fileMD5 = ''
			fileReader.onload = (e: any) => {
				fileMD5 = SparkMD5.hash(e.target.result)
				this.updateFileList(function (fileItem: FileItem) {
					if (fileItem.id == value.id) {
						fileItem.fileMD5 = fileMD5
					}
				});
                const uploadData = {
                    fileName: value.fileName,
                    fileMD5: fileMD5,
                    data: e.target.result
                };
                fetchUploadFile(uploadData, this, value)
                .then((res: any) => {
					if(res.data.code === '000002'){
						location.pathname = '/';
					}else if (res.data.code === '000000') {
						alert('暂不支持此类文件');
						let fileList = this.state.fileList;
						for (let i=0; i<fileList.length; i++) {
							if (fileList[i].fileMD5 == fileMD5) {
								fileList.splice(i,1);
								break;
							}
						}
						this.setState({
							fileList: fileList,
							// fileObj: fileList
						});
						if (fileList.length == 0) {
							this.setState ({
								// fileObj: null,
								fileStatus: 'FILE_NOT_SELECTED',
								showClassifier: false
							});
						}
					} else if (res.data.code === '000001') {
						// 上传成功
						this.updateFileList(function(fileItem: FileItem) {
							if (fileItem.id == value.id) {
								fileItem.progress = 100
								fileItem.uploaded = true
							}
						})
						resolve(res)
					}
				}).catch( (err: any) => {
					alert('文件处理出错啦！');
					let fileList = this.state.fileList;
					for (let i=0; i<fileList.length; i++) {
						if (fileList[i].fileMD5 == fileMD5) {
							fileList.splice(i,1);
							break;
						}
					}
					this.setState({
						fileList: fileList
					});
					if (fileList.length == 0) {
						this.setState ({
							fileStatus: 'FILE_NOT_SELECTED',
							showClassifier: false
						});
					}
					reject(err)
				})
			}
			fileReader.readAsText(value.fileObj)
		})
	}

	runModel() {
		const { fileList } = this.state;
		const newFileList: FileItem[] = [];
		for(let i=0; i<fileList.length; i++){
			newFileList[i] = fileList[i];
			newFileList[i].status = (fileList[i].status !=='RUN_SUCCESS') ? 'RUNNING': 'RUN_SUCCESS';
		}
		this.setState({
			fileList: newFileList,
			showResults: true
		})
		// 只处理未预测的文件
		this.runModelFiles(this.state.fileList.filter(item => !item.predicted))
	}

	runModelFiles(value: any) {
		// console.log(value)
		for (let i = 0; i < value.length; i++) {
			this.runModelFile(value[i])
		}
	}

	runModelFile(value: FileItem) {
		// const { fileList } = this.state;
		return new Promise((resolve, reject) => {
            const data = {
                fileName: value.fileName,
                fileMD5: value.fileMD5
            };
            fetchGetResult(data)
            .then( (res: any) => {
				if(res.data.code === '000002'){
					location.pathname='/';
				}else if (res.data.code === '000003') {
					alert('文件正在处理中，请稍候');
				}else if (res.data.code === '000001'){
					// 模型运行成功
					this.updateFileList(function (fileItem: FileItem) {
						if (fileItem.fileMD5 == value.fileMD5) {
							for (let key in res.data.data) {
								const obj = {
									label: key,
									confidence: res.data.data[key]
								};
								fileItem.score.push(obj);
							}
							fileItem.status = 'RUN_SUCCESS';
							fileItem.predicted = true
						}
					})
					resolve()
				}
			}).catch( (err: any) => {
				reject(err)
			})
		})
	}

	renderUpload() {
		switch(this.state.fileStatus){
			case 'FILE_NOT_SELECTED':
				return (<div className="upload">
					<label className="btn-upload"
						htmlFor="fileInput">
						<input type="file"
							id="fileInput"
							name="fileInput"
							className="fileInput"
							ref={this.fileInput}
							multiple
							onChange={() => this.initialUpload(this.fileInput.current.files)} />
						<i className="icon-upload"></i>
						Upload VCF Files
				</label>
					<p className="addition">
						<a>try given samples</a>
						<span>|</span>
						<a>discover consortiums</a>
					</p>
				</div>)
			case 'FILE_UPLOADING':
				return (
					<div className="file-list-wrapper">
						<table className="file-table">
							<colgroup>
								<col style={{'width': '60%'}}/>
								<col style={{'width': '20%'}}/>
								<col style={{'width': '20%'}}/>
							</colgroup>
							<thead>
								<tr>
									<th>File Name</th>
									<th>Size</th>
									<th>Cancer Label</th>
								</tr>
							</thead>
							<tbody>
								{this.renderUploadingList(this.state.fileList)}
							</tbody>
						</table>
						<label className="btn-addfiles"
							htmlFor="fileInput">
							<input type="file"
								id="fileInput"
								name="fileInput"
								className="fileInput"
								ref={this.fileInput}
								multiple
								onChange={() => this.addFiles(this.fileInput.current.files)} />
							<i className="icon-upload"></i>
							Add VCF Files
				</label>
					</div>
				)
			default:
				return null
		}			
	}

	renderUploadingList(fileList: FileItem[]) {
		const { applyAllFileItemFlag } = this.state;
		return fileList.map((v, i) => (
			<tr
				className="file-list"
				key={i}>
				<td className="file-name">
					<div className='file-progress'>{v.progress+'%'}</div>
					<i className="icon-vcf"></i>
					{v.fileName}</td>
				<td className="file-size">{v.fileSize > 1024 ? (v.fileSize / 1024).toFixed(2) + ' MB' : v.fileSize.toFixed(2) + ' KB'}</td>
				<td className="file-type"
					onClick={this.handleFileItemLabelClick(i)}
					>
					{v.label.length === 0 && <strong>
						Choose One Type
					</strong> }
					{v.label.length !== 0 && <strong>
						{v.label}
					</strong>}
					<i className="file-type_choose-icon" />
					{ v.labelChooseFlag && <div className="file-type_menu">
						{cancerLabel.map((value,index) => (
							<span className='file-type_menu-item'
								onClick={this.handleFileItemTypeClick(i,value)}
								key={index}>
								{value}
							</span>
						))}
						<div className='file-type_menu-selectAll'>
							<input type='checkbox' 
								className='selectAll-input'
								checked={applyAllFileItemFlag}
								onChange={this.handleApplyAllFileItemFlagChange(i)} />
							<span>apply to all VCF files</span>
						</div>
					</div>}
				</td>
			</tr>
		))
	}

	renderClassifier() {
		const { showResults } = this.state;
		return (
			<div className="classifier">
				<div className="choose-model">
					<p>Choose Model</p>
					<div className="model-menu">
						<div className="our-model">
							<a className="btn-model">
								<i className="icon-classifier"></i>
							</a>
							<p>Our Classifier</p>
						</div>
						<p className="tip-compare">compared with</p>
						<ul className="classifiers">
							<li>
								<a className="classifier-deepgene">DeepGene</a>
								<a className="classifier-dnn">DNN Classifier</a>
							</li>
							<li>
								<a className="classifier-svm">SVM</a>
								<a className="classifier-lr">Logistic Regression</a>
							</li>
						</ul>
					</div>
				</div>
				<div className="run-classifier">
					<p>Run Cancer Classifier</p>
					<a 
						className="btn-classifier"
						onClick={() => this.runModel()}><i className="icon-run-model"></i>{!showResults ? 'Run it now' : 'Run Again'}</a>
				</div>
			</div>
		)
	}

	renderResults() {
		return (
			<div className="file-list-wrapper">
				<table className="file-table">
					<colgroup>
						<col style={{ 'width': '20%' }} />
						<col style={{ 'width': '20%' }} />
						<col style={{ 'width': '20%' }} />
						<col style={{ 'width': '20'  }} />
						<col style={{ 'width': '20'  }} />
					</colgroup>
					<thead>
						<tr>
							<th>Sample Name</th>
							<th>Raw Label</th>
							{/* <th>Our Classifier</th> */}
							<th>Top 1 Inference</th>
							<th>Top 2 Inference</th>
							<th>Top 3 Inference</th>
						</tr>
					</thead>
					<tbody>
						{/* {this.renderResultList(this.state.fileList)} */}
						{this.state.fileList.map((value,index)=>this.renderResultList(value,index))}
					</tbody>
				</table>
			</div>
		)
	}
	
	renderResultListScoreItem ( score: FileItemScore , index: number, label: string) {
		if (Object.keys(score).length === 0) {
			return null;
		}
		let wrongLabelStyle = undefined;
		const scoreLabel = score.label;
		const confidenceStr = score.confidence;
		if (scoreLabel !== label && label !== '') {
			wrongLabelStyle = { color: '#D0021B' };
		} 
		if (label == '') {
			wrongLabelStyle = { color: '#444444' };
		}
		return (
			<td className="file-result_score" key={index}>
				<span className="result_score-label" style={wrongLabelStyle}>{scoreLabel}</span>
				<span className="result_score-number">{confidenceStr}</span>
			</td>
		)
	}
	renderResultList(v: FileItem, i: number){
		if(v.status === 'PREPARE_TO_RUN'){
			return null
		}else if(v.status === 'RUNNING'){
			return(
				<tr
					className="file-list"
					key={i}>
					<td className="file-name"><i className="icon-vcf"></i>{v.fileName}</td>
					<td className="file-size">{v.label}</td>
					<td>
						<i className='loading-icon Rotation' />
					</td>
					<td>
						<i className='loading-icon Rotation' />
					</td>
					<td>
						<i className='loading-icon Rotation' />
					</td>
				</tr>
			)
		}else{
			return(
				<tr
					className="file-list"
					key={i}>
					<td className="file-name"><i className="icon-vcf"></i>{v.fileName}</td>
					<td className="file-result_rawlabel">{v.label}</td>
					{ v.score.map(( value,index ) => this.renderResultListScoreItem(value, index, v.label))}
				</tr>
			)
		}
	}

	render() {
		const token: string = localStorage.getItem('token');
		const token_exp: string = localStorage.getItem('token_exp');
		const timeDiff: number = ((new Date().getTime()) - parseInt(token_exp))/60000;
		if (!token || (timeDiff > 120)) {
			location.pathname = '/';
			return;
		}
		return (
			<div className="model-wrapper">
				<Header location={this.props.location}/>
				<div className="main">
					<ul className="process">
						<div className="line"></div>
						<li className="load-data">
							<p className="step-info">Load VCF data</p>
							<div className="upload-wrapper">
								{this.renderUpload()}
							</div>
						</li>
						<li className="run-classifier-wrapper">
							<p className="step-info">Run cancer classifier</p>
							<div className="classifier-wrapper">
								{this.state.showClassifier && this.renderClassifier()}
							</div>
						</li>
						<li className="result">
							<p className="step-info">Explore results</p>
							{this.state.showResults && <div className="wrapper_download-excel"
															onClick={this.createExcelFileDown}>
									<i className='download-excel_icon' />
									<p className='download-excel_info'>Export as Excel</p>
								</div>}
							<div className="results-wrapper">
								{this.state.showResults && this.renderResults()}
							</div>
						</li>
					</ul>
				</div>
				<Footer location={this.props.location}/>
			</div>
		)
	}
}