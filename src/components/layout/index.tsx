import React, { useCallback, useState } from 'react';
import { ConfigProvider } from 'redleaf-rc';
import './style.less';

const Layout = (props) => {
  const [global, setGlobal] = useState({
    pageTitle: '',
  });

  const setGlobalVal = useCallback(
    ({ key, value }) => {
      if (global[key] !== value) {
        const obj = Object.assign({}, global);
        obj[key] = value;
        setGlobal(obj);
      }
    },
    [global],
  );

  return (
    <ConfigProvider.Provider setGlobal={setGlobalVal}>
      <div className="page-container">
        <div className="menu-container">menu</div>
        <div className="page-content">
          <div className="page-title">{global.pageTitle}</div>
          <div className="main">{props.children}</div>
        </div>
      </div>
    </ConfigProvider.Provider>
  );
};

export default Layout;
