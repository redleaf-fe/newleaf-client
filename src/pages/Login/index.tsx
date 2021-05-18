import React, { useRef, useState } from 'react';
import { register, login } from '@/api/login';
import { Form, Input, Button, Message } from 'redleaf-rc';

import './style.less';

const { Item } = Form;

const typeMap = {
  login: '登录',
  register: '注册',
};

const Login = () => {
  const [type, setType] = useState('login');
  const formRef = useRef({});

  return (
    <div className="login-container">
      <Form
        className="login-form"
        getInstance={(i) => {
          formRef.current = i;
        }}
      >
        <div className="title">{typeMap[type]}</div>
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
        {type === 'register' && (
          <Item
            name="password2"
            validators={[
              {
                rule: ({ value }) => {
                  return !!value;
                },
                message: '必填',
              },
            ]}
          >
            <Input type="password" placeholder="再次输入密码" />
          </Item>
        )}
        <Button
          className="submit"
          onClick={() => {
            const { values, errors } = formRef.current.getValues();
            if (Object.keys(errors).length > 0) {
              return;
            }
            register(values)
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                Message.show({ title: err });
              });
          }}
        >
          {typeMap[type]}
        </Button>
        <div className="bottom">
          {type === 'login' && (
            <span
              className="register"
              onClick={() => {
                setType('register');
              }}
            >
              立即注册
            </span>
          )}
        </div>
      </Form>
    </div>
  );
};

export default Login;
