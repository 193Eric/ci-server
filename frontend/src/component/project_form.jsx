/**
＊新建项目或者修改项目资料
**/

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {
  Alert,
  Button,
  Form,
  Input,
  Row,
  Col,
  Modal,
  Select,
  Table,
  Radio
} from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
function noop() {
  return false;
}
class ProjectForm extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      getItemList:'',
      machineList:[],
      selectedRows:'',
      codeLangArray:['javascript','java','go'],
      selectedMacRowKeys :''
    }

  }
  componentDidMount() {
    const query = this.props.location.query;
    let id = query.id;
    if (id) {
      this.getProjectById(id);
    }
    let that = this
    $.ajax({
      type: 'get',
      url: '/home/machine/project',
      success: function(res) {
        that.setState({machineList:res.data})
      }
    })
  }
  getProjectById(id) {
    let that = this;
    $.ajax({
      type: 'get',
      url: '/home/project/get_project_by_id',
      data: {
        id: id
      },
      success: function(res) {
        let itemDatas = res.data;

        let stateData = {
          name: itemDatas.name,
          code_url: itemDatas.code_url,
          code_lang: '' + itemDatas.code_lang,
          vcs_type: '' + itemDatas.vcs_type,
          dir: itemDatas.dir,
          sdir: itemDatas.sdir,
          type: ''+itemDatas.type,
          machine_id:itemDatas.machine_id,
          task: itemDatas.task,
          server_dir: itemDatas.server_dir,
          after_deploy_shell: itemDatas.after_deploy_shell,
          before_deploy_shell: itemDatas.before_deploy_shell,
          hook_params: itemDatas.hook_params,
          build_hook: itemDatas.build_hook,
          deploy_hook: itemDatas.deploy_hook
        };

        if(itemDatas.op_project){
          that.setState({
            selectedRows:{
              id:itemDatas.op_project.op_project_id,
              name : itemDatas.op_project.op_project_name
            },
            selectedMacRowKeys:[itemDatas.op_project.op_project_id]
          })
        }

        that.props.form.setFieldsValue(stateData);
      }
    })
  }

  getValidateStatus(field) {
    const {isFieldValidating, getFieldError, getFieldValue} = this.props.form;
    if (isFieldValidating(field)) {
      return 'validating';
    } else if (!!getFieldError(field)) {
      return 'error';
    } else if (getFieldValue(field)) {
      return 'success';
    }
  }

  handleSubmit(e) {
    e.preventDefault();
  }
  hideModal() {
    this.props.proFormHandler(false);
  }
  onSelect(value) {
    console.log('onselect:' + value);
    // let v=value=='git'?'1':'2';
    // console.log({vcs_type:v});
    let t = {
      vcs_type: value
    }
    this.setState(t);
    console.log(this.state);
  }
  onChange(e) {
    e.preventDefault();
    let sData = {};
    sData[e.target.name] = e.target.value;
    this.setState(sData);
  }
  onChange(e) {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }

  handlePost() {
    let _self = this;
    const {getFieldValue} = _self.props.form;
    _self.props.form.validateFields((errors, values) => {
      if (!!errors) {
        console.log(errors)
        return;
      }

      if (getFieldValue('name') && getFieldValue('code_url')) {
        const query = this.props.location.query;
        let id = query.id;
        let url = '/home/project/update_project'
        if (!id) {
          url = '/home/project/new_project'
        }
        $.ajax({
          type: 'POST',
          url: url,
          data: {
            name: getFieldValue('name'),
            vcs_type: getFieldValue('vcs_type'),
            dir: getFieldValue('dir'),
            sdir: getFieldValue('sdir'),
            type:getFieldValue('type'),
            task: getFieldValue('task'),
            server_dir: getFieldValue('server_dir'),
            after_deploy_shell: getFieldValue('after_deploy_shell'),
            before_deploy_shell: getFieldValue('before_deploy_shell'),
            code_lang: getFieldValue('code_lang'),
            machine_id:getFieldValue('machine_id'),
            code_url:getFieldValue('code_url'),
            hook_params: getFieldValue('hook_params'),
            build_hook: getFieldValue('build_hook'),
            deploy_hook: getFieldValue('deploy_hook'),
            op_item_id :_self.state.selectedRows.id,
            op_item_name:_self.state.selectedRows.name,
            id: id
          },
          success: function(res) {
              if (res.errno == 0) {
                // alert(successMsg);
                ReactDOM.render(
                  <Alert message="操作成功" type="success" showIcon/>, document.getElementById('result'));
                  window.location.href = '#/'
              } else {
                // alert(res.errmsg);
                ReactDOM.render(
                  <Alert message="操作失败" description={res.errmsg} type="error" showIcon/>, document.getElementById('result'));
              }
            
          }
        })
      }
    })
  }
  render() {

    const {getFieldProps, getFieldError, isFieldValidating, getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      }
    };
    const proNameProps = getFieldProps('name', {
      rules: [
        {
          required: true,
          message: '请填写项目名称'
        }
      ]
    });
    const hookParamsProps = getFieldProps('hook_params', {
      rules: [
        {
          required: false,
          message: ''
        }
      ]
    });
    const deployHookProps = getFieldProps('deploy_hook', {
      rules: [
        {
          required: false,
          message: ''
        }
      ]
    });
    const buildHookProps = getFieldProps('build_hook', {
      rules: [
        {
          required: false,
          message: ''
        }
      ]
    });
    const selectProps = getFieldProps('vcs_type', {
      rules: [
        {
          required: true,
          message: '请选择项目类型'
        }
      ]
    });
    const selectLangProps = getFieldProps('code_lang', {
      rules: [
        {
          required: true,
          message: '请选择语言类型'
        }
      ]
    });

    const taskProps = getFieldProps('task', {
      rules: [
        {
          required: true,
          message: '请输入构建的任务'
        }
      ]
    });
    const select2Props = getFieldProps('type', {
      rules: [
        {
          required: true,
          message: '请选择环境类型'
        }
      ]
    });
    const select3Props = getFieldProps('machine_id', {
      rules: [
        {
          required: true,
          message: '请选择部署机器'
        }
      ]
    });
    

    const beforeDeployShellProps = getFieldProps('before_deploy_shell', {
      rules: [
        {
          required: false,
          message: '请选择部署前执行命令'
        }
      ]
    });
    const serverDirProps = getFieldProps('server_dir', {
      rules: [
        {
          required: true,
          message: '请选择命令执行路径'
        }
      ]
    });

    const afterDeployShellProps = getFieldProps('after_deploy_shell', {
      rules: [
        {
          required: false,
          message: '请填写完成执行命令'
        }
      ]
    });

    const proCodeUrlProps = getFieldProps('code_url', {
      rules: [
        {
          required: true,
          whitespace: true,
          message: '请填写项目地址'
        }
      ]
    });

    const sdirProps = getFieldProps('sdir', {
      rules: [
        {
          required: true,
          message: '请输入机器源目录'
        }
      ]
    });
    const dirProps = getFieldProps('dir', {
      rules: [
        {
          required: true,
          message: '请输入机器目标目录'
        }
      ]
    });

    const itemLayout = {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      }
    };
    let that = this;


    let OpSelection = {
      type:'radio',
      selectedRowKeys: that.state.selectedMacRowKeys,
      onChange(selectedRowKeys, selectedRows) {

        that.setState({
          selectedRows : {
            id:selectedRows[0].id,
            name : selectedRows[0].name
          },
          selectedMacRowKeys:selectedRowKeys
        })

      }
    }

     const deployItemInfo = [
      {
        title: '项目id',
        dataIndex: 'id'
      }, {
        title: '项目名称',
        dataIndex: 'name'
      }
    ];

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    let codeLangListOpts = this.state.codeLangArray.map(function(lang) {
      return <Option  value={lang}>{lang}</Option>;
    })
    let codeLangOptionFormItem =    (
           <FormItem hasFeedback label="代码语言：">
                <Select {...selectLangProps} id="code_lang" name="code_lang" defaultValue="javascript">
                {codeLangListOpts}
                </Select>
              </FormItem>
      )
      let machineListOpts = this.state.machineList.map(function(machine) {
        return <Option key={machine.id} value={machine.id}>{machine.name}</Option>;
      })
    return (
      <div>
        <div className="form-content">
          <div id="result"></div>
          <Form horizontal form={this.props.form}>

            <FormItem hasFeedback help={isFieldValidating('name')
              ? ''
              : (getFieldError('name') || []).join(', ')} label="项目名称：">
              <Input {...proNameProps} placeholder="请输入项目名称" type="text" onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} autoComplete="off" id="name" name="name"/>
            </FormItem>

            <FormItem hasFeedback label="代码仓库类型：">
              <Select {...selectProps} id="vcs_type" name="vcs_type" defaultValue="1">
                <Option value="1">git</Option>
                <Option value="2">svn</Option>
              </Select>
            </FormItem>
            {codeLangOptionFormItem}
            <FormItem hasFeedback label="仓库地址：">
              <Input {...proCodeUrlProps} type="text" onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} autoComplete="off" id="code_url" name="code_url"/>
            </FormItem>
            <FormItem hasFeedback label="环境类型：">
              <Select {...select2Props} id="type" name="type" defaultValue="1">
                <Option value="1">正式</Option>
                <Option value="2">预发布</Option>
                <Option value="3">测试</Option>
              </Select>
            </FormItem>
            <FormItem hasFeedback label="部署机器：">
              <Select id="machine_id" {...select3Props} showSearch={true} style={{
                  display: 'inline-block'
                }} style={{
                  width: '100%'
                }} >
                  {machineListOpts}
                </Select>
            </FormItem>
            <FormItem label="项目构建任务：">
              <Input placeholder="" {...taskProps}/>
            </FormItem>
            <FormItem label='发布源目录(多个目录用";"隔开)：'>
              <Input placeholder="" {...sdirProps} placeholder="/dist"/>
            </FormItem>
            <FormItem label='发布目标目录(多个目录用";"隔开)：'>
              <Input placeholder="" {...dirProps}/>
            </FormItem>
            <FormItem label='部署命令执行目录：'>
              <Input placeholder="" {...serverDirProps}/>
            </FormItem>
            <FormItem label='部署前执行命令'>
              <Input placeholder="" {...beforeDeployShellProps}/>
            </FormItem>
            <FormItem label='部署完成执行命令'>
              <Input placeholder="" {...afterDeployShellProps}/>
            </FormItem>

            <FormItem hasFeedback label="构建hook：">
              <Input  {...buildHookProps} type="text" onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} autoComplete="off" id="build_hook" name="build_hook"/>
            </FormItem>
            <FormItem hasFeedback label="部署hook：">
              <Input  {...deployHookProps} type="text" onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} autoComplete="off" id="deploy_hook" name="deploy_hook"/>
            </FormItem>
            <FormItem hasFeedback label="hook参数：">
              <Input {...hookParamsProps} type="textarea" onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} autoComplete="off" id="hook_params" name="hook_params"/>
            </FormItem>


            <FormItem>
              <Row type="flex" justify="end" className="section-gap">
                <Button type="primary" onClick={this.handlePost.bind(this)} htmlType="submit">确定</Button>
              </Row>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
};

export default Form.create()(ProjectForm);
