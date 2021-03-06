import React, { useRef } from 'react';
import { Button, Input, Form, Message, Select } from 'redleaf-rc';
import { useSafeState } from 'redleaf-rc/dist/utils/hooks';
import { getAppBranch, getAppCommit } from '@/api/app';
import { savePublish } from '@/api/publish';
import { required, requiredMsg } from '@/utils/validators';
import { formUnpass } from '@/const';

export default (props) => {
  const { closeDlg, getList, appList = {}, env } = props;
  const [state, setState] = useSafeState({
    appId: '',
    branch: [],
    commit: [],
  });
  const formRef: any = useRef();

  return (
    <Form
      className="create-dlg dialog-center"
      getInstance={(i) => {
        formRef.current = i;
      }}
      onValuesChange={({ value, name }) => {
        switch (name) {
          case 'app':
            {
              const val = JSON.parse(value[0]);
              setState({ appId: val.appId });
              getAppBranch({ id: val.appId })
                .then((res) => {
                  setState({ branch: (res || []).map((v) => ({ value: v.name, text: v.name })) });
                })
                .catch((e) => {
                  Message.error(e.message);
                });
            }
            break;
          case 'branch':
            getAppCommit({ id: state.appId, refName: value[0] })
              .then((res) => {
                setState({
                  commit: (res || []).map((v) => ({
                    value: v.id,
                    text: v.id,
                    renderOption() {
                      return (
                        <>
                          <p className="commit-id">{v.id}</p>
                          <p className="commit-title">{v.title}</p>
                        </>
                      );
                    },
                  })),
                });
              })
              .catch((e) => {
                Message.error(e.message);
              });
            break;
          default:
            break;
        }
      }}
    >
      <Form.Item
        label="???????????????"
        name="app"
        showRequiredMark
        validators={[
          {
            rule: required,
            message: requiredMsg,
          },
        ]}
      >
        <Select options={appList} optionsClassName="create-dlg-select-options" />
      </Form.Item>
      <Form.Item
        label="?????????"
        name="branch"
        showRequiredMark
        validators={[
          {
            rule: required,
            message: requiredMsg,
          },
        ]}
      >
        <Select options={state.branch} optionsClassName="create-dlg-select-options" />
      </Form.Item>
      <Form.Item
        label="??????ID???"
        name="commit"
        showRequiredMark
        validators={[
          {
            rule: required,
            message: requiredMsg,
          },
        ]}
      >
        <Select options={state.commit} optionsClassName="create-dlg-select-options create-dlg-select-commit" />
      </Form.Item>
      <Form.Item label="???????????????" name="desc">
        <Input type="textarea" rows={3} maxLength={100} showCount />
      </Form.Item>
      <div className="btns">
        <Button
          className="mr16"
          onClick={() => {
            const { values, errors } = formRef.current.getValues();

            if (Object.keys(errors).length > 0) {
              Message.error(formUnpass);
              return;
            }
            const app = JSON.parse(values.app);
            savePublish({
              ...values,
              appId: app.appId,
              appName: app.appName,
              branch: values.branch[0],
              commit: values.commit[0],
              env,
            })
              .then((res) => {
                closeDlg?.();
                getList?.();
                Message.success(res.message);
              })
              .catch((e) => {
                Message.error(e.message);
              });
          }}
        >
          ??????
        </Button>
        <Button
          type="default"
          onClick={() => {
            closeDlg?.();
          }}
        >
          ??????
        </Button>
      </div>
    </Form>
  );
};
