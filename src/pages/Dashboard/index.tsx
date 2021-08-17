import React, { useEffect, useRef } from 'react';
import { Select, Message } from 'redleaf-rc';
import { useSafeState, useMount } from 'redleaf-rc/dist/utils/hooks';
import dayjs from 'dayjs';
import { getDashboard } from '@/api/dashboard';
import * as echarts from 'echarts';

import './style.less';

const genOption = (xData, yData, title) => ({
  title: {
    text: title,
  },
  tooltip: {
    trigger: 'axis',
  },
  yAxis: {
    type: 'value',
  },
  xAxis: {
    type: 'category',
    data: xData,
  },
  series: [
    {
      data: yData,
      type: 'line',
    },
  ],
});

export default () => {
  const chartDOMRef_QPS = useRef();
  const chartDOMRef_RT = useRef();
  const chartDOMRef_CPU = useRef();
  const chartDOMRef_MEM = useRef();
  const chartRef_QPS = useRef();
  const chartRef_RT = useRef();
  const chartRef_CPU = useRef();
  const chartRef_MEM = useRef();

  const [state, setState] = useSafeState({
    machine: 'newleaf_monitor',
    startTime: '',
    endTime: '',
  });

  useMount(() => {
    chartRef_QPS.current = echarts.init(chartDOMRef_QPS.current);
    chartRef_RT.current = echarts.init(chartDOMRef_RT.current);
    chartRef_CPU.current = echarts.init(chartDOMRef_CPU.current);
    chartRef_MEM.current = echarts.init(chartDOMRef_MEM.current);
  });

  useEffect(() => {
    getDashboard({ key: `${state.machine}_${dayjs().format('YYYY-MM-DD')}` })
      .then((res) => {
        const xData = Object.keys(res).sort();
        xData.forEach((v) => {
          res[v] = JSON.parse(res[v]);
        });

        const qpsData = xData.map((v) => res[v].reqNum || 0);
        const rtData = xData.map((v) => Math.ceil(res[v].reqTime / res[v].reqNum) || 0);
        // setState({ avg: yData.reduce((prev, curr) => prev + curr) / yData.length });
        chartRef_QPS?.current?.setOption(genOption(xData, qpsData, '每分钟请求数'));
        chartRef_RT?.current?.setOption(genOption(xData, rtData, 'RT'));
      })
      .catch((e) => {
        Message.error(e);
      });
  }, [state.machine]);

  return (
    <div>
      <Select options={[{ text: 'newleaf', value: 'newleaf_monitor' }]} defaultValue={[state.machine]} />
      <div className="chart-container">
        <div className="chart" ref={chartDOMRef_QPS} />
        <div className="chart" ref={chartDOMRef_RT} />
      </div>
      <div className="chart-container">
        <div className="chart" ref={chartDOMRef_CPU} />
        <div className="chart" ref={chartDOMRef_MEM} />
      </div>
    </div>
  );
};
