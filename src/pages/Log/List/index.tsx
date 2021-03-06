import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getAllApp } from '@/api/app';
import { getLog } from '@/api/log';
import { Form, Select, Button, Message, DateTime, Input } from 'redleaf-rc';
import { useSafeState } from 'redleaf-rc/dist/utils/hooks';
import usePageTable from '@/hooks/usePageTable';
import DatetimeRange from '@/components/datetimeRange';
import Pagination from '@/components/pagination';

import './style.less';

const detailArr = [
  { title: '时间：', key: 'time' },
  { title: 'IP：', key: 'ip' },
  { title: 'UA：', key: 'ua' },
  { title: 'referer：', key: 'referer' },
  { title: '内容：', key: 'content' },
  { title: '类型：', key: 'type' },
];

const logTypeArr = [
  { text: '通用', value: 'log' },
  { text: '错误', value: 'error' },
  { text: '性能', value: 'perf' },
  { text: '访问', value: 'visit' },
  { text: '路由', value: 'route' },
];

export default () => {
  const [appList, setAppList] = useSafeState({
    count: 0,
    data: [],
    // 已请求
    reqed: false,
  });

  const { changePage, pageData, fetchQuery, setFetchQuery } = usePageTable({
    reqMethod: getLog,
    dealReqData: useCallback((args) => {
      const { appId, currentPage, like, type } = args;
      const { startTime, endTime } = args.datetime || {};
      const param: any = { appId, currentPage };
      if (startTime) {
        param.startTime = new Date(startTime).getTime();
      }
      if (endTime) {
        param.endTime = new Date(endTime).getTime();
      }
      if (like) {
        param.like = like;
      }
      if (type) {
        param.type = type[0];
      }
      return param;
    }, []),
    reqCondition: useCallback((args) => {
      return args.appId;
    }, []),
  });

  const formRef: any = useRef();

  useEffect(() => {
    getAllApp()
      .then((res) => {
        if (res && res.length > 0) {
          setAppList({
            data: res.map((v) => ({ value: String(v.appId), text: v.appName })),
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

  return (
    <div className="log-container">
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
          <Form.Item name="datetime" label="时间：">
            <DatetimeRange />
          </Form.Item>
          <Form.Item name="type" label="日志类型：">
            <Select options={logTypeArr} />
          </Form.Item>
          <div>
            <Form.Item name="like" label="内容搜索：">
              <Input maxLength={50} />
            </Form.Item>
            <Button
              className="submit vertical-align-middle"
              onClick={() => {
                const { values } = formRef.current.getValues();
                const { app, datetime, like, type } = values || {};
                setFetchQuery({ appId: app[0], datetime, like, type, currentPage: 1 });
              }}
            >
              搜索
            </Button>
          </div>
        </Form>
      )}

      <div className="detail-container">
        {pageData.data.length > 0 ? (
          pageData.data.map((v, k) => {
            return (
              <div key={k} className="detail">
                {detailArr.map((vv, kk) => {
                  return (
                    <p key={kk}>
                      <span className="title">{vv.title}</span>
                      <span className="content">
                        {vv.key === 'time' ? DateTime.dayjs(v[vv.key]).format('YYYY-MM-DD HH:mm:ss') : v[vv.key]}
                      </span>
                    </p>
                  );
                })}
              </div>
            );
          })
        ) : (
          <span className="">暂无数据</span>
        )}
      </div>

      <Pagination
        totalItems={pageData.totalItems}
        type="complex"
        currentPage={fetchQuery.currentPage}
        onChange={changePage}
      />
    </div>
  );
};
