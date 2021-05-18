import React, { useState, useEffect } from 'react';
import { Message } from 'redleaf-rc';
import { getDatabaseConfig } from '@/api/config';
import LabelContent from '@/components/labelContent';

import './style.less';

export default () => {
  const [config, setConfig] = useState({});

  useEffect(() => {
    getDatabaseConfig()
      .then((res) => setConfig(res.data || {}))
      .catch((e) => Message.show({ title: String(e) }));
  }, []);

  return (
    <div className="config-container">
      <LabelContent
        items={[
          {
            label: '数据库名称：',
            value: config.database,
          },
          {
            label: '数据库端口号：',
            value: config.port,
          },
        ]}
      />
    </div>
  );
};
