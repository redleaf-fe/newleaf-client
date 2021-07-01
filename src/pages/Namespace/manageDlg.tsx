import React, { useCallback, useMemo, useRef } from 'react';
import { Button, Form, Table, Message, Popup, Select, Input, Dialog } from 'redleaf-rc';
import Pagination from '@/components/pagination';
import usePageTable from '@/hooks/usePageTable';
import { accessLevelMap } from '@/const';
import { getMembersInNamespace, saveUsersToNamespace, removeUserFromNamespace } from '@/api/user';

import AddUserDlg from './addUserDlg';
import './style.less';

const accessMap = Object.keys(accessLevelMap).map((v) => ({ value: v, text: accessLevelMap[v] }));

export default (props) => {
  const { info, type } = props;
  const { source_id } = info || {};
  const formRef: any = useRef();

  const { changePage, pageData, fetchQuery, setFetchQuery, loading } = usePageTable({
    reqMethod: getMembersInNamespace,
    dealReqData: useCallback(
      (args) => {
        const { name, currentPage } = args;
        const param: any = { currentPage, id: source_id, type };
        if (name) {
          param.name = name;
        }
        return param;
      },
      [source_id, type],
    ),
  });

  const changeAccess = useCallback(
    (param) => {
      param.type = type;
      saveUsersToNamespace(param)
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
    (uid) => {
      changeAccess({
        id: source_id,
        uid,
      });
    },
    [source_id, changeAccess],
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
                  id: source_id,
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
                removeUserFromNamespace({
                  gitUid: meta.id,
                  id: source_id,
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
    [changeAccess, setFetchQuery, source_id, type],
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
