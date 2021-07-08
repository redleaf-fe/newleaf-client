import React, { useRef } from 'react';
import { Button, Steps, Dialog, Message } from 'redleaf-rc';
import { useMount, useSafeState } from 'redleaf-rc/dist/utils/hooks';
import { saveProto, getProto } from '@/api/approve';
import { IconMinus } from '@/components/icons';

import AddUserDlg from './addUserDlg';
import './style.less';

export default (props) => {
  const { info } = props;
  const [state, setState] = useSafeState({
    forceRender: [],
    stepVal: '[]',
    approveId: '',
  });

  // Steps的render函数会保存当时所在的执行环境，state不会更新，所以不得已用ref保存信息
  const { current: stepOptions } = useRef([] as any);
  const { current: addedUserId } = useRef([] as any);

  const renderAddUser = ({ meta, index }) => {
    const data = JSON.parse(stepOptions[index].value);
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
                    if (addedUserId.includes(v.uid)) {
                      Message.error('用户已加入');
                      return;
                    }
                    data.push(v);
                    addedUserId.push(v.uid);
                    stepOptions[index].value = JSON.stringify(data);
                    if (index === stepOptions.length - 1) {
                      setState({ stepVal: JSON.stringify(data) });
                    }
                    setState({ forceRender: {} });
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
            if (index === stepOptions.length - 1) {
              setState({ stepVal: stepOptions[index - 1]?.value });
            }
            data.forEach((v) => {
              const idx = addedUserId.findIndex((vv) => vv === v.uid);
              addedUserId.splice(idx, 1);
            });
            stepOptions.splice(index, 1);
            setState({ forceRender: {} });
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
                  const idx = addedUserId.findIndex((vv) => vv === v.uid);
                  addedUserId.splice(idx, 1);
                  data.splice(k, 1);
                  stepOptions[index].value = JSON.stringify(data);
                  setState({ forceRender: {} });
                }}
              />
            </div>
          );
        })}
      </>
    );
  };

  useMount(() => {
    getProto({ businessId: info.appId, type: 'app' })
      .then((res) => {
        if (res.stage) {
          const stage = JSON.parse(res.stage);
          stage.forEach((v) => {
            stepOptions.push({
              text: '',
              value: JSON.stringify(v.map((vv) => ({ username: vv.n, uid: vv.i }))),
              render: renderAddUser,
            });
          });

          setState({
            forceRender: {},
            approveId: res.id,
            stepVal: JSON.stringify(stage[stage.length - 1].map((vv) => ({ username: vv.n, uid: vv.i }))),
          });
        }
      })
      .catch((e) => {
        Message.error(e.message);
      });
  });

  return (
    <>
      <div className="mb16">
        <Button
          onClick={() => {
            if (stepOptions.length > 0 && stepOptions[stepOptions.length - 1].value === '[]') {
              Message.error('上一个环节未填写');
              return;
            }
            stepOptions.push({
              text: '',
              value: '[]',
              render: renderAddUser,
            });
            setState({ forceRender: {}, stepVal: '[]' });
          }}
        >
          增加审核环节
        </Button>
        <Button
          className="ml8"
          onClick={() => {
            const stage = stepOptions
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
      <Steps layout="vertical" options={stepOptions} value={state.stepVal} />
    </>
  );
};
