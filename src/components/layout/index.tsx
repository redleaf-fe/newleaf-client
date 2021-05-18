import React, { useCallback, useState } from 'react';
import { Menu } from 'redleaf-rc';
import { useHistory, useLocation } from 'ice';

import './style.less';

export const context = React.createContext({});

const menuData = [
  { value: 'dashboard', text: '大盘' },
  { value: 'app', text: '应用管理', children: [{ value: 'appList', text: '应用列表' }] },
];

export default (props) => {
  const history = useHistory();
  const location = useLocation();

  const [pageTitle, setPageTitle] = useState('');

  // 全局变量
  const [layout, setLayout] = useState({
    userName: '',
  });

  const setLayoutVal = useCallback(
    ({ key, value }) => {
      if (layout[key] !== value) {
        const obj = Object.assign({}, layout);
        obj[key] = value;
        setLayout(obj);
      }
    },
    [layout],
  );

  return (
    <context.Provider value={{ setLayoutVal, layout }}>
      <div className="page-container">
        <div className="menu-container">
          <Menu
            // defaultValue={location.pathname.slice(1)}
            datasets={menuData}
            onChange={({ meta }) => {
              history.push(`/${meta.value}`);
              setPageTitle(meta.text || '');
            }}
          />
        </div>
        <div className="page-content">
          <div className="page-title">{pageTitle}</div>
          <div className="main">{props.children}</div>
        </div>
      </div>
    </context.Provider>
  );
};
