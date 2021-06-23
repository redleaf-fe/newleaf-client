import React, { useCallback, useRef, useMemo } from 'react';
import { Form, Button, Table, Dialog, Message, Popup, Input } from 'redleaf-rc';
import { appDetail } from '@/api/app';
import { getGroupList } from '@/api/group';
import { accessLevelMap } from '@/const';
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
    reqMethod: getGroupList,
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
        title: '分组名称',
        columnKey: 'source_name',
        width: '400px',
      },
      {
        title: '权限',
        columnKey: 'access_level',
        width: '400px',
        render({ meta }) {
          return <div>{accessLevelMap[meta.access_level]}</div>;
        },
      },
      {
        title: '操作',
        columnKey: 'op',
        grow: 1,
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
                应用列表
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
    <div className="group-container">
      <div className="mb16">
        <Button
          onClick={() => {
            dlgRef.current = Dialog.show({
              content: <CreateDlg {...{ closeDlg, getList }} />,
              title: '新建分组',
            });
          }}
        >
          新建分组
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
