import React, { useCallback, useMemo, useRef } from 'react';
import { Button, Dialog, Input, Message, Table, Popup } from 'redleaf-rc';
import { getAppServer, saveAppServer, deleteServer } from '@/api/app';
import usePageTable from '@/hooks/usePageTable';
import Pagination from '@/components/pagination';

let addContent = '';

export default (props) => {
  const { info } = props;
  const { appId, env } = info || {};
  const dlgRef: any = useRef();

  const { changePage, pageData, fetchQuery, setFetchQuery, loading } = usePageTable({
    reqMethod: getAppServer,
    dealReqData: useCallback(
      (args) => {
        const { currentPage } = args;
        const param: any = { currentPage, id: appId, env };
        return param;
      },
      [appId, env],
    ),
  });

  const closeDlg = useCallback(() => {
    dlgRef.current?.();
  }, []);

  const columns = useMemo(
    () => [
      {
        title: '机器地址及位置',
        columnKey: 'server',
        grow: 1,
      },
      {
        title: '操作',
        columnKey: 'op',
        width: 200,
        render({ meta }) {
          return (
            <Popup
              onOk={() => {
                deleteServer({
                  serverId: meta.id,
                  id: appId,
                  env,
                })
                  .then((res) => {
                    Message.success(res.message);
                    setFetchQuery({ currentPage: 1 });
                  })
                  .catch((e) => {
                    Message.error(e.message);
                  });
              }}
            >
              <Button type="danger">删除</Button>
            </Popup>
          );
        },
      },
    ],
    [appId, env, setFetchQuery],
  );

  return (
    <div className="server-dlg">
      <Button
        className="block mb16"
        onClick={() => {
          dlgRef.current = Dialog.show({
            content: (
              <div>
                <div className="mb16">
                  <Input
                    type="textarea"
                    placeholder="0.0.0.0:/Users/deploy"
                    maxLength={1000}
                    showCount
                    onChange={({ value }) => {
                      addContent = value?.trim() as string;
                    }}
                  />
                </div>
                <Button
                  onClick={() => {
                    let pathArr = addContent.split(',');
                    pathArr = pathArr.map((v) => v.trim());
                    pathArr = pathArr.filter((v) => !!v);
                    if (pathArr.length) {
                      saveAppServer({ id: appId, env, server: pathArr })
                        .then((res) => {
                          Message.success(res.message);
                          closeDlg();
                          setFetchQuery({ currentPage: fetchQuery.currentPage });
                        })
                        .catch((e) => {
                          Message.error(e.message);
                        });
                    } else {
                      Message.error('输入机器地址及位置，以英文逗号分隔多个值');
                    }
                  }}
                >
                  确定
                </Button>
              </div>
            ),
            title: '新增',
            innerClassName: 'server-inner',
          });
        }}
      >
        新增
      </Button>
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
