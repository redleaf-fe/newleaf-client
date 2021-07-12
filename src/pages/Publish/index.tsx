import React, { useCallback, useRef, useMemo, useEffect } from 'react';
import { Form, Button, Table, Dialog, Message, Tabs, Input, Select } from 'redleaf-rc';
import { useSafeState } from 'redleaf-rc/dist/utils/hooks';
import { getPubishList, publish, build } from '@/api/publish';
import { getAllApp } from '@/api/app';
import Pagination from '@/components/pagination';
import usePageTable from '@/hooks/usePageTable';
import dayjs from 'dayjs';
import cls from 'classnames';

import CreateDlg from './createDlg';
import './style.less';

const publishMap = {
  pending: '发布',
  doing: '发布中',
  done: '已发布',
  fail: '发布失败',
};

function Publish(props) {
  const { env, approve } = props;
  const [appList, setAppList] = useSafeState({
    count: 0,
    data: [],
    // 已请求
    reqed: false,
  });
  const { changePage, pageData, fetchQuery, setFetchQuery, loading } = usePageTable({
    reqMethod: getPubishList,
    dealReqData: useCallback(
      (args) => {
        const { appId, currentPage } = args;
        const param: any = { appId, env, currentPage };
        return param;
      },
      [env],
    ),
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
            data: res.map((v) => ({ value: JSON.stringify(v), text: v.appName })),
            reqed: true,
          });
          setFetchQuery({ appId: res[0].appId });
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
        title: '关联应用',
        columnKey: 'appName',
        grow: 1,
      },
      {
        title: '描述',
        columnKey: 'desc',
        grow: 1,
      },
      {
        title: '分支',
        columnKey: 'branch',
        grow: 1,
      },
      {
        title: '提交',
        columnKey: 'commit',
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
        title: '操作',
        columnKey: 'op',
        width: 100,
        render({ meta }) {
          return (
            <>
              <div
                onClick={() => {
                  build({ id: meta.id })
                    .then((res) => {
                      Message.error(res.message);
                    })
                    .catch((e) => {
                      Message.error(e.message);
                    });
                }}
              >
                <a href="" target="_blank" rel="noopener noreferrer">
                  打包
                </a>
              </div>
              <div
                className={cls('color-primary pointer', {
                  'color-success': meta.status === 'done',
                  'color-danger': meta.status === 'fail',
                })}
                onClick={() => {
                  if (meta.status === 'pending') {
                    publish({ id: meta.id })
                      .then((res) => {
                        Message.error(res.message);
                      })
                      .catch((e) => {
                        Message.error(e.message);
                      });
                  }
                }}
              >
                {publishMap[meta.status]}
              </div>
              {env === 'prod' && (
                <div className="color-primary pointer" onClick={() => {}}>
                  审核
                </div>
              )}
            </>
          );
        },
      },
    ],
    [env],
  );

  return (
    <div className="publishlist-container">
      <div className="mb16">
        <Button
          onClick={() => {
            dlgRef.current = Dialog.show({
              content: <CreateDlg {...{ closeDlg, getList, appList: appList.data, env }} />,
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
          className="mb16"
          layout="horizontal"
          defaultValue={{ app: appList.data[0] ? [appList.data[0].value] : [] }}
          getInstance={(i) => {
            formRef.current = i;
          }}
        >
          <Form.Item name="app" label="应用名称：">
            <Select options={appList.data} />
          </Form.Item>
          <Button
            className="ml16 vertical-align-middle"
            onClick={() => {
              const { values } = formRef.current.getValues();
              setFetchQuery({ appId: JSON.parse(values.app[0]).appId, currentPage: 1 });
            }}
          >
            搜索
          </Button>
        </Form>
      )}
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
}

const envOptions = [
  {
    value: 'daily',
    text: '日常',
  },
  {
    value: 'pre',
    text: '预发',
  },
  {
    value: 'perf',
    text: '性能',
  },
  {
    value: 'prod',
    text: '生产',
  },
];

export default () => {
  const [state, setState] = useSafeState({
    tabValue: 'pre',
  });

  return (
    <div className="publishdetail-container">
      <Tabs
        options={envOptions}
        value={state.tabValue}
        onChange={({ value }) => {
          setState({ tabValue: value });
        }}
      />
      <Publish env={state.tabValue} approve={state.tabValue === 'prod'} />
    </div>
  );
};
