import React, { Component } from 'react';
import { Menu, Trigger, Bubble } from 'redleaf-rc';
import Cookie from 'js-cookie';

import './style.less';

export const context = React.createContext({});

const menuData = [
  { value: 'dashboard', text: '大盘' },
  { value: 'appList', text: '应用列表' },
  { value: 'logList', text: '日志列表' },
  { value: 'logScript', text: '日志脚本' },
];

/* eslint-disable */
export default class Layout extends Component {
  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  state = {
    pageTitle: '',
    layout: {
      userName: '',
    },
  };

  setLayoutVal = ({ key, value }) => {
    if (this.state.layout[key] !== value) {
      const obj = Object.assign({}, this.state.layout);
      obj[key] = value;
      this.setState({
        layout: obj,
      });
    }
  };

  render() {
    const { pageTitle, layout } = this.state;
    const { location, history, children } = this.props;

    return (
      <context.Provider value={{ setLayoutVal: this.setLayoutVal, layout }}>
        <div className="page-container">
          <div className="menu-container">
            <div className="title">newleaf</div>
            <Menu
              defaultValue={location.pathname.slice(1)}
              datasets={menuData}
              onChange={({ meta }) => {
                history.push(`/${meta.value}`);
                this.setState({ pageTitle: meta.text || '' });
              }}
            />
          </div>
          <div className="page-content">
            <div className="page-title">
              {/* 页面名称 */}
              <span className="page-name">{pageTitle}</span>
              {/* 账号信息 */}
              <Trigger
                className="user-name"
                content={
                  <Bubble
                    position="topRight"
                    className="change-user"
                    onClick={() => {
                      history.push(`/login`);
                    }}
                  >
                    切换账号
                  </Bubble>
                }
                position="bottomRight"
              >
                <span>{Cookie.get('userName')}</span>
              </Trigger>
            </div>
            <div className="main">{children}</div>
          </div>
        </div>
      </context.Provider>
    );
  }
}
