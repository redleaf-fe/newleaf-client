export function error() {
  return `
  window.addEventListener('error', function (e) {
    var _e$error = e.error,
        message = _e$error.message,
        stack = _e$error.stack;

    newleaf.log({
      content: JSON.stringify({
        message,
        stack
      }),
      type: 'error'
    });
  });

  window.addEventListener('unhandledrejection', function (e) {
    var _e$reason = e.reason,
        message = _e$reason.message,
        stack = _e$reason.stack;

    newleaf.log({
      content: JSON.stringify({
        message,
        stack
      }),
      type: 'error'
    });
  });
  `;
}

export function route() {
  return `
  function hackHistory(type) {
    var source = window.history[type];
    return function () {
      var event = new Event(type);
      event._args = arguments;
      window.dispatchEvent(event);
      var rewrite = source.apply(this, arguments);
      return rewrite;
    };
  }

  window.history.pushState = hackHistory('pushState');
  window.history.replaceState = hackHistory('replaceState');

  window.addEventListener('pushState', function (e) {
    newleaf.log({
      content: e._args[2] || '',
      type: 'route'
    });
  }, true);
  window.addEventListener('replaceState', function (e) {
    newleaf.log({
      content: e._args[2] || '',
      type: 'route'
    });
  }, true);
  window.addEventListener('hashchange', function (e) {
    newleaf.log({
      content: e.newURL,
      type: 'route'
    });
  }, true);
  `;
}
