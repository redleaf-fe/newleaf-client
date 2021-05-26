import React, { useEffect, useState } from 'react';
import { DateTime } from 'redleaf-rc';

import './style.less';


export default (props) => {
  const { onChange } = props;
  const [timeRange, setTimeRange] = useState({ startTime: '', endTime: '' });

  useEffect(() => {
    onChange?.({ value: timeRange });
  }, [timeRange, onChange]);

  return (
    <>
      <DateTime
        onChange={({ value }) => {
          setTimeRange((t) => ({ ...t, startTime: value }));
        }}
      />
      <span className="divide">-</span>
      <DateTime
        onChange={({ value }) => {
          setTimeRange((t) => ({ ...t, endTime: value }));
        }}
      />
    </>
  );
};
