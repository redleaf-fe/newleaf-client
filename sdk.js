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
      this.defaultSend = 'sendBeacon';
    } else {
      this.defaultSend = 'img';
    }
  }

  Newleaf.prototype.log = function ({ content = '', method, logUrl }) {
    // content如果不是字符串，进行转换
    if (typeof content !== 'string') {
      content = String(content);
    }
    // 有内容才发送
    if (content) {
      method = method || this.defaultSend;
      logMethod[method](logUrl, {
        appId: this.appId,
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
    xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
    xhr.send(data);
  }

  function sendImg(url, data) {
    const img = new Image();
    img.src = url + data;
  }
})(window);
