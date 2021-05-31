export default function ({ lcName }) {
  return `
const logMethod = {
  xhr: sendXhr,
  img: sendImg,
  beacon: sendBeacon,
};

const cache = {};
const lcName = '${lcName || '__newleaf_log_cache__'}';
const lc = window.localStorage || {
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
