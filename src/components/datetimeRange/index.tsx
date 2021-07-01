import React, { useEffect } from 'react';
import { DateTime } from 'redleaf-rc';
import { useSafeState } from 'redleaf-rc/dist/utils/hooks';

import './style.less';

export default (props) => {
  const { onChange } = props;
  const [state, setState] = useSafeState({ startTime: '', endTime: '' });

  useEffect(() => {
    onChange?.({ value: state });
  }, [state, onChange]);

  return (
    <>
      <DateTime
        onChange={({ value }) => {
          setState({ startTime: value });
        }}
      />
      <span className="divide">-</span>
      <DateTime
        onChange={({ value }) => {
          setState({ endTime: value });
        }}
      />
    </>
  );
};
