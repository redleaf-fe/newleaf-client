import React from 'react';
import cls from 'classnames';
import './style.less';

const labelContent = (props) => {
  const { items = [], labelClassName, contentClassName } = props;
  return (
    <div className="label-content">
      {items.map((v, k) => (
        <div className="content-container" key={k}>
          <span className={cls('label', labelClassName)}>{v.label}</span>
          <span className={cls('content', contentClassName)}>{v.value}</span>
        </div>
      ))}
    </div>
  );
};

export default labelContent;
