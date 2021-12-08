import React, {Component} from 'react';
import {
  Row,
  Col,
  Table,
  Form,
  Input,
  Button,
  Checkbox,
  Tabs,
  Badge,
  Select,
  Pagination
} from 'antd';
const { Column, ColumnGroup } = Table;
import ProForm from './project_form';
import '../style/project.less'
import '../style/project_list.less';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const InputGroup = Input.Group;
const Option = Select.Option;
class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowProForm: false,
      projectname:'',
      items: {
        currentPage: 1,
        numsPerPage: 10
      },
      proItemsData: []
    };
  }
  handleClick(itemID) {
    window.location.href = '#project_detail?id=' + itemID;
  }

  handleUpdateClick(itemID){
    window.location.href = '#new_project?id=' + itemID;
  }

  getItemData(pageId, pageSize) {
    let self = this;
    $.ajax({
      type: 'get',
      url: '/home/project/get_project_list',
      data: {
        pageId: pageId,
        pageSize: pageSize,
        name:this.state.projectname
      },
      success: function(res) {
        self.setState({items: res.data, proItemsData: res.data.data})
      }
    })
  }

  searchProject(){
    this.getItemData(this.state.items.currentPage, this.state.items.numsPerPage);
  }

  componentDidMount() {
    this.getItemData(this.state.items.currentPage, this.state.items.numsPerPage);
  }

  addProject(){
    window.location.href = '#new_project'
  }

  onChange(page) {
    this.getItemData(page, 10);
  }
  showTotal(total) {
    return `共 ${total} 条`;
  }

  handleChange(e){
    this.setState({projectname: e.target.value})
  }
  
  render() {
    let self = this
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
      }, {
        title: '发布目标目录',
        dataIndex: 'dir'
      },
      {
        title: '执行任务',
        dataIndex: 'task'
      },
      {
        title: '工程类型',
        dataIndex: 'type',
        render: text => text == 1? '正式': text == 2 ? '预发布':'测试',
      },
      {
        title: '创建人',
        dataIndex: 'creater',
      },
      {
        title: '操作',
        key: 'action',
        render: (record) => (
          <div size="middle">
            <a href="javascript:;" className="list-btn" onClick={self.handleClick.bind(self,record.id)}>发布</a>
            <a href="javascript:;"  className="list-btn"  onClick={self.handleUpdateClick.bind(self,record.id)}>编辑</a>
          </div>
        ),
      },
    ]
    return (
      <div >
        <div id="machineAction">
          <Row type="flex" justify="space-between" className="section-gap">
            <div className="tool">
            <Input style={{ width: '200px' }} placeholder="输入工程名称" size="large" onChange={this.handleChange.bind(this)}/>
            <Button  style={{ width: '80px',marginLeft:'20px' }}type="primary" size="large" onClick={this.searchProject.bind(this)}>搜索</Button>
            </div>
            <Button type="primary" size="large" onClick={this.addProject.bind(this)}>新建工程</Button>
          </Row>

        </div>
        <Row>
         <Table 
         scroll={{
          x: 500,
          y: false
        }}
         columns={columns} 
         dataSource={this.state.proItemsData} 
         pagination={
           {
           onChange:this.onChange.bind(this), 
           total:this.state.items.count,
           showTotal:this.showTotal.bind(this), 
           current:this.state.items.currentPage, 
           pageSize:this.state.items.numsPerPage, 
           defaultCurrent:this.state.items.currentPage
          }}>
              
          
            </Table>
        </Row>
      </div>
    );
  }
};
export default ProjectList;
