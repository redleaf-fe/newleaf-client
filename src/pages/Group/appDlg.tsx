import React, { useCallback, useRef, useMemo } from 'react';
import { Button, Table, Input, Form, Message } from 'redleaf-rc';
import Pagination from '@/components/pagination';
import usePageTable from '@/hooks/usePageTable';
import { getAppInGroup, shareAppWithGroup, delShareAppWithGroup } from '@/api/group';
import dayjs from 'dayjs';

export default (props) => {
  const { info } = props;
  const { source_id } = info;
  const { changePage, pageData, fetchQuery, setFetchQuery } = usePageTable({
    reqMethod: getAppInGroup,
    dealReqData: useCallback((args) => {
      const { name, currentPage } = args;
      const param: any = { currentPage, id: source_id };
      if (name) {
        param.name = name;
      }
      return param;
    }, [source_id]),
  });
  const formRef: any = useRef();

  const columns = useMemo(
    () => [
      {
        title: '应用名称',
        columnKey: 'source_name',
        grow: 1,
      },
      {
        title: '操作',
        columnKey: 'op',
        width: 200,
        render({ meta }) {
          return (
            <div className="operate">
              <div
                className="color-primary pointer"
                onClick={() => {
                  // dlgRef.current = Dialog.show({
                  //   content: <ManageDlg {...{ closeDlg, info: meta, type: 'group' }} />,
                  //   title: '成员管理',
                  //   innerClassName: 'dialog-side',
                  //   position: 'right',
                  // });
                }}
              >
                删除
              </div>
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="app-dlg">
      <div className="mb16">
        <Button
          onClick={() => {
            // dlgRef.current = Dialog.show({
            //   content: <CreateDlg {...{ closeDlg, getList, save: saveGroup }} />,
            //   title: '新增应用',
            // });
          }}
        >
          新增应用
        </Button>
      </div>
      {/*  */}
      <Form
        layout="horizontal"
        getInstance={(i) => {
          formRef.current = i;
        }}
      >
        <Form.Item name="name" label="应用名称：">
          <Input maxLength={20} />
        </Form.Item>
        <Button
          className="ml16 vertical-align-middle"
          onClick={() => {
            const { values } = formRef.current.getValues();
            setFetchQuery((t) => ({ ...t, name: values.name, currentPage: 1 }));
          }}
        >
          搜索
        </Button>
      </Form>
      {/*  */}
      <Table columns={columns} datasets={pageData.data} bordered="row" />
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
