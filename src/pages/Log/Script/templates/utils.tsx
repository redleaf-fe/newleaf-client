// 工具方法
export default function ({ lcTimeBase, lcTimeFloat }) {
  return `
  function save(info) {
    var data = JSON.parse(lc.getItem(lcName) || '[]');
    data.push(info);
    lc.setItem(lcName, JSON.stringify(data));
  }

  function sendBeacon(url, data) {
    navigator.sendBeacon(url, new URLSearchParams(data).toString());
  }

  function sendXhr(url, data) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  }

  function sendImg(url, data) {
    var img = new Image();
    img.src = url + '?' + new URLSearchParams(data).toString();
  }

  function getRandTime() {
    return 5 + Math.floor(Math.random() * 10);
  }

  function send() {
    var cnt = 0;

    function sendData() {
      var data = JSON.parse(lc.getItem(lcName) || '[]');
      var info = data.pop();
      if (info) {
        logMethod[info.method](info.logUrl, info);
      }
      lc.setItem(lcName, JSON.stringify(data));
      cnt++;

      if (cnt >= 4) {
        setTimeout(send, getRandTime());
      } else {
        setTimeout(sendData, 800);
      }
    }

    setTimeout(sendData, 800);
  }

  setTimeout(send, getRandTime());
  `;
}
