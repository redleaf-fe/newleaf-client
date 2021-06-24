import React, { useRef } from 'react';
import { Button, Input, Form, Message } from 'redleaf-rc';
import { required, requiredMsg } from '@/utils/validators';
import { formUnpass } from '@/const';

export default (props) => {
  const { closeDlg, getList, info = {}, save } = props;
  const formRef: any = useRef();

  return (
    <Form
      className="create-container"
      defaultValue={info}
      getInstance={(i) => {
        formRef.current = i;
      }}
    >
      <Form.Item
        label="名称："
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
      <Form.Item label="描述：" name="description">
        <Input type="textarea" rows={5} maxLength={100} showCount />
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
            if (info.id) {
              values.id = info.id;
            }
            save(values)
              .then((res) => {
                closeDlg?.();
                getList?.();
                Message.show({ title: res.message });
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
