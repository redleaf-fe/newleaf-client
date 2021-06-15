import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Button, Form, Table, Message, Popup, Select } from 'redleaf-rc';
import { useThrottle } from 'redleaf-rc/dist/utils/hooks';
import { getAllAuth, saveAuth, deleteAuth } from '@/api/userApp';
import Pagination from '@/components/pagination';
import usePageTable from '@/hooks/usePageTable';
import { getUserDataByName } from '@/utils';

const authMap = [
  {
    value: 'admin',
    text: '管理员',
  },
  {
    value: 'develop',
    text: '开发',
  },
  {
    value: 'view',
    text: '浏览',
  },
];

const defaultAuth = 'develop';

export default (props) => {
  const { appInfo } = props;
  const { appName, id } = appInfo || {};
  const [options, setOptions] = useState([]);
  const formRef: any = useRef();

  const { changePage, pageData, fetchQuery, setFetchQuery } = usePageTable({
    reqData: {
      id,
    },
    reqMethod: getAllAuth,
  });

  const getUserData = useThrottle((val) => {
    getUserDataByName(val)
      .then((res) => {
        if (res && res.length > 0) {
          setOptions(res.map((v) => ({ value: JSON.stringify(v), text: v.userName })));
        }
      })
      .catch((e) => {
        Message.show({ title: e.message });
      });
  }, 200);

  const changeAuth = useCallback(
    (param) => {
      saveAuth(param)
        .then((res) => {
          Message.show({ title: res.message });
          setFetchQuery((t) => ({ ...t, currentPage: t.currentPage }));
        })
        .catch((e) => {
          Message.show({ title: e.message });
        });
    },
    [setFetchQuery],
  );

  const columns = useMemo(
    () => [
      {
        title: '用户',
        columnKey: 'userName',
        grow: 1,
      },
      {
        title: '权限',
        columnKey: 'auth',
        grow: 1,
        render({ meta }) {
          return (
            <Select
              value={[meta.auth]}
              options={authMap}
              showClearIcon={false}
              showSearch={false}
              onChange={({ meta: changeData }) => {
                changeAuth([
                  {
                    appName,
                    appId: id,
                    userName: meta.userName,
                    uid: meta.uid,
                    auth: changeData[0].value,
                  },
                ]);
              }}
            />
          );
        },
      },
      {
        title: '操作',
        columnKey: 'op',
        width: '100px',
        render({ meta }) {
          return (
            <Popup
              onOk={() => {
                deleteAuth({
                  appId: id,
                  uid: meta.uid,
                })
                  .then((res) => {
                    Message.show({
                      title: res.message,
                    });
                    setFetchQuery((t) => ({ ...t, currentPage: 1 }));
                  })
                  .catch((e) => {
                    Message.show({
                      title: e.message,
                    });
                  });
              }}
            >
              <Button type="danger">删除</Button>
            </Popup>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="manage-container">
      <Form
        layout="horizontal"
        getInstance={(i) => {
          formRef.current = i;
        }}
      >
        <Form.Item label="用户名：" name="user">
          <Select type="multi" options={options} onSearch={getUserData} />
        </Form.Item>
        <Button
          className="ml16"
          onClick={() => {
            const { values } = formRef.current.getValues();
            if (values.user && values.user.length > 0) {
              changeAuth(
                values.user.map((v) => {
                  const { userName, uid } = JSON.parse(v);
                  return {
                    appName,
                    appId: id,
                    userName,
                    uid,
                    auth: defaultAuth,
                  };
                }),
              );
            }
          }}
        >
          添加
        </Button>
      </Form>
      <Table columns={columns} datasets={pageData.data} bordered="row" />
      <div className="text-align-right">
        <Pagination
          totalItems={pageData.totalItems}
          type="complex"
          currentPage={fetchQuery.currentPage}
          onChange={changePage}
        />
      </div>
    </div>
  );
};
