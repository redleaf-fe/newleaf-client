import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Button, Form, Table, Message, Popup, Select } from 'redleaf-rc';
import { useThrottle } from 'redleaf-rc/dist/utils/hooks';
import Pagination from '@/components/pagination';
import usePageTable from '@/hooks/usePageTable';
import { getUserByName } from '@/api/user';

const accessMap = [
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
  const { name, id } = appInfo || {};
  const [options, setOptions] = useState([]);
  const formRef: any = useRef();

  const { changePage, pageData, fetchQuery, setFetchQuery, loading } = usePageTable({
    reqData: {
      id,
    },
    reqMethod: getAllAuth,
  });

  const getUserData = useThrottle((val) => {
    getUserByName({ username: val })
      .then((res) => {
        if (res && res.length > 0) {
          setOptions(res.map((v) => ({ value: JSON.stringify(v), text: v.username })));
        }
      })
      .catch((e) => {
        Message.error(e.message);
      });
  }, 200);

  const changeAccess = useCallback(
    (param) => {
      saveAuth(param)
        .then((res) => {
          Message.success(res.message);
          setFetchQuery((t) => ({ ...t }));
        })
        .catch((e) => {
          Message.error(e.message);
        });
    },
    [setFetchQuery],
  );

  const columns = useMemo(
    () => [
      {
        title: '用户',
        columnKey: 'username',
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
              options={accessMap}
              showClearIcon={false}
              showSearch={false}
              onChange={({ meta: changeData }) => {
                changeAccess([
                  {
                    name,
                    appId: id,
                    username: meta.username,
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
        width: 100,
        render({ meta }) {
          return (
            <Popup
              onOk={() => {
                deleteAuth({
                  appId: id,
                  uid: meta.uid,
                })
                  .then((res) => {
                    Message.success(res.message);
                    setFetchQuery({ currentPage: 1 });
                  })
                  .catch((e) => {
                    Message.error(e.message);
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
    <div className="manage-dlg">
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
              changeAccess(
                values.user.map((v) => {
                  const { username, uid } = JSON.parse(v);
                  return {
                    name,
                    appId: id,
                    username,
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
      {/*  */}
      <Table columns={columns} datasets={pageData.data} loading={loading} />
      <Pagination
        totalItems={pageData.totalItems}
        type="complex"
        currentPage={fetchQuery.currentPage}
        onChange={changePage}
      />
    </div>
  );
};
