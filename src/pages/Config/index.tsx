import React, { useState, useEffect, useContext } from 'react';
import { Message } from 'redleaf-rc';
import { getDatabaseConfig } from '@/api/config';
import LabelContent from '@/components/labelContent';
import { context } from '@/components/layout';

import './style.less';

const Config = () => {
  const [config, setConfig] = useState({});
  const layout = useContext(context);

  useEffect(() => {
    layout?.setLayoutVal({ key: 'pageTitle', value: '数据库配置' });

    getDatabaseConfig()
      .then((res) => setConfig(res?.data || {}))
      .catch((e) => Message.show({ title: String(e) }));
  }, []);

  return (
    <div className="config-container">
      <LabelContent
        items={[
          {
            label: '数据库名称：',
            value: config?.database,
          },
          {
            label: '数据库端口号：',
            value: config?.port,
          },
        ]}
      />
    </div>
  );
};

export default Config;
