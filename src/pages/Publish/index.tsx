import React, { useCallback, useRef, useMemo, useEffect } from 'react';
import { Form, Button, Table, Dialog, Message, Tabs, Select } from 'redleaf-rc';
import { useSafeState } from 'redleaf-rc/dist/utils/hooks';
import { getPublishList, publish, build } from '@/api/publish';
import { getAllApp } from '@/api/app';
import Pagination from '@/components/pagination';
import usePageTable from '@/hooks/usePageTable';
import dayjs from 'dayjs';
import cls from 'classnames';

import CreateDlg from './createDlg';
import './style.less';

const publishMap = {
  pending: '未发布',
  doing: '发布中',
  done: '发布成功',
  fail: '发布失败',
};

const buildMap = {
  pending: '未打包',
  doing: '打包中',
  fail: '打包失败',
  done: '打包成功',
};

function Publish(props) {
  const { env, approve } = props;
  const [appList, setAppList] = useSafeState({
    count: 0,
    data: [],
    // 已请求
    reqed: false,
  });
  const { changePage, pageData, fetchQuery, setFetchQuery, fetchMethod } = usePageTable({
    reqMethod: getPublishList,
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

  useEffect(() => {
    const timer = setInterval(() => {
      fetchMethod(fetchQuery);
    }, 2000);

    return () => {
      clearInterval(timer);
    };
  }, [fetchMethod, fetchQuery]);

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
        title: '打包结果',
        columnKey: 'buildStatus',
        grow: 1,
        render({ meta }) {
          return (
            <div
              className={cls({
                'color-danger': meta.buildStatus === 'fail',
                'color-success': meta.buildStatus === 'done',
              })}
            >
              {buildMap[meta.buildStatus]}
            </div>
          );
        },
      },
      {
        title: '发布结果',
        columnKey: 'status',
        grow: 1,
        render({ meta }) {
          return (
            <div
              className={cls({
                'color-danger': meta.status === 'fail',
                'color-success': meta.status === 'done',
              })}
            >
              {publishMap[meta.status]}
            </div>
          );
        },
      },
      {
        title: '操作',
        columnKey: 'op',
        width: 100,
        render({ meta }) {
          return (
            <>
              {['pending', 'fail'].includes(meta.buildStatus) && (
                <div
                  className="color-primary pointer"
                  onClick={() => {
                    build({ id: meta.id }).catch((e) => {
                      Message.error(e.message);
                    });
                  }}
                >
                  <a
                    className="text-deco-none color-primary"
                    href={`#/buildDetail?id=${meta.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    打包
                  </a>
                </div>
              )}
              {['done', 'fail'].includes(meta.buildStatus) && (
                <a
                  className="block text-deco-none color-primary"
                  href={`#/buildDetail?id=${meta.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  打包日志
                </a>
              )}
              {env === 'prod' && (
                <div className="color-primary pointer" onClick={() => {}}>
                  审核
                </div>
              )}
              {['pending', 'fail'].includes(meta.status) && (
                <div
                  onClick={() => {
                    publish({ id: meta.id }).catch((e) => {
                      Message.error(e.message);
                    });
                  }}
                >
                  <a
                    className="text-deco-none color-primary"
                    href="#/publishDetail"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    发布
                  </a>
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
      <Table columns={columns} datasets={pageData.data} />
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
