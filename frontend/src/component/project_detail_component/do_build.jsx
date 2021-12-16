import React, {Component} from 'react';
import {
  Timeline,
  Row,
  Card,
  CheckBox,
  Col,
  Table,
  Form,
  Input,
  Button,
  Checkbox,
  Tabs,
  Badge,
  Select,
  Icon,
  Modal,
  Radio,
  Breadcrumb,
  Menu,
  Tag
} from 'antd';
import {Link} from 'react-router';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const DoBuild = React.createClass({
  getInitialState(){
    return {
      buildType: 1,
      buildTask: '',
      projectId: -1,
      selectedFiles: [],
      curMachineId: 0,
      isNpmInstall: 1,
      showBuildInfo: false,
      buildInfoTitle: '',
      nowDirs: [],
      isDIr: true,
      content:'',
      distFiles: [],
      npmInstallIsCheck: false,
      buildResult: [],
      canViewBuild:false,
      machineList: []
    }
  },
  componentWillReceiveProps(nextProps){
    this.setState({
      buildLoading: nextProps.buildLoading,
      incExc :nextProps.incExc
    })
  },
  componentDidUpdate(){
    if(this.props.projectData && !this.state.curMachineId){
    // this.handleChange(this.props.projectData.machine_id)
      this.getMachineDetail(this.props.projectData.machine_id)
    }
  },
  
  getMachineDetail(id){
    var that = this
    $.ajax({
      url: '/home/machine?id=' + id,
      type: 'GET',
      success: function(res) {
        if (res.errno == 0) {
          that.handleChange(res.data)
        }
      }
    })
  },
  buildTabClick(index) {
    this.setState({buildType: index});
    this.props.setProState({buildType: index});
  },
  handleChange(machineInfo) {
    let that = this
    that.setState({curMachineId: machineInfo.id});
    //设置本次选中的部署环境
    that.state.selectedMachines = [machineInfo];
    that.props.setProState({selectedMachines:that.state.selectedMachines,curMachineId: machineInfo.id});
    that.setState({
      selectedMacRowKeys: [machineInfo.id]
    });

    that.props.setProState({selectedMacRowKeys: [machineInfo.id]});
    if (that.props.projectData.type == 1) {
      //正式环境,自动选择通知负责人,自动通知同步op
      that.props.setProState({notifyCharger: true,canQuickDeploy: false,sendOp: true});
    }
    else{
      that.props.setProState({canQuickDeploy: true,notifyCharger: false,sendOp: false});
    }
  },
  onInputChange(e) {
    let stateData = {};
    stateData[e.target.getAttribute('id')] = e.target.value;
    this.setState(stateData);
    this.props.setProState(stateData);
  },
  htmlDecode(str){
    var s = "";
     if(str.length == 0) return "";
     s = str.replace(/&/g,"&amp;");
     s = s.replace(/</g,"&lt;");
     s = s.replace(/>/g,"&gt;");
     s = s.replace(/ /g,"&nbsp;");
     s = s.replace(/\'/g,"&#39;");
     s = s.replace(/\"/g,"&quot;");
     return s;
  },
  handleNpmInstallCheck(e) {
    if(e.target.checked){
        this.setState({isNpmInstall: '2'});
    }
    else {
        this.setState({isNpmInstall: '1'});
    }
     this.setState({npmInstallIsCheck: e.target.checked});
  },
  getMachineInfo(curMachineId) {
    for (let i = 0; i < this.props.machineList.length; i++) {
      let machineInfo = this.props.machineList[i];
      if (machineInfo.id == curMachineId || machineInfo.name == curMachineId) {
        return machineInfo;
      }
    }
  },
  showBuildReInfo(ret){
      this.setState({showBuildInfo: true, buildInfoTitle:'查看构建'+ret+'详情'});
      let nowDirs = ret.split('/');
      this.setState({nowDirs: nowDirs});
      let isZip = false;
      if(ret.indexOf('.zip')>0){
        isZip = true;
      }
      console.log(ret+' '+ isZip);
      this.getBuildInfoByDir(ret,isZip);
  },
  getBuildInfoByDir(dir,isZip) {
    let self = this;
    $.ajax({
      type: 'POST',
      url: '/home/project/get_build_result',
      data: {
        dir: dir,
        isZip: isZip,
        buildDir : this.state.buildDir
      },
      success: function(res) {
        if (res.errno == 0) {
            if(res.data.isDir){
              self.setState({distFiles: res.data.filesArr,isDir:true});
            }
            else {
              self.setState({content:self.htmlDecode(res.data.content),isDir:false})
            }
        }
      }
    });
  },

  closeBuildInfoModal(){
      this.setState({showBuildInfo: false});
  },

  showDir(dir){
    let nowDirs = dir.split('/');
    let isZip = false;
    if(dir.indexOf('.zip')>0){
      isZip = true;
    }
    this.setState({nowDirs: nowDirs});
    this.getBuildInfoByDir(dir,isZip);
  },
  fileRowClick(record, index) {
    let dir = this.state.nowDirs.join('/');
    if(dir.substring(dir.length-1) == '/'){
      dir = dir.substring(0,dir.length-1);
    }
    dir = dir +'/'+record.filename;
    let nowDirs = dir.split('/');
    this.setState({nowDirs: nowDirs});
    this.getBuildInfoByDir(dir,record.isZip);
  },
  handleBuild(isQuickDeploy) {
    let quick_deploy = 0;
    if(isQuickDeploy === true){
      quick_deploy = 1;
    } else{
      this.setState({canQuickDeploy:false});
    }
    let self = this;
    let id = this.props.projectId;
    if (this.state.buildType == 1) {
      if (!self.state.curMachineId) {
        Modal.error({title: '请选择构建的机器'});
        return;
      }
      let macInfo = this.getMachineInfo(self.state.curMachineId);
      if (macInfo.is_lock == 1) {
        let tipContent = '本项目的' + macInfo.name + '(' + macInfo.ip + ')环境已经被' + macInfo.lock_user + '锁定占用，请联系他解除锁定！！';
        this.props.setProState({tipModalVisible: true, tipModalCheckVisible: 'block', tipModalContent: tipContent})
        return;
      }
    }
    if(self.state.buildTask.length > 1){
      this.setState({buildType: 2});
      this.props.setProState({buildType: 2});
    }
    
    // if (this.state.buildTask.length <= 1 && this.state.buildType == 2) {
    //   let tipContent = '请填写自定义构建任务！！';
    //   this.props.setProState({tipModalCheckVisible: 'none', tipModalVisible: true, tipModalContent: tipContent})
    //   return;
    // }
    let machineId = this.state.curMachineId;
    let isNpmInstall = this.state.isNpmInstall;
    let incExc = this.state.incExc;

    let deployFiles = JSON.parse(JSON.stringify(this.props.selectedFiles));
    for (let i = 0; i < deployFiles.length; i++) {
      let fileObj = deployFiles[i];
      delete fileObj.diff;
    }
    self.props.setProState({canTag: false,buildLoading:true});
    self.setState({buildLoading: true});
    setTimeout(()=>{
      $.ajax({
        type: 'POST',
        url: '/home/project/build',
        data: {
          id: id,
          deployFiles: JSON.stringify(deployFiles),
          isNpmInstall: isNpmInstall,
          incExc: incExc,
          buildType: self.state.buildType,
          buildTask: self.state.buildTask,
          quick_deploy: quick_deploy,
          machineId: machineId
        },
        success: function(res) {
          if (res.errno == 0) {
            let buildDist = res.data.sdir.split(';');
            self.setState({buildResult: buildDist,buildDir: res.data.buildDir});
            self.setState({buildLoading: false});
          }
        },
        error:function(res){
          message.error('构建失败！，请通过日志查看具体原因');
          self.setState({buildLoading: false});
        }
      });
    },0)
  },
  render() {
    let that =  this;
    let machineListOpts = this.props.machineList.map(function(machine) {
      return <Option key={machine.id} value={machine.name}>{machine.name}</Option>;
    })
    let buildResult = this.state.buildResult.map(function(ret){
        return (
          <div>
            <Row  style={{ borderBottom: '1px solid #e9e9e9' }} >
              <Col span={18}>
                <div style={{height: '40px',lineHeight:'40px',fontSize:'20px' }}>{ret}</div>
              </Col>
              <Col span={4} style={{padding:'5px 0px' }} >
                <Button type="primary" onClick={that.showBuildReInfo.bind(that,ret)}   disabled={that.state.buildLoading}  >查看</Button>
              </Col >
            </Row>
          </div>
        )
    });
    let DistCrumb = this.state.nowDirs.map(function(ret,index,arr){
      let distPath = arr.slice(0,index+1).join('/');
      return   <Breadcrumb.Item><a onClick = {that.showDir.bind(that,distPath)}>{ret}</a></Breadcrumb.Item>
    });

    const distFileColumns = [
      {
        title: '文件名',
        dataIndex: 'filename'
      },{
        title: 'size',
        dataIndex: 'filesize'
      }

    ];
    let showNodeModule = 'none';
    if(this.props.projectData && this.props.projectData.code_lang == 'javascript'){
      showNodeModule = 'block';
    }
    return (

      <div>
      <Row className="project-box">
        <div className="section-title">执行构建：</div>
        <div className="row-width" style={{
          'margin-top': '20px'
        }}>


    
              <span >填写构建任务（为空则取工程默认构建方案）：</span>
              <Input type="text" onChange={this.onInputChange.bind(this)} name="buildTask" id="buildTask"/>
      

          <div></div>
          <Row type="flex" justify="end" style={{
            'margin-top': '20px'
          }}>
            <Checkbox checked={this.state.npmInstallIsCheck} style={{
              'line-height': '28px',
              'display':showNodeModule,
              'padding-right': '10px'
            }} onChange={this.handleNpmInstallCheck.bind(that)}>是否更新node_modules</Checkbox>
            <Button
            type="primary"
            htmlType="submit"
            loading={this.state.buildLoading}
            onClick={this.handleBuild.bind(that)}
            disabled={!this.props.canBuild}>构建</Button>
          </Row>
        </div>
      </Row>
      <Row className="project-box">
        <div className="section-title">构建结果：</div>
        {buildResult}
      </Row>

      <Modal width={800} title={this.state.buildInfoTitle} style={{ top: 20 }} visible={this.state.showBuildInfo} onOk={this.closeBuildInfoModal.bind(that)} onCancel={this.closeBuildInfoModal.bind(that)}>
        <div  >
          <div className="row-width">
              <Breadcrumb>
                {DistCrumb}
              </Breadcrumb>
          </div>
          { this.state.isDir ?
            <div className="row-width" style={{ marginTop: 20 }}>
              <Table rowKey="filename" onRowClick = {this.fileRowClick.bind(this)} columns={distFileColumns} dataSource={this.state.distFiles} pagination={false} showHeader={false}/>
            </div>
              :
              <div className="row-width" style={{ marginTop: 20 }} >
                <div style={{'padding': '0 5px','color': '#ccc','background':'#000','overflow':'scroll'}} dangerouslySetInnerHTML={{__html: this.state.content}}></div>
              </div>
          }

        </div>
      </Modal>
      </div>

    );
  }
});

export default DoBuild;
