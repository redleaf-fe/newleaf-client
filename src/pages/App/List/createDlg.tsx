import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Input, Form, Message } from 'redleaf-rc';
import { saveApp, appDetail } from '@/api/app';
import { required, requiredMsg } from '@/utils/validators';
import { formUnpass } from '@/const';

export default (props) => {
  const { closeDlg, getList } = props;
  const formRef = useRef();

  // const getAppDetail = useCallback(() => {
  //   appDetail().then((res) => {});
  // }, []);

  // useEffect(getAppDetail, [getAppDetail]);

  return (
    <Form
      className="create-container"
      getInstance={(i) => {
        formRef.current = i;
      }}
    >
      <Form.Item
        label="应用名称："
        name="appName"
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
            saveApp(values)
              .then(() => {
                closeDlg?.();
                getList?.();
                Message.show({ title: '创建成功' });
              })
              .catch((e) => {
                Message.show({ title: e.message });
              });
          }}
        >
          确定
        </Button>
        <Button
          type="default"
          onClick={() => {
            closeDlg?.();
          }}
        >
          取消
        </Button>
      </div>
    </Form>
  );
};
