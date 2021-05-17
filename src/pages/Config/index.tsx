import React, { useReducer, useEffect } from 'react';
import { getTables } from '@/api/config';
import { Form, Input, Button } from 'redleaf-rc';

const reducer = (state, action) => {
  switch (action.type) {
    case 'change-port':
      return { ...state, port: action.value };
    default:
      return state;
  }
};

const Config = () => {
  const [state, dispatch] = useReducer(reducer, {
    port: '3306',
  });

  useEffect(() => {
    // getTables();
  }, []);

  return (
    <div>
      <div>
        <h3>数据库配置</h3>
        <Input
          value={state.port}
          placeholder="输入端口号"
          onChange={({ value }) => {
            dispatch({ type: 'change-port', value });
          }}
        />

        <Button onChange={() => {}}>确认</Button>
      </div>
    </div>
  );
};

export default Config;
