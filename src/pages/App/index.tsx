import React, { useCallback, useRef, useMemo } from 'react';
import { Form, Button, Table, Dialog, Message, Input } from 'redleaf-rc';
import { getAppList, appDetail } from '@/api/app';
import Pagination from '@/components/pagination';
import usePageTable from '@/hooks/usePageTable';
import dayjs from 'dayjs';

import CreateDlg from './createDlg';
import ManageDlg from './manageDlg';
import './style.less';

export default () => {
  const { changePage, pageData, fetchQuery, setFetchQuery } = usePageTable({
    reqData: {
      appName: '',
    },
    reqMethod: getAppList,
    dealReqData: useCallback((args) => {
      const { appName, currentPage } = args;
      const param: any = { currentPage };
      if (appName) {
        param.appName = appName;
      }
      return param;
    }, []),
  });

  const formRef: any = useRef();
  const dlgRef: any = useRef();

  const getList = useCallback(
    (page) => {
      setFetchQuery((t) => ({ ...t, currentPage: page || t.currentPage }));
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
        title: 'appId',
        columnKey: 'id',
        grow: 1,
      },
      {
        title: '最后更新时间',
        columnKey: 'updatedAt',
        width: '180px',
        render({ meta }) {
          return <div>{dayjs(meta.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</div>;
        },
      },
      {
        title: '仓库地址',
        columnKey: 'git',
        width: '30%',
        render({ meta }) {
          return <div className="gitAddress">{meta.git}</div>;
        },
      },
      {
        title: '操作',
        columnKey: 'op',
        width: '100px',
        render({ meta }) {
          return (
            <div className="operate">
              <div
                className="color-primary pointer"
                onClick={() => {
                  dlgRef.current = Dialog.show({
                    content: <ManageDlg {...{ closeDlg, appInfo: meta }} />,
                    title: '成员管理',
                    innerClassName: 'dialog-side',
                    position: 'right',
                  });
                }}
              >
                成员管理
              </div>
              <div className="color-primary pointer" onClick={() => {}}>
                部署配置
              </div>
              <div
                className="color-primary pointer"
                onClick={() => {
                  appDetail({ id: meta.id })
                    .then((res) => {
                      res.desc = res.desc || '';
                      res.git = res.git || '';
                      dlgRef.current = Dialog.show({
                        content: <CreateDlg {...{ closeDlg, getList, info: { ...res, id: meta.id } }} />,
                        title: '编辑应用',
                      });
                    })
                    .catch((e) => {
                      Message.show({ title: e.message });
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
    <div className="applist-container">
      <div className="mb16">
        <Button
          onClick={() => {
            dlgRef.current = Dialog.show({
              content: <CreateDlg {...{ closeDlg, getList }} />,
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
        <Form.Item name="appName" label="应用名称：">
          <Input maxLength={50} />
        </Form.Item>
        <Button
          className="ml16 vertical-align-middle"
          onClick={() => {
            const { values } = formRef.current.getValues();
            setFetchQuery((t) => ({ ...t, appName: values.appName }));
          }}
        >
          搜索
        </Button>
      </Form>
      {/*  */}
      <div className="text-align-right mb8">
        <Pagination
          totalItems={pageData.totalItems}
          type="complex"
          currentPage={fetchQuery.currentPage}
          onChange={changePage}
        />
      </div>
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
