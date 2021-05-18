export function required({ value }) {
  return !!value;
}

export const requiredMsg = '必填';

export function onlySpace({ value }) {
  return value.trim().length > 0;
}

export const onlySpaceMsg = '内容中不能只有空格';
