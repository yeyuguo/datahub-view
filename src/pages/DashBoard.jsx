'use strict';

import React, {
  Component,
} from 'react';

import {
  Row,
  Col,
  Icon,
  Card,
  Tooltip,
  Popconfirm,
} from 'antd';

import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import ProjectForm from '../components/forms/ProjectForm';

import {
  projectService,
} from '../service';

import './DashBoard.less';

class DashBoard extends Component {
  state = {
    context: window.context,
    visible: false,
    loading: false,
    listData: [],
    stageData: null,
  };

  formatMessage = id => this.props.intl.formatMessage({ id });

  async componentWillMount () {
    await this.fetchProjects();
  }

  showCreateForm = () => {
    this.setState({
      stageData: null,
      visible: true,
    });
  }

  closeProjectForm = () => {
    this.setState({
      visible: false,
    });
  }

  confirmProjectForm = async values => {
    this.setState({
      loading: true,
    });
    const apiName = this.state.stageData
      ? 'updateProject'
      : 'createProject';
    const res = await projectService[apiName]({
      uniqId: this.state.stageData && this.state.stageData.uniqId,
      projectName: values.projectName,
      description: values.description,
    });

    this.setState({
      loading: false,
    });

    if (res.success) {
      this.setState({
        visible: false,
      }, () => {
        this.fetchProjects();
      });
    }
  }

  deleteProject = async (uniqId) => {
    await projectService.deleteProject({ uniqId });
    await this.fetchProjects();
  }

  fetchProjects = async () => {
    const res = await projectService.getProjectList();
    this.setState({
      listData: res.data || [],
    });
  }

  updateProject = async value => {
    this.setState({
      stageData: value,
      visible: true,
    });
  }

  renderProjectList () {
    const formatMessage = this.formatMessage;
    const { listData } = this.state;
    return listData.map((item, index) => {
      return <Col span={8} key={index}>
        <div className="content">
          <Card
            title={item.description}
            data-accessbilityid={`dashboard-content-card-${index}`}
            bordered={false}
            style={{ color: '#000' }}
          >
            <Row type="flex">
              <Col span={24} className="main-icon">
                <a href={`/project/${item.projectName}`}>
                  <Icon type="inbox" />
                </a>
              </Col>
              <Row type="flex" className="sub-info">
                <Col span={20} key={item.projectName}>
                  {item.projectName}
                  <span className="main-info">
                    <Icon type="file" />{item.capacity && item.capacity.count}
                    <Icon type="hdd" />{item.capacity && item.capacity.size}
                  </span>
                </Col>
                <Col span={4} style={{ textAlign: 'right' }}>
                  <Tooltip title={formatMessage('project.update')}>
                    <Icon
                      className="setting-icon"
                      type="setting"
                      onClick={() => this.updateProject(item)}
                    />
                  </Tooltip>
                  <Popconfirm
                    title={formatMessage('common.deleteTip')}
                    onConfirm={() => this.deleteProject(item.uniqId)}
                    okText={formatMessage('common.confirm')}
                    cancelText={formatMessage('common.cancel')}
                  >
                    <Icon className="delete-icon" type="delete" />
                  </Popconfirm>
                </Col>
              </Row>
            </Row>
          </Card>
        </div>
      </Col>;
    });
  }

  render () {
    return (
      <div className="dashboard">
        <Row type="flex" justify="center">
          <Col span="22">
            <Row>
              { this.renderProjectList() }
              <Col span={8}>
                <div className="content">
                  <Card
                    title={<FormattedMessage id='project.add' />}
                    bordered={ false }
                    style={{ color: '#000' }}
                  >
                    <Row type="flex">
                      <Col span={24} className="main-icon">
                        <Icon
                          data-accessbilityid="dashboard-folder-add"
                          onClick={this.showCreateForm}
                          type="folder-add"
                        />
                      </Col>
                      <Row type="flex" className="sub-info blank">
                      </Row>
                    </Row>
                  </Card>
                </div>
              </Col>
            </Row>
          </Col>
          <ProjectForm
            visible={this.state.visible}
            onCancel={this.closeProjectForm}
            onOk={this.confirmProjectForm}
            loading={this.state.loading}
            stageData={this.state.stageData}
          />
        </Row>
      </div>
    );
  }
}

export default injectIntl(DashBoard);
