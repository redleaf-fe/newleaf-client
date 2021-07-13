import React, { useEffect } from 'react';
import { Message } from 'redleaf-rc';
import { useSafeState, useMount } from 'redleaf-rc/dist/utils/hooks';
import { publishDetail } from '@/api/publish';
import { getSearchParams } from 'ice';

import './style.less';

export default function Detail(props) {
  const searchParams = getSearchParams();

  const [state, setState] = useSafeState({
    log: '',
  });

  useMount(() => {
    publishDetail({ id: searchParams.id })
      .then((res) => {
        setState({ log: res });
      })
      .catch((e) => {
        Message.error(e.message);
      });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      publishDetail({ id: searchParams.id })
        .then((res) => {
          setState({ log: res });
        })
        .catch((e) => {
          Message.error(e.message);
        });
    }, 2000);
    return () => {
      clearInterval(timer);
    };
  }, [searchParams, setState]);

  return <pre>{state.log || '内容为空'}</pre>;
}
