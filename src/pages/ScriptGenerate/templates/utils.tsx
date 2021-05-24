// 工具方法
export default `
function sendBeacon(url, data) {
  navigator.sendBeacon(url, new URLSearchParams(data).toString());
}

function sendXhr(url, data) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
}

function sendImg(url, data) {
  const img = new Image();
  img.src = \`\${url}?\${new URLSearchParams(data).toString()}\`
}
`;
