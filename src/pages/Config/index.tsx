import React, { useState, useEffect } from 'react';
import { Message, ConfigProvider } from 'redleaf-rc';
import { getDatabaseConfig } from '@/api/config';
import LabelContent from '@/components/labelContent';

import './style.less';

const Config = () => {
  const [config, setConfig] = useState({});

  useEffect(() => {
    getDatabaseConfig()
      .then((res) => setConfig(res?.data || {}))
      .catch((e) => Message.show({ title: String(e) }));
  }, []);

  return (
    <ConfigProvider.Consumer>
      {(val) => {
        val.setGlobal({ key: 'pageTitle', value: '数据库配置' });

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
      }}
    </ConfigProvider.Consumer>
  );
};

export default Config;
