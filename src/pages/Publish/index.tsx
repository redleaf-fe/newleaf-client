import React, { useCallback, useRef, useMemo, useState, useEffect } from 'react';
import { Form, Button, Table, Dialog, Message, Popup, Input, Select } from 'redleaf-rc';
import { useSafeState } from 'redleaf-rc/dist/utils/hooks';
import { getPubishList, savePublish, publishDetail } from '@/api/publish';
import { getAllApp } from '@/api/app';
import DatetimeRange from '@/components/datetimeRange';
import Pagination from '@/components/pagination';
import usePageTable from '@/hooks/usePageTable';
import { maxPageSize } from '@/const';
import dayjs from 'dayjs';

import CreateDlg from './createDlg';
import ManageDlg from './manageDlg';
import './style.less';

export default () => {
  const [appList, setAppList] = useSafeState({
    count: 0,
    data: [],
    // 已请求
    reqed: false,
  });
  const { changePage, pageData, fetchQuery, setFetchQuery, loading } = usePageTable({
    reqMethod: getPubishList,
    dealReqData: useCallback((args) => {
      const { appId, publishName, currentPage } = args;
      const param: any = { appId, currentPage };
      if (publishName) {
        param.publishName = publishName;
      }
      return param;
    }, []),
    reqCondition: useCallback((args) => {
      return args.appId;
    }, []),
  });

  const formRef: any = useRef();
  const dlgRef: any = useRef();

  useEffect(() => {
    getAllApp()
      .then((res) => {
        if (res && res.length > 0) {
          setAppList({
            data: res.map((v) => ({ value: String(v.source_id), text: v.source_name })),
            reqed: true,
          });
          setFetchQuery({ appId: res[0].id });
        }
      })
      .catch((e) => {
        setAppList({ reqed: true });
        Message.error(e.message);
      });
  }, [setFetchQuery, setAppList]);

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
        title: '发布名称',
        columnKey: 'publishName',
        grow: 1,
      },
      {
        title: '关联应用',
        columnKey: 'name',
      },
      {
        title: '更新时间',
        columnKey: 'updatedAt',
        width: 180,
        render({ meta }) {
          return <div>{dayjs(meta.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</div>;
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
                  publishDetail({ id: meta.id })
                    .then((res) => {
                      res.desc = res.desc || '';
                      dlgRef.current = Dialog.show({
                        content: <CreateDlg {...{ closeDlg, getList, info: { ...res, id: meta.id } }} />,
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
    <div className="publishlist-container">
      <div className="mb16">
        <Button
          onClick={() => {
            dlgRef.current = Dialog.show({
              content: <CreateDlg {...{ closeDlg, getList, appList: appList.data }} />,
              title: '新建发布',
            });
          }}
        >
          新建发布
        </Button>
      </div>
      {/*  */}
      {appList.reqed && (
        <Form
          layout="horizontal"
          defaultValue={{ app: appList.data[0] ? [appList.data[0].value] : [] }}
          getInstance={(i) => {
            formRef.current = i;
          }}
        >
          <Form.Item name="app" label="应用名称：">
            <Select options={appList.data} />
          </Form.Item>
          <Form.Item name="datetime" label="发布时间：">
            <DatetimeRange />
          </Form.Item>
          <Form.Item name="publishName" label="发布名称：">
            <Input maxLength={50} />
          </Form.Item>
          <Button
            className="ml16 vertical-align-middle"
            onClick={() => {
              const { values } = formRef.current.getValues();
              setFetchQuery({ publishName: values.publishName, currentPage: 1 });
            }}
          >
            搜索
          </Button>
        </Form>
      )}
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
