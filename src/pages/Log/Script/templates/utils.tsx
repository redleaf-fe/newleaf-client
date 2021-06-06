// 工具方法
export default function ({ lcTimeBase, lcTimeFloat }) {
  return `
  function save(info) {
    const data = JSON.parse(lc.getItem(lcName) || '[]');
    data.push(info);
    lc.setItem(lcName, JSON.stringify(data));
  }
  
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
  
  function getRandTime() {
    return ${lcTimeBase} + Math.floor(Math.random() * ${lcTimeFloat});
  }
  
  function send() {
    let cnt = 0;
  
    function sendData() {
      const data = JSON.parse(lc.getItem(lcName) || '[]');
      const info = data.pop();
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
