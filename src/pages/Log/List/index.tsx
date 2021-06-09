import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getAppList } from '@/api/app';
import { getLog } from '@/api/log';
import { Form, Select, Button, Message, DateTime, Input } from 'redleaf-rc';
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
  const [appList, setAppList] = useState([]);
  const [fetchQuery, setFetchQuery] = useState({
    appName: '',
    currentPage: 1,
    datetime: '',
    like: '',
    type: '',
  });
  const [pageData, setPageData] = useState({
    totalItems: 0,
    data: [],
  });

  const formRef = useRef({});

  const fetchLog = useCallback(({ appName, currentPage, datetime, like, type }) => {
    const { startTime, endTime } = datetime || {};
    const param = { appName, currentPage };
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
    getLog(param)
      .then((res2) => {
        const { count, rows } = res2;
        setPageData({
          totalItems: count,
          data: rows,
        });
      })
      .catch((e) => {
        Message.show({ title: e.message });
      });
  }, []);

  useEffect(() => {
    if (fetchQuery.appName) {
      fetchLog(fetchQuery);
    }
  }, [fetchQuery, fetchLog]);

  useEffect(() => {
    getAppList()
      .then((res) => {
        if (res.length > 0) {
          setAppList(res.map((v) => ({ value: v.appName, text: v.appName })));
          setFetchQuery((t) => ({ ...t, appName: res[0].appName }));
          fetchLog({ currentPage: 1, appName: res[0].appName });
        }
      })
      .catch((e) => {
        Message.show({ title: e.message });
      });
  }, [fetchLog]);

  const changePage = useCallback(({ page }) => {
    setFetchQuery((t) => ({ ...t, currentPage: page }));
  }, []);

  return (
    <div className="log-container">
      {appList.length > 0 && (
        <Form
          layout="horizontal"
          className="log-form"
          defaultValue={{ appName: [appList[0].value] }}
          getInstance={(i) => {
            formRef.current = i;
          }}
        >
          <Form.Item name="appName" label="应用名称：">
            <Select options={appList} />
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
              className="submit"
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
      <div className="page">
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

      <div className="page">
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
