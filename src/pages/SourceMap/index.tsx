import React, { useRef, useState } from 'react';
import { Form, Button, Message, Input } from 'redleaf-rc';
import { query } from '@/api/sourceMap';
import { required, requiredMsg } from '@/utils/validators';
import { formUnpass } from '@/const';

import './style.less';

export default () => {
  const [info, setInfo] = useState({});
  const formRef: any = useRef();

  return (
    <div className="sourcemap-container">
      <Form
        layout="vertical"
        getInstance={(i) => {
          formRef.current = i;
        }}
      >
        <Form.Item
          name="appName"
          label="应用名称："
          showRequiredMark
          validators={[
            {
              rule: required,
              message: requiredMsg,
            },
          ]}
        >
          <Input maxLength={100} />
        </Form.Item>
        <Form.Item
          name="commit"
          label="commit："
          showRequiredMark
          validators={[
            {
              rule: required,
              message: requiredMsg,
            },
          ]}
        >
          <Input maxLength={100} />
        </Form.Item>
        <Form.Item
          name="fileName"
          label="文件名："
          showRequiredMark
          validators={[
            {
              rule: required,
              message: requiredMsg,
            },
          ]}
        >
          <Input maxLength={100} />
        </Form.Item>
        <Form.Item
          name="line"
          label="line："
          showRequiredMark
          validators={[
            {
              rule: required,
              message: requiredMsg,
            },
          ]}
        >
          <Input maxLength={100} />
        </Form.Item>
        <Form.Item
          name="column"
          label="column："
          showRequiredMark
          validators={[
            {
              rule: required,
              message: requiredMsg,
            },
          ]}
        >
          <Input maxLength={100} />
        </Form.Item>
        <Button
          className="ml100"
          onClick={() => {
            const { values, errors } = formRef.current.getValues();
            if (Object.keys(errors).length > 0) {
              Message.error(formUnpass);
              return;
            }
            query({ ...values })
              .then((res) => {
                setInfo(res);
              })
              .catch((e) => {
                Message.error(e.message);
              });
          }}
        >
          查询
        </Button>
      </Form>
      <div className="ml100 mt16">
        <div>文件：{info.source}</div>
        <div>行：{info.line}</div>
        <div>列：{info.column}</div>
      </div>
    </div>
  );
};
