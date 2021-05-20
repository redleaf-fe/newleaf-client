export default function ({ appId, logUrl }) {
  return `
function Newleaf() {
  this.appId = '${appId}';
  this.logUrl = '${logUrl}';
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
    logMethod[method](logUrl, content);
  }
};

if (window.newleaf) {
  throw new Error('variable name \`newleaf\` has existed');
} else {
  window.newleaf = new Newleaf();
}
  `;
}