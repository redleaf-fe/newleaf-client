export default function () {
  return `
  window.addEventListener('error', function (e) {
    const { message, stack } = e.error;
    newleaf.log({
      content: JSON.stringify({
        message,
        stack
      }),
      type: 'error'
    })
  });

  window.addEventListener('unhandledrejection', function (e) {
    const { message, stack } = e.reason;
    newleaf.log({
      content: JSON.stringify({
        message,
        stack
      }),
      type: 'error'
    })
  });
  `;
}
