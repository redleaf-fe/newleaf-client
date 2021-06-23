import React, { useCallback, useRef, useMemo } from 'react';
import { Form, Button, Table, Dialog, Message, Input } from 'redleaf-rc';
import { getGroupList, getGroupDetail } from '@/api/group';
import { accessLevelMap } from '@/const';
import Pagination from '@/components/pagination';
import usePageTable from '@/hooks/usePageTable';
import dayjs from 'dayjs';

import CreateDlg from './createDlg';
import ManageDlg from './manageDlg';
import AppDlg from './appDlg';
import './style.less';

export default () => {
  const { changePage, pageData, fetchQuery, setFetchQuery } = usePageTable({
    reqMethod: getGroupList,
  });

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
        grow: 1,
      },
      {
        title: '更新时间',
        columnKey: 'updatedAt',
        width: 200,
        render({ meta }) {
          return <div>{dayjs(meta.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</div>;
        },
      },
      {
        title: '编辑人',
        columnKey: 'updater',
        width: 200,
      },
      {
        title: '权限',
        columnKey: 'access_level',
        width: 200,
        render({ meta }) {
          return <div>{accessLevelMap[meta.access_level]}</div>;
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
                    content: <ManageDlg {...{ closeDlg, info: meta }} />,
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
                    content: <AppDlg {...{ closeDlg, info: meta }} />,
                    title: '应用管理',
                    innerClassName: 'dialog-side',
                    position: 'right',
                  });
                }}
              >
                应用管理
              </div>
              <div
                className="color-primary pointer"
                onClick={() => {
                  getGroupDetail({ id: meta.source_id })
                    .then((res) => {
                      res.desc = res.desc || '';
                      dlgRef.current = Dialog.show({
                        content: <CreateDlg {...{ closeDlg, getList, info: { ...res, id: meta.source_id } }} />,
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
