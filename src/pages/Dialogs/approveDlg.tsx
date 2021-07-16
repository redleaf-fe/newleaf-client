import React, { useCallback, useRef } from 'react';
import { Button, Steps, Dialog, Message } from 'redleaf-rc';
import { useMount, useSafeState } from 'redleaf-rc/dist/utils/hooks';
import { saveProto, getProto } from '@/api/approve';
import { IconMinus } from '@/components/icons';

import AddUserDlg from './addUserDlg';
import './style.less';

export default (props) => {
  const { info } = props;
  const [state, setState] = useSafeState({
    stepVal: '[]',
    approveId: '',
    stepOptions: [],
    addedUserId: [],
  });

  const renderAddUser = useCallback(
    ({ meta, index }) => {
      const data = JSON.parse(meta.value);
      return (
        <>
          <Button
            type="default"
            onClick={() => {
              Dialog.show({
                maskClosable: true,
                content: (
                  <AddUserDlg
                    addUser={(v) => {
                      if (data.length >= 5) {
                        Message.error('每个环节最多添加5个审核人');
                        return;
                      }
                      if (state.addedUserId.includes(v.uid)) {
                        Message.error('用户已加入');
                        return;
                      }
                      data.push(v);
                      state.addedUserId.push(v.uid);
                      state.stepOptions[index].value = JSON.stringify(data);
                      if (index === state.stepOptions.length - 1) {
                        setState({ stepVal: JSON.stringify(data) });
                      }
                      setState({ stepOptions: state.stepOptions, addedUserId: state.addedUserId });
                      Message.success('已添加');
                    }}
                  />
                ),
                title: '增加审核人',
              });
            }}
          >
            增加审核人
          </Button>
          <Button
            type="danger"
            className="ml8"
            onClick={() => {
              if (index === state.stepOptions.length - 1) {
                setState({ stepVal: state.stepOptions[index - 1]?.value });
              }
              data.forEach((v) => {
                const idx = state.addedUserId.findIndex((vv) => vv === v.uid);
                state.addedUserId.splice(idx, 1);
              });
              state.stepOptions.splice(index, 1);
              setState({ stepOptions: state.stepOptions, addedUserId: state.addedUserId });
            }}
          >
            删除环节
          </Button>
          {data.map((v, k) => {
            return (
              <div key={k}>
                <span>{v.username}</span>
                <IconMinus
                  className="delete-icon ml8"
                  onClick={() => {
                    if (data.length <= 1) {
                      Message.error('至少保留一个审核人');
                      return;
                    }
                    const idx = state.addedUserId.findIndex((vv) => vv === v.uid);
                    state.addedUserId.splice(idx, 1);
                    data.splice(k, 1);
                    state.stepOptions[index].value = JSON.stringify(data);
                    setState({ stepOptions: state.stepOptions, addedUserId: state.addedUserId });
                  }}
                />
              </div>
            );
          })}
        </>
      );
    },
    [state, setState],
  );

  useMount(() => {
    getProto({ businessId: info.appId, type: 'app' })
      .then((res) => {
        if (res.stage) {
          const stage = JSON.parse(res.stage);
          stage.forEach((v) => {
            state.stepOptions.push({
              text: '',
              value: JSON.stringify(v.map((vv) => ({ username: vv.n, uid: vv.i }))),
              render: renderAddUser,
            });
            v.forEach((vv) => {
              state.addedUserId.push(vv.i);
            });
          });

          setState({
            approveId: res.id,
            stepVal: JSON.stringify(stage[stage.length - 1].map((vv) => ({ username: vv.n, uid: vv.i }))),
            stepOptions: state.stepOptions,
            addedUserId: state.addedUserId,
          });
        }
      })
      .catch((e) => {
        Message.error(e.message);
      });
  });

  return (
    <div className="add-approve-user-dlg">
      <div className="mb16">
        <Button
          onClick={() => {
            if (state.stepOptions.length > 0 && state.stepOptions[state.stepOptions.length - 1].value === '[]') {
              Message.error('上一个环节未填写');
              return;
            }
            state.stepOptions.push({
              text: '',
              value: '[]',
              render: renderAddUser,
            });
            setState({ stepVal: '[]', stepOptions: state.stepOptions });
          }}
        >
          增加审核环节
        </Button>
        <Button
          className="ml8"
          onClick={() => {
            const stage = state.stepOptions
              .filter((v) => v.value !== '[]')
              .map((v) => {
                const val = JSON.parse(v.value);
                return val.map((vv) => ({
                  i: vv.uid,
                  n: vv.username,
                }));
              });
            const param = {
              stage,
              businessId: info.appId,
              type: 'app',
            };
            if (state.approveId) {
              param.id = state.approveId;
            }
            saveProto(param)
              .then((res) => {
                Message.success(res.message);
              })
              .catch((e) => {
                Message.error(e.message);
              });
          }}
        >
          保存
        </Button>
      </div>
      <Steps
        layout="vertical"
        options={state.stepOptions.map((v) => ({ ...v, render: renderAddUser }))}
        value={state.stepVal}
      />
    </div>
  );
};
