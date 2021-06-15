import React, { useCallback, useRef, useMemo } from 'react';
import { Form, Button, Table, Dialog, Message, Popup, Input } from 'redleaf-rc';
import { getPubishList, savePublish, deletePublish, publishDetail } from '@/api/publish';
import Pagination from '@/components/pagination';
import usePageTable from '@/hooks/usePageTable';
import dayjs from 'dayjs';

import CreateDlg from './createDlg';
import ManageDlg from './manageDlg';
import './style.less';

export default () => {
  const { changePage, pageData, fetchQuery, setFetchQuery } = usePageTable({
    reqData: {
      publishName: '',
    },
    reqMethod: getPubishList,
    dealReqData: useCallback((args) => {
      const { publishName, currentPage } = args;
      const param: any = { currentPage };
      if (publishName) {
        param.publishName = publishName;
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
      <Form
        layout="horizontal"
        getInstance={(i) => {
          formRef.current = i;
        }}
      >
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
