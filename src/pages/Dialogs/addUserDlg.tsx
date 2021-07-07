import React, { useCallback, useRef, useState } from 'react';
import { Button, Select, Form, Message } from 'redleaf-rc';
import { useThrottle } from 'redleaf-rc/dist/utils/hooks';
import { required, requiredMsg } from '@/utils/validators';
import { getUserByName } from '@/api/user';
import { formUnpass } from '@/const';

import './style.less';


export default (props) => {
  const { addUser } = props;
  const [options, setOptions] = useState([]);
  const formRef: any = useRef();

  const getUserData = useThrottle(
    useCallback((val) => {
      getUserByName({ username: val })
        .then((res) => {
          if (res && res.length > 0) {
            setOptions(res.map((v) => ({ value: JSON.stringify(v), text: v.username })));
          }
        })
        .catch((e) => {
          Message.error(e.message);
        });
    }, []),
    200,
  );

  return (
    <Form
      className="adduser-dlg"
      layout="horizontal"
      getInstance={(i) => {
        formRef.current = i;
      }}
    >
      <Form.Item
        label="用户名："
        name="user"
        validators={[
          {
            rule: required,
            message: requiredMsg,
          },
        ]}
      >
        <Select options={options} onSearch={getUserData} placeholder="输入要搜索的用户名" />
      </Form.Item>
      <Button
        className="ml16 submit-btn"
        onClick={() => {
          const { values, errors } = formRef.current.getValues();
          if (Object.keys(errors).length > 0) {
            Message.error(formUnpass);
            return;
          }
          addUser(JSON.parse(values.user[0]));
        }}
      >
        确定
      </Button>
    </Form>
  );
};
