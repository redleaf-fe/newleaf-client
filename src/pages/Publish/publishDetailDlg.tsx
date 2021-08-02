import React, { useCallback, useMemo } from 'react';
import { Button, Table, Message } from 'redleaf-rc';
import { useSafeState } from 'redleaf-rc/dist/utils/hooks';
import { getAppBranch, getAppCommit } from '@/api/app';
import { publishDetail } from '@/api/publish';
import Pagination from '@/components/pagination';
import usePageTable from '@/hooks/usePageTable';

export default (props) => {
  const { closeDlg, id } = props;
  const { changePage, pageData, fetchQuery, loading } = usePageTable({
    reqMethod: publishDetail,
    dealReqData: useCallback((args) => {
      const { currentPage } = args;
      const param: any = { id, currentPage };
      return param;
    }, [id]),
  });

  const columns = useMemo(
    () => [
      {
        title: '机器地址及位置',
        columnKey: 'server',
        grow: 1,
      },
      {
        title: '状态',
        columnKey: 'published',
        grow: 1,
        render({ meta }) {
          return <div>{meta.published ? <div className="color-success">已完成</div> : '未完成'}</div>;
        },
      },
    ],
    [],
  );

  return (
    <div className="publish-detail-dlg dialog-center">
      <Table columns={columns} datasets={pageData.data || []} loading={loading} />
      <Pagination
        totalItems={pageData.totalItems}
        type="complex"
        currentPage={fetchQuery.currentPage}
        onChange={changePage}
      />
    </div>
  );
};
