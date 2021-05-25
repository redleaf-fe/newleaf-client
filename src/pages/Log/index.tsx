import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getAppList } from '@/api/app';
import { getLog } from '@/api/log';
import { Form, Pagination, DateTime, Select, Button, Message } from 'redleaf-rc';

import './style.less';

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
    getLog({ appName, currentPage, datetime })
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
            <DateTime />
          </Form.Item>
          <Button
            className="submit"
            onClick={() => {
              const { values } = formRef.current.getValues();
              const { appName, datetime } = values || {};
              fetchLog({ ...fetchQuery, appName: appName[0], datetime });
              setFetchQuery((t) => ({ ...t, appName: appName[0], datetime }));
            }}
          >
            搜索
          </Button>
        </Form>
      )}
      <Pagination
        totalItems={pageData.totalItems}
        onChange={({ page }) => {
          fetchLog({ ...fetchQuery, currentPage: page });
          setFetchQuery((t) => ({ ...t, currentPage: page }));
        }}
      />
    </div>
  );
};
