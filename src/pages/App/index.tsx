import React, { useCallback, useRef, useMemo } from 'react';
import { Form, Button, Table, Dialog, Message, Input } from 'redleaf-rc';
import { getAppList, getAppDetail, saveApp } from '@/api/app';
import Pagination from '@/components/pagination';
import usePageTable from '@/hooks/usePageTable';
import dayjs from 'dayjs';
import { accessLevelMap } from '@/const';

import CreateDlg from './createDlg';
import ManageDlg from './manageDlg';
import ApproveDlg from '../Dialogs/approveDlg';
import './style.less';

export default () => {
  const { changePage, pageData, fetchQuery, setFetchQuery, loading } = usePageTable({
    reqMethod: getAppList,
    dealReqData: useCallback((args) => {
      const { name, currentPage } = args;
      const param: any = { currentPage };
      if (name) {
        param.name = name;
      }
      return param;
    }, []),
  });

  const formRef: any = useRef();
  const dlgRef: any = useRef();

  const getList = useCallback(
    (page) => {
      setFetchQuery({ currentPage: page });
    },
    [setFetchQuery],
  );

  const closeDlg = useCallback(() => {
    dlgRef.current?.();
  }, []);

  const columns = useMemo(
    () => [
      {
        title: '应用名称',
        columnKey: 'appName',
        grow: 1,
      },
      {
        title: '更新时间',
        columnKey: 'updatedAt',
        grow: 1,
        render({ meta }) {
          return <div>{dayjs(meta.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</div>;
        },
      },
      {
        title: '编辑人',
        columnKey: 'updater',
        grow: 1,
      },
      {
        title: '权限',
        columnKey: 'auth',
        grow: 1,
        render({ meta }) {
          return <div>{accessLevelMap[meta.auth]}</div>;
        },
      },
      {
        title: '操作',
        columnKey: 'op',
        width: 100,
        render({ meta }) {
          return (
            <div className="operate">
              <div
                className="color-primary pointer"
                onClick={() => {
                  dlgRef.current = Dialog.show({
                    content: <ManageDlg {...{ closeDlg, info: meta, type: 'app' }} />,
                    title: '成员管理',
                    innerClassName: 'dialog-side',
                    position: 'right',
                  });
                }}
              >
                成员管理
              </div>
              <div
                className="color-primary pointer"
                onClick={() => {
                  dlgRef.current = Dialog.show({
                    content: <ApproveDlg {...{ closeDlg, info: meta }} />,
                    title: '审核配置',
                    innerClassName: 'dialog-side add-approve-user-dlg',
                    position: 'right',
                  });
                }}
              >
                审核配置
              </div>
              <div className="color-primary pointer" onClick={() => {}}>
                机器配置
              </div>
              <div
                className="color-primary pointer"
                onClick={() => {
                  getAppDetail({ id: meta.appId })
                    .then((res) => {
                      res.desc = res.desc || '';
                      dlgRef.current = Dialog.show({
                        content: (
                          <CreateDlg {...{ closeDlg, getList, save: saveApp, info: { ...res, id: meta.appId } }} />
                        ),
                        title: '编辑应用',
                      });
                    })
                    .catch((e) => {
                      Message.error(e.message);
                    });
                }}
              >
                编辑
              </div>
            </div>
          );
        },
      },
    ],
    [closeDlg, getList],
  );

  return (
    <div className="app-container">
      <div className="mb16">
        <Button
          onClick={() => {
            dlgRef.current = Dialog.show({
              content: <CreateDlg {...{ closeDlg, getList, save: saveApp }} />,
              title: '新建应用',
            });
          }}
        >
          新建应用
        </Button>
      </div>
      {/*  */}
      <Form
        layout="horizontal"
        getInstance={(i) => {
          formRef.current = i;
        }}
      >
        <Form.Item name="name" label="应用名称：">
          <Input maxLength={20} />
        </Form.Item>
        <Button
          className="ml16 vertical-align-middle"
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
