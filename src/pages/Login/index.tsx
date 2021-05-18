import React, { useRef, useState } from 'react';
import { register, login } from '@/api/login';
import { Form, Input, Button, Message } from 'redleaf-rc';
import { required, requiredMsg } from '@/utils/validators';
import { formUnpass } from '@/const';

import './style.less';

const typeMap = {
  login: '登录',
  register: '注册',
};

const apiMap = {
  login,
  register,
};

export default () => {
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
        <Form.Item
          name="userName"
          validators={[
            {
              rule: required,
              message: requiredMsg,
            },
          ]}
        >
          <Input placeholder="输入用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          validators={[
            {
              rule: required,
              message: requiredMsg,
            },
          ]}
        >
          <Input type="password" placeholder="输入密码" />
        </Form.Item>
        {type === 'register' && (
          <Form.Item
            name="password2"
            validators={[
              {
                rule: required,
                message: requiredMsg,
              },
            ]}
          >
            <Input type="password" placeholder="再次输入密码" />
          </Form.Item>
        )}
        <Button
          className="submit"
          onClick={() => {
            const { values, errors } = formRef.current.getValues();
            if (Object.keys(errors).length > 0) {
              Message.show({ title: formUnpass });
              return;
            }
            if (type === 'register' && values.password !== values.password2) {
              Message.show({ title: '两次密码输入不一致' });
              return;
            }
            apiMap[type](values).catch((e) => {
              Message.show({ title: e.message });
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
