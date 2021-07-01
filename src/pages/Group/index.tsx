import React, { useCallback, useRef, useMemo } from 'react';
import { Form, Button, Table, Dialog, Message, Input } from 'redleaf-rc';
import { getGroupList, getGroupDetail, saveGroup } from '@/api/group';
import Pagination from '@/components/pagination';
import usePageTable from '@/hooks/usePageTable';
import dayjs from 'dayjs';
import { accessLevelMap } from '@/const';

import CreateDlg from '../Namespace/createDlg';
import ManageDlg from '../Namespace/manageDlg';
import AppDlg from './appDlg';

import './style.less';

export default () => {
  const { changePage, pageData, fetchQuery, setFetchQuery, loading } = usePageTable({
    reqMethod: getGroupList,
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
                    content: <ManageDlg {...{ closeDlg, info: meta, type: 'group' }} />,
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
                        content: (
                          <CreateDlg
                            {...{ closeDlg, getList, save: saveGroup, info: { ...res, id: meta.source_id } }}
                          />
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
    <div className="group-container">
      <div className="mb16">
        <Button
          onClick={() => {
            dlgRef.current = Dialog.show({
              content: <CreateDlg {...{ closeDlg, getList, save: saveGroup }} />,
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
        <Form.Item name="name" label="分组名称：">
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
