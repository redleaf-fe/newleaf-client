import React, { useRef, useState } from 'react';
import { getAppIDs } from '@/api/app';
import { getLog } from '@/api/log';
import { Form, Input, Button, Message } from 'redleaf-rc';

import './style.less';

export default () => {
  const formRef = useRef({});

  return (
    <div className="log-container">
      <Form
        className="login-form"
        getInstance={(i) => {
          formRef.current = i;
        }}
      >
        <Button
          className="submit"
          onClick={() => {
            getAppIDs()
              .then((res) => {
                if (res.length > 0) {
                  getLog({ appId: res[0] })
                    .then((res2) => {
                      console.log(res2);
                    })
                    .catch((e) => {
                      Message.show({ title: e.message });
                    });
                }
              })
              .catch((e) => {
                Message.show({ title: e.message });
              });
          }}
        >
          搜索
        </Button>
      </Form>
    </div>
  );
};
