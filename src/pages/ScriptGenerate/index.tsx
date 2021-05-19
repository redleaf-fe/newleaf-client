import React, { useRef } from 'react';
import { Form, Input, Button, Check, Message } from 'redleaf-rc';
import { required, requiredMsg } from '@/utils/validators';
import { formUnpass } from '@/const';

import './style.less';

export default () => {
  const formRef = useRef({});

  return (
    <div className="script-container">
      <Form
        className="script-form"
        getInstance={(i) => {
          formRef.current = i;
        }}
      >
        <Form.Item
          label="日志上报地址："
          name="url"
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
        <Form.Item label="错误处理日志：" name="errorHandle">
          <Check options={[{ value: '', text: '' }]} shape="rect" />
        </Form.Item>
        <Button
          className="submit"
          onClick={() => {
            const { values, errors } = formRef.current.getValues();
            if (Object.keys(errors).length > 0) {
              Message.show({ title: formUnpass });
              return;
            }
            console.log(values);
          }}
        >
          确定
        </Button>
      </Form>
      <div>
        <Input type="textarea" rows={20} className="script-area" />
      </div>
    </div>
  );
};
