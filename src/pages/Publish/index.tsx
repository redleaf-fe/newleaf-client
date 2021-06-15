import React, { useCallback, useRef, useMemo, useState, useEffect } from 'react';
import { Form, Button, Table, Dialog, Message, Popup, Input, Select } from 'redleaf-rc';
import { getPubishList, savePublish, deletePublish, publishDetail } from '@/api/appPublish';
import { getAppList } from '@/api/app';
import DatetimeRange from '@/components/datetimeRange';
import Pagination from '@/components/pagination';
import usePageTable from '@/hooks/usePageTable';
import { maxPageSize } from '@/const';
import dayjs from 'dayjs';

import CreateDlg from './createDlg';
import ManageDlg from './manageDlg';
import './style.less';

export default () => {
  const [appList, setAppList] = useState({
    count: 0,
    data: [],
    // 已请求
    reqed: false,
  });
  const { changePage, pageData, fetchQuery, setFetchQuery } = usePageTable({
    reqData: {
      publishName: '',
      appId: '',
    },
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
    getAppList({ currentPage: 1, pageSize: maxPageSize })
      .then((res) => {
        if (res.count > 0) {
          setAppList((t) => ({
            ...t,
            data: res.rows.map((v) => ({ value: v.id, text: v.appName })),
            reqed: true,
          }));
          setFetchQuery((t) => ({ ...t, appId: res.rows[0].id }));
        }
      })
      .catch((e) => {
        setAppList((t) => ({ ...t, reqed: true }));
        Message.show({ title: e.message });
      });
  }, [setFetchQuery]);

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
        title: '发布名称',
        columnKey: 'publishName',
        grow: 1,
      },
      {
        title: '关联应用',
        columnKey: 'appName',
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
                  publishDetail({ id: meta.id })
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
              <Popup
                onOk={() => {
                  deletePublish({ id: meta.id })
                    .then((res) => {
                      Message.show({ title: res.message });
                      getList(1);
                    })
                    .catch((e) => {
                      Message.show({ title: e.message });
                    });
                }}
              >
                <div className="color-danger pointer">删除</div>
              </Popup>
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
              content: <CreateDlg {...{ closeDlg, getList }} />,
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
          defaultValue={{ appName: [appList.data[0].value] }}
          getInstance={(i) => {
            formRef.current = i;
          }}
        >
          <Form.Item name="appName" label="应用名称：">
            <Select options={appList.data} />
          </Form.Item>
          <Form.Item name="datetime" label="时间：">
            <DatetimeRange />
          </Form.Item>
          <Form.Item name="publishName" label="发布名称：">
            <Input maxLength={50} />
          </Form.Item>
          <Button
            className="ml16 vertical-align-middle"
            onClick={() => {
              const { values } = formRef.current.getValues();
              setFetchQuery((t) => ({ ...t, publishName: values.publishName }));
            }}
          >
            搜索
          </Button>
        </Form>
      )}
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
