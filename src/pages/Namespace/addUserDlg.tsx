import React, { useCallback, useRef, useState } from 'react';
import { Button, Select, Form, Message } from 'redleaf-rc';
import { useThrottle } from 'redleaf-rc/dist/utils/hooks';

import { getUserDataByName } from '@/utils';
import { formUnpass } from '@/const';

export default (props) => {
  const { addAuth } = props;
  const [options, setOptions] = useState([]);
  const formRef: any = useRef();

  const getUserData = useThrottle(
    useCallback((val) => {
      getUserDataByName(val)
        .then((res) => {
          if (res && res.length > 0) {
            setOptions(res.map((v) => ({ value: JSON.stringify(v), text: v.username })));
          }
        })
        .catch((e) => {
          Message.show({ title: e.message });
        });
    }, []),
    200,
  );

  return (
    <Form
      className="add-container"
      layout="horizontal"
      getInstance={(i) => {
        formRef.current = i;
      }}
    >
      <Form.Item label="用户名：" name="user">
        <Select options={options} onSearch={getUserData} />
      </Form.Item>
      <Button
        className="ml16"
        onClick={() => {
          const { values, errors } = formRef.current.getValues();
          if (Object.keys(errors).length > 0) {
            Message.show({ title: formUnpass });
            return;
          }
          addAuth(JSON.parse(values.user[0]).uid);
        }}
      >
        确定
      </Button>
    </Form>
  );
};
