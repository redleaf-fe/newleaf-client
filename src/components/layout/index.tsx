import React, { useCallback, useState } from 'react';
import './style.less';

export const context = React.createContext({});

const Layout = (props) => {
  const [layout, setLayout] = useState({
    pageTitle: '',
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
    <context.Provider value={{ setLayoutVal }}>
      <div className="page-container">
        <div className="menu-container">menu</div>
        <div className="page-content">
          <div className="page-title">{layout.pageTitle}</div>
          <div className="main">{props.children}</div>
        </div>
      </div>
    </context.Provider>
  );
};

export default Layout;
