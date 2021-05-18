import React, { useRef } from 'react';
import { Form, Input, Button } from 'redleaf-rc';

import './style.less';

const { Item } = Form;

const Login = () => {
  const formRef = useRef({});

  return (
    <div className="login-container">
      <Form
        className="login-form"
        getInstance={(i) => {
          formRef.current = i;
        }}
      >
        <div className="title">登录</div>
        <Item
          name="userName"
          validators={[
            {
              rule: ({ value }) => {
                return !!value;
              },
              message: '必填',
            },
          ]}
        >
          <Input placeholder="输入用户名" />
        </Item>
        <Item
          name="password"
          validators={[
            {
              rule: ({ value }) => {
                return !!value;
              },
              message: '必填',
            },
          ]}
        >
          <Input type="password" placeholder="输入密码" />
        </Item>
        <Button
          className="submit"
          onClick={() => {
            console.log(formRef.current.getValues());
          }}
        >
          登录
        </Button>
      </Form>
    </div>
  );
};

export default Login;
