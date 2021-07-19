import React, { useCallback, useRef } from 'react';
import { Button, Steps, Dialog, Message } from 'redleaf-rc';
import { useMount, useSafeState } from 'redleaf-rc/dist/utils/hooks';
import { saveIns, getIns } from '@/api/approve';
import { getSearchParams } from 'ice';
import Cookie from 'js-cookie';
import cls from 'classnames';

import './style.less';

const approveText = {
  pending: '审核中',
  done: '审核通过',
  fail: '审核拒绝',
};

export default () => {
  const searchParams = getSearchParams();
  const [state, setState] = useSafeState({
    ins: {},
    proto: {},
    stepOptions: [],
    stepVal: '',
  });

  const getInfo = useCallback(() => {
    getIns({ id: searchParams.id })
      .then((res) => {
        setState({
          ins: res.resIns,
          proto: res.resProto,
        });

        if (res.resProto && res.resIns) {
          const arr = [];
          const stage = JSON.parse(res.resProto.stage);
          stage.forEach((v) => {
            arr.push({
              text: '',
              value: JSON.stringify(v.map((vv) => ({ username: vv.n, uid: vv.i }))),
            });
          });
          setState({
            stepOptions: arr,
            stepVal: JSON.stringify(stage[res.resIns.stageId].map((vv) => ({ username: vv.n, uid: vv.i }))),
          });
        }
      })
      .catch((e) => {
        Message.error(e.message);
      });
  }, [searchParams, setState]);

  const approve = useCallback(
    (result) => {
      saveIns({ id: searchParams.id, result })
        .then((res) => {
          Message.success(res.message);
          getInfo();
        })
        .catch((e) => {
          Message.error(e.message);
        });
    },
    [searchParams, getInfo],
  );

  const renderOption = useCallback(
    ({ meta, index }) => {
      const username = Cookie.get('username');
      const data = JSON.parse(meta.value);
      const { ins, stepOptions } = state;
      const approver = JSON.parse(ins.approver || '[]');
      return (
        <>
          {data.map((v, k) => {
            const failJudge = ins.status === 'fail' && index === +ins.stageId;
            const successJudge = approver[index]?.n === v.username;
            return (
              <div
                key={k}
                className={cls({
                  'color-success': successJudge && !failJudge,
                  'color-danger': successJudge && failJudge,
                })}
              >
                {v.username}
              </div>
            );
          })}
          {ins.status === 'pending' && +ins.stageId === index && data.find((v) => v.username === username) && (
            <>
              <Button
                className="mr8"
                onClick={() => {
                  approve('pass');
                }}
              >
                通过
              </Button>
              <Button
                type="danger"
                onClick={() => {
                  approve('refuse');
                }}
              >
                拒绝
              </Button>
            </>
          )}
        </>
      );
    },
    [state, approve],
  );

  useMount(() => {
    getInfo();
  });

  return (
    <div>
      <div
        className={cls('approve-title', {
          'color-danger': state.ins.status === 'fail',
          'color-success': state.ins.status === 'done',
        })}
      >
        {approveText[state.ins.status]}
      </div>
      <Steps
        layout="vertical"
        options={state.stepOptions.map((v) => ({ ...v, render: renderOption }))}
        value={state.stepVal}
      />
    </div>
  );
};
