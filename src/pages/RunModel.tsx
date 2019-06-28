import * as React from 'react'
import * as SparkMD5 from 'spark-md5';
import axios from 'axios'
import { BASE_URL, CANCER_LABEL as cancerLabel } from '../constant';
import '@/css/runModel.scss'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { resolve } from 'dns';
import { rejects } from 'assert';
import { booleanLiteral } from '@babel/types';

interface FileItem {
	fileMD5: string
	fileName: string
	fileSize: number
	fileObj: any
	label: string,
	labelChooseFlag: boolean,
	progress: number,
	score: number,
	uploaded: boolean,
	predicted: boolean,
	id: string
}

interface Props {
	location: any
}

interface States {
	applyAllFileItemFlag: boolean,
	fileStatus: string,
	fileObj: any,
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
			fileObj: null,
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
	}
	handleApplyAllFileItemFlagChange = (itemIndex: number) => (e:any) => {
		const {fileList} = this.state;
		const newFileList = JSON.parse(JSON.stringify(fileList));
		newFileList[itemIndex].labelChooseFlag = true;
		this.setState({
			applyAllFileItemFlag: e.target.checked,
			fileList: newFileList
		});
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
				score: 0,
				uploaded: false,
				predicted: false,
				id: this.timeStamp + '-' + this.count
			})
			this.count++
		}
		this.setState({
			fileStatus: 'FILE_UPLOADING',
			fileObj: value,
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
		const fileList = this.state.fileList.slice()
		for (let i = 0; i < fileList.length; i++) {
			callback(fileList[i])
		}
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
				})
				axios({
					method: 'POST',
					baseURL: BASE_URL,
					url: 'uploadFile',
					data: {
						fileName: value.fileName,
						fileMD5: fileMD5,
						data: e.target.result
					},
					onUploadProgress: (progressEvent) => {
						this.updateFileList(function (fileItem: FileItem) {
							if (fileItem.id == value.id) {
								fileItem.progress = Math.floor(progressEvent.loaded / progressEvent.total * 100)
							}
						})
					}
				}).then(res => {
					// 上传成功
					this.updateFileList(function(fileItem: FileItem) {
						if (fileItem.id == value.id) {
							fileItem.progress = 100
							fileItem.uploaded = true
						}
					})
					resolve(res)
				}).catch(err => {
					reject(err)
				})
			}
			fileReader.readAsText(value.fileObj)
		})
	}

	runModel() {
		this.setState({
			showResults: true
		})
		// 只处理未预测的文件
		this.runModelFiles(this.state.fileList.filter(item => !item.predicted))
	}

	runModelFiles(value: any) {
		console.log(value)
		for (let i = 0; i < value.length; i++) {
			this.runModelFile(value[i])
		}
	}

	runModelFile(value: FileItem) {
		return new Promise((resolve, reject) => {
			axios({
				method: 'POST',
				baseURL: BASE_URL,
				url: 'getResult',
				data: {
					fileName: value.fileName,
					fileMD5: value.fileMD5
				}
			}).then(res => {
				// 模型运行成功
				this.updateFileList(function (fileItem: FileItem) {
					if (fileItem.fileMD5 == value.fileMD5) {
						fileItem.score = res.data
						fileItem.predicted = true
					}
				})
				resolve()
			}).catch(err => {
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
								<col style={{'width': '70%'}}/>
								<col style={{'width': '15%'}}/>
								<col style={{'width': '15%'}}/>
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
						onClick={() => this.runModel()}><i className="icon-run-model"></i>Run it Now</a>
				</div>
			</div>
		)
	}

	renderResults() {
		return (
			<div className="file-list-wrapper">
				<table className="file-table">
					<colgroup>
						<col style={{ 'width': '70%' }} />
						<col style={{ 'width': '15%' }} />
						<col style={{ 'width': '15%' }} />
					</colgroup>
					<thead>
						<tr>
							<th>Sample Name</th>
							<th>Raw Label</th>
							<th>Our Classifier</th>
						</tr>
					</thead>
					<tbody>
						{this.renderResultList(this.state.fileList)}
					</tbody>
				</table>
			</div>
		)
	}

	renderResultList(fileList: FileItem[]) {
		return fileList.map((v, i) => (
			<tr
				className="file-list"
				key={i}>
				<td className="file-name"><i className="icon-vcf"></i>{v.fileName}</td>
				<td className="file-size">{v.label}</td>
				{/* <td className="file-type">{v.score}</td> */}
				<td>{v.score}</td>
			</tr>
		))
	}

	render() {
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