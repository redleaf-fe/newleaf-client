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

  Newleaf.prototype.log = function (_ref) {
    var _ref$type = _ref.type,
        type = _ref$type === void 0 ? "log" : _ref$type,
        _ref$content = _ref.content,
        content = _ref$content === void 0 ? "" : _ref$content,
        method = _ref.method,
        logUrl = _ref.logUrl,
        appId = _ref.appId,
        _ref$cache = _ref.cache,
        cache = _ref$cache === void 0 ? true : _ref$cache;
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
