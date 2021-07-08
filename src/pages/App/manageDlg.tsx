import React, { useCallback, useMemo, useRef } from 'react';
import { Button, Form, Table, Message, Popup, Select, Input, Dialog } from 'redleaf-rc';
import Pagination from '@/components/pagination';
import usePageTable from '@/hooks/usePageTable';
import { accessLevelMap } from '@/const';
import { getMembersInApp, saveUserToApp, removeUserFromApp } from '@/api/user';

import AddUserDlg from '../Dialogs/addUserDlg';

const accessMap = Object.keys(accessLevelMap).map((v) => ({ value: v, text: accessLevelMap[v] }));

export default (props) => {
  const { info, type } = props;
  const { appId, appName } = info || {};
  const formRef: any = useRef();

  const { changePage, pageData, fetchQuery, setFetchQuery, loading } = usePageTable({
    reqMethod: getMembersInApp,
    dealReqData: useCallback(
      (args) => {
        const { name, currentPage } = args;
        const param: any = { currentPage, id: appId, type };
        if (name) {
          param.name = name;
        }
        return param;
      },
      [appId, type],
    ),
  });

  const changeAccess = useCallback(
    (param) => {
      param.type = type;
      saveUserToApp(param)
        .then((res) => {
          Message.success(res.message);
          setFetchQuery((t) => ({ ...t }));
        })
        .catch((e) => {
          Message.error(e.message);
        });
    },
    [setFetchQuery, type],
  );

  const addUser = useCallback(
    (v) => {
      changeAccess({
        id: appId,
        name: appName,
        uid: v.uid,
      });
    },
    [appId, appName, changeAccess],
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
        columnKey: 'access',
        grow: 1,
        render({ meta }) {
          return (
            <Select
              value={[String(meta.access_level)]}
              options={accessMap}
              showClearIcon={false}
              showSearch={false}
              onChange={({ meta: changeData }) => {
                changeAccess({
                  id: appId,
                  name: appName,
                  gitUid: meta.id,
                  access: changeData[0].value,
                });
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
                removeUserFromApp({
                  gitUid: meta.id,
                  id: appId,
                  type,
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
    [changeAccess, setFetchQuery, appId, appName, type],
  );

  return (
    <div className="manage-dlg">
      <div className="mb16">
        <Button
          onClick={() => {
            Dialog.show({
              maskClosable: true,
              content: (
                <AddUserDlg
                  {...{
                    addUser,
                  }}
                />
              ),
              title: '添加成员',
            });
          }}
        >
          添加成员
        </Button>
      </div>
      <Form
        layout="horizontal"
        getInstance={(i) => {
          formRef.current = i;
        }}
      >
        <Form.Item label="用户名：" name="name">
          <Input maxLength={20} />
        </Form.Item>
        <Button
          className="ml16"
          onClick={() => {
            const { values } = formRef.current.getValues();
            setFetchQuery({ name: values.name, currentPage: 1 });
          }}
        >
          搜索
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
