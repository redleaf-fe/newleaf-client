import React, { useRef, useState } from 'react';
import { Form, Input, Button, Check, Message } from 'redleaf-rc';
import { required, requiredMsg } from '@/utils/validators';
import { formUnpass } from '@/const';

import { defines, body, utils } from './templates';
import jsmin from './jsmin';

import './style.less';

export default () => {
  const formRef = useRef({});
  const [code, setCode] = useState('');

  return (
    <div className="script-container">
      <Form
        className="script-form"
        getInstance={(i) => {
          formRef.current = i;
        }}
        defaultValue={{
          logUrl: 'http://localhost:3013/log',
        }}
      >
        <Form.Item
          label="日志上报地址："
          name="logUrl"
          showRequiredMark
          validators={[
            {
              rule: required,
              message: requiredMsg,
            },
          ]}
        >
          <Input placeholder="输入日志上报地址" />
        </Form.Item>
        <Form.Item
          label="appId："
          name="appId"
          showRequiredMark
          validators={[
            {
              rule: required,
              message: requiredMsg,
            },
          ]}
        >
          <Input placeholder="输入appId" />
        </Form.Item>
        <Form.Item label="缓存名称：" name="lcName">
          <Input placeholder="输入缓存名称" />
        </Form.Item>
        <Form.Item label="全局错误处理：" name="errorHandle">
          <Check options={[{ value: '', text: '' }]} shape="rect" />
          <span>全局错误处理包括监听window的error事件、unhandledrejection事件，</span>
        </Form.Item>
        <Button
          className="submit"
          onClick={() => {
            const { values, errors } = formRef.current.getValues();
            if (Object.keys(errors).length > 0) {
              Message.show({ title: formUnpass });
              return;
            }

            const { appId, logUrl, lcName = '' } = values;
            setCode(
              jsmin(`(function(window){
              ${defines({ lcName })}${body({ appId, logUrl })}${utils}}(window));`),
            );
          }}
        >
          确定
        </Button>
      </Form>
      <div>
        <Input type="textarea" rows={20} className="script-area" value={code} />
      </div>
    </div>
  );
};
