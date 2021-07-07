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

const typeMapReverse = {
  login: 'register',
  register: 'login',
};

const apiMap = {
  login,
  register,
};

export default () => {
  const [type, setType] = useState('login');
  const formRef: any = useRef();

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
          name="username"
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
          <>
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
            <Form.Item
              name="email"
              validators={[
                {
                  rule: required,
                  message: requiredMsg,
                },
              ]}
            >
              <Input placeholder="输入邮箱" />
            </Form.Item>
          </>
        )}
        <Button
          className="submit"
          onClick={() => {
            const { values, errors } = formRef.current.getValues();
            if (Object.keys(errors).length > 0) {
              Message.error(formUnpass);
              return;
            }
            if (type === 'register' && values.password !== values.password2) {
              Message.error('两次密码输入不一致');
              return;
            }
            apiMap[type](values)
              .then((res) => {
                if (res && res.message) {
                  Message.error(JSON.stringify(res.message));
                }
              })
              .catch((e) => {
                Message.error(e.message);
              });
          }}
        >
          {typeMap[type]}
        </Button>
        <div className="bottom">
          <span
            onClick={() => {
              setType(typeMapReverse[type]);
            }}
          >
            立即{typeMap[typeMapReverse[type]]}
          </span>
        </div>
      </Form>
    </div>
  );
};
