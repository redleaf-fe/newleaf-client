import { useCallback, useEffect, useState } from 'react';
import { Message } from 'redleaf-rc';

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
  const [fetchQuery, setFetchQuery] = useState({
    currentPage: 1,
    pageSize: 10,
    ...reqData,
  });
  const [pageData, setPageData] = useState({
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
          Message.show({ title: e.message });
        });
    },
    [dealReqData, reqMethod],
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

  const changePage = useCallback(({ page }) => {
    setFetchQuery((t) => ({ ...t, currentPage: page }));
  }, []);

  return { changePage, pageData, setFetchQuery, fetchQuery, loading };
};
