import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Table, Dialog, Message } from 'redleaf-rc';
import { getAppList } from '@/api/app';
import dayjs from 'dayjs';

import CreateDlg from './createDlg';
import './style.less';

const columns = [
  {
    title: '应用名称',
    columnKey: 'appName',
    width: '300px',
  },
  {
    title: '最后更新时间',
    columnKey: 'updatedAt',
    width: '200px',
    render({ meta }) {
      return <div>{dayjs(meta.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</div>;
    },
  },
  {
    title: '仓库地址',
    columnKey: 'git',
    width: '30%',
    render({ meta }) {
      return <div className="gitAddress">{meta.git}</div>;
    },
  },
  {
    title: '操作',
    columnKey: 'op',
    width: '100px',
    render({ meta }) {
      return (
        <div className="operate">
          <span className="color-primary pointer mr8" onClick={() => {}}>
            编辑
          </span>
          |
          <span className="color-danger pointer ml8" onClick={() => {}}>
            删除
          </span>
        </div>
      );
    },
  },
];

export default () => {
  const [datasets, setDatasets] = useState([]);
  const dlgRef = useRef();

  const getList = useCallback(() => {
    getAppList()
      .then((res) => {
        setDatasets(res);
      })
      .catch((e) => {
        Message.show({ title: e.message });
      });
  }, []);

  useEffect(getList, [getList]);

  const closeDlg = useCallback(() => {
    dlgRef.current?.();
  }, []);

  return (
    <div className="applist-container">
      <div className="mb16">
        <Button
          onClick={() => {
            dlgRef.current = Dialog.show({
              content: <CreateDlg {...{ closeDlg, getList }} />,
              title: '新建应用',
            });
          }}
        >
          新建应用
        </Button>
      </div>
      <Table columns={columns} datasets={datasets} bordered="row" />
    </div>
  );
};
