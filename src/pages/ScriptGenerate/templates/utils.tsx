// 工具方法
export default `
function sendXhr(url, data) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
}

function sendImg(url, data) {
  const img = new Image();
  img.src = url + data;
}
`;
