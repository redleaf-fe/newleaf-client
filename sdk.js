(function (window, undefined) {
  // defines
  const logMethod = {
    xhr: sendXhr,
    img: sendImg,
    sendBeacon: navigator.sendBeacon.bind(navigator),
  };

  // body
  function Newleaf() {
    this.appId = '123';
    this.logUrl = '/log';
    if (navigator.sendBeacon) {
      this.method = 'sendBeacon';
    } else {
      this.method = 'img';
    }
  }

  Newleaf.prototype.log = function ({ content = '', method, logUrl, appId }) {
    // content如果不是字符串，进行转换
    if (typeof content !== 'string') {
      content = String(content);
    }
    // 有内容才发送
    if (content) {
      logMethod[method || this.method](logUrl || this.logUrl, {
        appId: appId || this.appId,
        content,
      });
    }
  };

  if (window.newleaf) {
    throw new Error('variable name \`newleaf\` has existed');
  } else {
    window.newleaf = new Newleaf();
  }

  // utils
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
})(window);
