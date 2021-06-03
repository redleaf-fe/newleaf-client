export default function ({ appId, logUrl }) {
  return `
  function Newleaf() {
    this.appId = '${appId}';
    this.logUrl = '${logUrl}';
    if (navigator.sendBeacon) {
      this.method = 'beacon';
    } else {
      this.method = 'img';
    }
  }

  Newleaf.prototype.log = function ({ type = 'log', content = '', method, logUrl, appId, cache = true }) {
    // 有内容才发送
    if (content) {
      // 默认缓存再发送
      cache ? save({
        method: method || this.method,
        logUrl: logUrl || this.logUrl,
        appId: appId || this.appId,
        content,
        type
      }) : logMethod[method || this.method](logUrl || this.logUrl, {
        appId: appId || this.appId,
        content,
        type
      });
    }
  };

  if (window.newleaf) {
    throw new Error('variable name \`newleaf\` has existed');
  } else {
    window.newleaf = new Newleaf();
  }
  `;
}
