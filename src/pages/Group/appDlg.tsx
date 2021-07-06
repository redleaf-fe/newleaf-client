import React, { useCallback, useRef, useMemo } from 'react';
import { Button, Table, Input, Form, Message, Dialog, Popup } from 'redleaf-rc';
import Pagination from '@/components/pagination';
import usePageTable from '@/hooks/usePageTable';
import { getAppInGroup, shareAppWithGroup, delShareAppWithGroup } from '@/api/group';

import AddAppDlg from './addAppDlg';

export default (props) => {
  const { info } = props;
  const { source_id } = info;
  const { changePage, pageData, fetchQuery, setFetchQuery, loading } = usePageTable({
    reqMethod: getAppInGroup,
    dealReqData: useCallback(
      (args) => {
        const { name, currentPage } = args;
        const param: any = { currentPage, id: source_id };
        if (name) {
          param.name = name;
        }
        return param;
      },
      [source_id],
    ),
  });
  const formRef: any = useRef();

  const getList = useCallback(
    (page?) => {
      setFetchQuery({ currentPage: page });
    },
    [setFetchQuery],
  );

  const columns = useMemo(
    () => [
      {
        title: '应用名称',
        columnKey: 'name',
        grow: 1,
      },
      {
        title: '操作',
        columnKey: 'op',
        width: 200,
        render({ meta }) {
          return (
            <div className="operate">
              <Popup
                onOk={() => {
                  delShareAppWithGroup({ id: meta.id, group_id: info.source_id })
                    .then((res) => {
                      getList();
                      Message.success(res.message);
                    })
                    .catch((e) => {
                      Message.error(e.message);
                    });
                }}
              >
                <Button type="danger">删除</Button>
              </Popup>
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
            Dialog.show({
              content: <AddAppDlg {...{ getList, save: shareAppWithGroup, info }} />,
              title: '新增应用',
            });
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
            setFetchQuery({ name: values.name, currentPage: 1 });
          }}
        >
          搜索
        </Button>
      </Form>
      {/*  */}
      <Table columns={columns} datasets={pageData.data} loading={loading} />
      <Pagination
        totalItems={pageData.totalItems}
        type="complex"
        currentPage={fetchQuery.currentPage}
        onChange={changePage}
      />
    </div>
  );
};
