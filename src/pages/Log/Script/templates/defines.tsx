export default function ({ lcName }) {
  return `
  var logMethod = {
    xhr: sendXhr,
    img: sendImg,
    beacon: sendBeacon,
  };

  var cache = {};
  var lcName = '${lcName || '__newleaf_log_cache__'}';
  var lc = window.localStorage || {
    setItem: function (name, val) {
      cache[name] = val;
    },
    getItem: function (name) {
      return cache[name];
    },
    removeItem: function () {
      delete cache[name];
    }
  };
  `;
}
