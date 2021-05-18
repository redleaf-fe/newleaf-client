import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Input, Form, Message } from 'redleaf-rc';
import { saveApp, appDetail } from '@/api/app';
import { required, requiredMsg } from '@/utils/validators';
import { formUnpass } from '@/const';

export default (props) => {
  const { close } = props;
  const formRef = useRef();

  const getAppList = useCallback(() => {
    getAppList().then((res) => {
      setDatasets(res);
    });
  }, []);

  useEffect(getAppList, [getAppList]);

  return (
    <Form
      className="create-container"
      getInstance={(i) => {
        formRef.current = i;
      }}
    >
      <Form.Item
        label="应用名称："
        name="name"
        showRequiredMark
        validators={[
          {
            rule: required,
            message: requiredMsg,
          },
        ]}
      >
        <Input maxLength={20} showCount />
      </Form.Item>
      <Form.Item label="应用描述：" name="desc">
        <Input type="textarea" rows={5} maxLength={100} showCount />
      </Form.Item>
      <Form.Item
        label="仓库地址："
        name="git"
        showRequiredMark
        validators={[
          {
            rule: required,
            message: requiredMsg,
          },
        ]}
      >
        <Input type="textarea" rows={5} maxLength={200} showCount />
      </Form.Item>
      <div className="btns">
        <Button
          className="mr16"
          onClick={() => {
            const { values, errors } = formRef.current.getValues();
            if (Object.keys(errors).length > 0) {
              Message.show({ title: formUnpass });
              return;
            }
            saveApp(values).then(getAppList);
          }}
        >
          确定
        </Button>
        <Button
          type="default"
          onClick={() => {
            close?.();
          }}
        >
          取消
        </Button>
      </div>
    </Form>
  );
};
