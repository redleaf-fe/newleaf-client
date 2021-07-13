import { useCallback, useEffect, useState } from 'react';
import { Message } from 'redleaf-rc';
import { useSafeState } from 'redleaf-rc/dist/utils/hooks';

export default ({
  reqData,
  reqMethod,
  dealReqData,
  reqCondition,
}: {
  reqData?: any;
  reqMethod: (args) => any;
  dealReqData?: (args) => any;
  reqCondition?: (args) => boolean;
}) => {
  const [fetchQuery, setFetchQuery] = useSafeState({
    currentPage: 1,
    pageSize: 10,
    ...reqData,
  });
  const [pageData, setPageData] = useSafeState({
    totalItems: 0,
    data: [],
  });
  const [loading, setLoading] = useState(false);

  const fetchMethod = useCallback(
    (req) => {
      setLoading(true);
      reqMethod(typeof dealReqData === 'function' ? dealReqData(req) : req)
        .then((res2) => {
          setLoading(false);
          const { count, rows } = res2;
          setPageData({
            totalItems: count,
            data: rows,
          });
        })
        .catch((e) => {
          setLoading(false);
          Message.error(e.message);
        });
    },
    [dealReqData, reqMethod, setPageData],
  );

  useEffect(() => {
    if (typeof reqCondition === 'function') {
      if (reqCondition(fetchQuery)) {
        fetchMethod(fetchQuery);
      }
    } else {
      fetchMethod(fetchQuery);
    }
  }, [fetchQuery, fetchMethod, reqCondition]);

  const changePage = useCallback(
    ({ page }) => {
      setFetchQuery({ currentPage: page });
    },
    [setFetchQuery],
  );

  return { changePage, pageData, setFetchQuery, fetchQuery, loading, fetchMethod };
};
