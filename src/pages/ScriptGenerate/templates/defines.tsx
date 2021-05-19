export default `
const logMethod = {
  xhr: sendXhr,
  img: sendImg,
  sendBeacon: navigator.sendBeacon,
};
`;
