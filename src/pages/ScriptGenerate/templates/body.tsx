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

Newleaf.prototype.log = function ({ content = '', method, logUrl, appId }) {
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
  `;
}
