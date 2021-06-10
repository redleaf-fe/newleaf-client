import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getAppList } from '@/api/app';
import { getLog } from '@/api/log';
import { Form, Select, Button, Message, DateTime, Input } from 'redleaf-rc';
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
  const [appList, setAppList] = useState({
    count: 0,
    data: [],
    // 已请求
    reqed: false,
  });

  const { changePage, pageData, fetchQuery, setFetchQuery } = usePageTable({
    reqData: {
      appName: '',
      datetime: '',
      like: '',
      type: '',
    },
    reqMethod: getLog,
    dealReqData: useCallback((args) => {
      const { appName, currentPage, like, type } = args;
      const { startTime, endTime } = args.datetime || {};
      const param: any = { appName, currentPage };
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
      return args.appName;
    }, []),
  });

  const formRef = useRef();

  useEffect(() => {
    getAppList({ currentPage: 1 })
      .then((res) => {
        if (res.count > 0) {
          setAppList((t) => ({
            ...t,
            data: res.rows.map((v) => ({ value: v.appName, text: v.appName })),
            reqed: true,
          }));
          setFetchQuery((t) => ({ ...t, appName: res.rows[0].appName }));
        }
      })
      .catch((e) => {
        setAppList((t) => ({ ...t, reqed: true }));
        Message.show({ title: e.message });
      });
  }, [setFetchQuery]);

  return (
    <div className="log-container">
      {appList.reqed && (
        <Form
          layout="horizontal"
          className="log-form"
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
                const { appName, datetime, like, type } = values || {};
                setFetchQuery((t) => ({ ...t, appName: appName[0], datetime, like, type, currentPage: 1 }));
              }}
            >
              搜索
            </Button>
          </div>
        </Form>
      )}
      <div className="text-align-right">
        <Pagination
          totalItems={pageData.totalItems}
          type="complex"
          currentPage={fetchQuery.currentPage}
          onChange={changePage}
        />
      </div>

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
                        {vv.key === 'time' ? DateTime.dayjs(+v[vv.key]).format('YYYY-MM-DD HH:mm:ss') : v[vv.key]}
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
