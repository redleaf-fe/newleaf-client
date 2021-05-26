import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getAppList } from '@/api/app';
import { getLog } from '@/api/log';
import { Form, Select, Button, Message, DateTime } from 'redleaf-rc';
import DatetimeRange from '@/components/datetimeRange';
import Pagination from '@/components/pagination';

import './style.less';

const detailArr = [
  { title: '时间：', key: 'time' },
  { title: 'IP：', key: 'ip' },
  { title: 'UA：', key: 'ua' },
  { title: 'referer：', key: 'referer' },
  { title: '内容：', key: 'content' },
];

export default () => {
  const [appList, setAppList] = useState([]);
  const [fetchQuery, setFetchQuery] = useState({
    appName: '',
    currentPage: 1,
    datetime: '',
  });
  const [pageData, setPageData] = useState({
    totalItems: 0,
    data: [],
  });

  const formRef = useRef({});

  const fetchLog = useCallback(({ appName, currentPage, datetime }) => {
    const { startTime, endTime } = datetime || {};
    const param = { appName, currentPage, startTime, endTime };
    if (startTime) {
      param.startTime = new Date(startTime).getTime();
    }
    if (endTime) {
      param.endTime = new Date(endTime).getTime();
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
  }, []);

  const changePage = useCallback(
    ({ page }) => {
      fetchLog({ ...fetchQuery, currentPage: page });
      setFetchQuery((t) => ({ ...t, currentPage: page }));
    },
    [fetchQuery, fetchLog],
  );

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
          <Button
            className="submit"
            onClick={() => {
              const { values } = formRef.current.getValues();
              const { appName, datetime } = values || {};
              fetchLog({ ...fetchQuery, appName: appName[0], datetime, currentPage: 1 });
              setFetchQuery((t) => ({ ...t, appName: appName[0], datetime, currentPage: 1 }));
            }}
          >
            搜索
          </Button>
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

      <div>
        {(pageData.data || []).map((v, k) => {
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
        })}
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
