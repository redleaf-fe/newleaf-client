(function (window, undefined) {
  const logMethod = ['xhr', 'img'];

  function Newleaf() {}

  Newleaf.prototype.init = function ({ appId, logUrl }) {
    this.appId = appId;
    this.logUrl = logUrl;
  };

  Newleaf.prototype.log = function ({ content = '', method = 'xhr', logUrl }) {};

  if (window.newleaf) {
    throw new Error('variable name `newleaf` has existed');
  } else {
    window.newleaf = new Newleaf();
  }
})(window);
