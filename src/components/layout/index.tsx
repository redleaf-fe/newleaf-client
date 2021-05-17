import React from 'react';
import './style.less';

const Layout = (props) => {
  return (
    <div className="pageContainer">
      <div className="menuContainer">menu</div>
      <div className="pageContent">{props.children}</div>
    </div>
  );
};

export default Layout;
