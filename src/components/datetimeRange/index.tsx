import React, { useEffect, useState } from 'react';
import { DateTime } from 'redleaf-rc';

import './style.less';


export default (props) => {
  const { onChange } = props;
  const [state, setState] = useState({ startTime: '', endTime: '' });

  useEffect(() => {
    onChange?.({ value: state });
  }, [state, onChange]);

  return (
    <>
      <DateTime
        onChange={({ value }) => {
          setState((t) => ({ ...t, startTime: value }));
        }}
      />
      <span className="divide">-</span>
      <DateTime
        onChange={({ value }) => {
          setState((t) => ({ ...t, endTime: value }));
        }}
      />
    </>
  );
};
