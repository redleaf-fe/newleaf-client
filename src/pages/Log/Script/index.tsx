import React, { useRef, useState } from 'react';
import { Form, Input, Button, Check, Message } from 'redleaf-rc';
import { required, requiredMsg } from '@/utils/validators';
import { formUnpass } from '@/const';

import { defines, body, utils, error, route } from './templates';
import jsmin from './jsmin';

import './style.less';

export default () => {
  const formRef: any = useRef();
  const [code, setCode] = useState('');

  return (
    <div className="script-container">
      <Form
        className="script-form"
        getInstance={(i) => {
          formRef.current = i;
        }}
        defaultValue={{
          logUrl: 'http://localhost:3013/log',
          lcName: '__newleaf_log_cache__',
          lcTimeBase: '5',
          lcTimeFloat: '5',
        }}
      >
        <div className="bold mb16">基础选项</div>

        <Form.Item
          label="日志上报地址："
          name="logUrl"
          showRequiredMark
          validators={[
            {
              rule: required,
              message: requiredMsg,
            },
          ]}
        >
          <Input placeholder="输入日志上报地址" />
        </Form.Item>
        <Form.Item
          label="appId："
          name="appId"
          showRequiredMark
          validators={[
            {
              rule: required,
              message: requiredMsg,
            },
          ]}
        >
          <Input placeholder="输入appId" />
        </Form.Item>
        {/* 缓存 */}
        <Form.Item
          label="缓存名称："
          name="lcName"
          showRequiredMark
          validators={[
            {
              rule: required,
              message: requiredMsg,
            },
          ]}
        >
          <Input placeholder="输入缓存名称" />
        </Form.Item>
        <Form.Item
          label="缓存基准时间："
          name="lcTimeBase"
          showRequiredMark
          validators={[
            {
              rule: required,
              message: requiredMsg,
            },
          ]}
        >
          <Input type="int" placeholder="输入缓存基准时间" />
          <span className="ml8">
            缓存日志发送时间间隔的计算方法：缓存基准时间 + 取最小整数(0~1随机数 * 缓存浮动时间)
          </span>
        </Form.Item>
        <Form.Item
          label="缓存浮动时间："
          name="lcTimeFloat"
          showRequiredMark
          validators={[
            {
              rule: required,
              message: requiredMsg,
            },
          ]}
        >
          <Input type="int" placeholder="输入缓存浮动时间" />
        </Form.Item>

        <div className="bold mb16">高级选项</div>

        {/* 错误处理 */}
        <Form.Item label="全局错误处理：" name="errorHandle">
          <Check options={[{ value: '', text: '' }]} shape="rect" />
          <span>全局错误处理包括监听window的error事件、unhandledrejection事件</span>
        </Form.Item>
        {/* 路由日志 */}
        <Form.Item label="路由日志：" name="routeHandle">
          <Check options={[{ value: '', text: '' }]} shape="rect" />
          <span>勾选路由日志会对window.history的pushState和replaceState方法进行包裹</span>
        </Form.Item>
        <Button
          className="submit"
          onClick={() => {
            const { values, errors } = formRef.current.getValues();
            if (Object.keys(errors).length > 0) {
              Message.show({ title: formUnpass });
              return;
            }

            const {
              appId,
              logUrl,
              errorHandle = [],
              routeHandle = [],
              lcName = '',
              lcTimeBase = '5',
              lcTimeFloat = '5',
            } = values;
            setCode(
              jsmin(`(function(window){
              ${defines({ lcName })}${errorHandle.length > 0 ? error() : ''}${
                routeHandle.length > 0 ? route() : ''
              }${body({
                appId,
                logUrl,
              })}${utils({
                lcTimeBase,
                lcTimeFloat,
              })}}(window));`),
            );
          }}
        >
          确定
        </Button>
      </Form>
      <div>
        <Input type="textarea" rows={20} className="script-area" value={code} />
      </div>
    </div>
  );
};
