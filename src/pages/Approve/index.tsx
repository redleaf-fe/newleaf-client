import React, { useRef } from 'react';
import { Button, Steps, Dialog, Message } from 'redleaf-rc';
import { useMount, useSafeState } from 'redleaf-rc/dist/utils/hooks';
import { saveIns, getIns } from '@/api/approve';
import { getSearchParams } from 'ice';

// import './style.less';

export default (props) => {
  const searchParams = getSearchParams();
  const [state, setState] = useSafeState({
    ins: {},
    proto: {},
    stepOptions: [],
    stepVal: '',
  });

  const renderAddUser = ({ meta, index }) => {
    console.log(meta)
    // const data = JSON.parse(stepOptions[index].value);
    // return (
    //   <>
    //     {data.map((v, k) => {
    //       return (
    //           <span>{v.username}</span>
    //       );
    //     })}
    //   </>
    // );
  };

  useMount(() => {
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
              render: renderAddUser,
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
  });

  // console.log(state)

  return (
    <div>
      <Steps layout="vertical" options={state.stepOptions} value={state.stepVal} />
    </div>
  );
};
