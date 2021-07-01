import React, { useCallback, useRef, useState } from 'react';
import { Button, Select, Form, Message } from 'redleaf-rc';
import { useThrottle } from 'redleaf-rc/dist/utils/hooks';
import { required, requiredMsg } from '@/utils/validators';
import { getAppByName } from '@/api/app';
import { formUnpass } from '@/const';

export default (props) => {
  const { save, info, getList } = props;
  const [options, setOptions] = useState([]);
  const formRef: any = useRef();

  const getAppData = useThrottle(
    useCallback((val) => {
      getAppByName({ name: val })
        .then((res) => {
          if (res && res.length > 0) {
            setOptions(res.map((v) => ({ value: JSON.stringify(v), text: v.source_name })));
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
      className="addapp-dlg"
      layout="horizontal"
      getInstance={(i) => {
        formRef.current = i;
      }}
    >
      <Form.Item
        label="应用名："
        name="app"
        validators={[
          {
            rule: required,
            message: requiredMsg,
          },
        ]}
      >
        <Select options={options} onSearch={getAppData} placeholder="输入要搜索的应用名" />
      </Form.Item>
      <Button
        className="ml16 submit-btn"
        onClick={() => {
          const { values, errors } = formRef.current.getValues();
          if (Object.keys(errors).length > 0) {
            Message.error(formUnpass);
            return;
          }
          save({ id: JSON.parse(values.app[0]).source_id, group_id: info.source_id })
            .then((res) => {
              getList();
              Message.success(res.message);
            })
            .catch((e) => {
              Message.error(e.message);
            });
        }}
      >
        确定
      </Button>
    </Form>
  );
};
