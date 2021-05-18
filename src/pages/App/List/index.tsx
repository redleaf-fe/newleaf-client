import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Table, Dialog } from 'redleaf-rc';
import { getAppList } from '@/api/app';

import CreateDlg from './createDlg';
import './style.less';

const columns = [
  {
    title: '应用名称',
    columnKey: 'name',
  },
  {
    title: '创建时间',
    columnKey: 'createdAt',
  },
  {
    title: '创建人',
    columnKey: 'creator',
  },
];

export default () => {
  const [datasets, setDatasets] = useState([]);
  const dlgRef = useRef();

  useEffect(() => {
    getAppList().then((res) => {
      setDatasets(res);
    });
  }, []);

  const closeDlg = useCallback(() => {
    dlgRef.current?.();
  }, []);

  return (
    <div className="applist-container">
      <div>
        <Button
          onClick={() => {
            dlgRef.current = Dialog.show({
              content: <CreateDlg close={closeDlg} />,
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
