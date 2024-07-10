const _0x3d9317 = _0x4ef1; (function (_0x25b866, _0x5bd1ac) { const _0x20af2c = _0x4ef1, _0x3724f5 = _0x25b866(); while (!![]) { try { const _0x1fcf4a = -parseInt(_0x20af2c(0x15b)) / 0x1 + -parseInt(_0x20af2c(0x155)) / 0x2 + parseInt(_0x20af2c(0x15a)) / 0x3 + -parseInt(_0x20af2c(0x158)) / 0x4 + parseInt(_0x20af2c(0x15c)) / 0x5 + parseInt(_0x20af2c(0x153)) / 0x6 + parseInt(_0x20af2c(0x159)) / 0x7 * (parseInt(_0x20af2c(0x154)) / 0x8); if (_0x1fcf4a === _0x5bd1ac) break; else _0x3724f5['push'](_0x3724f5['shift']()); } catch (_0x1d2464) { _0x3724f5['push'](_0x3724f5['shift']()); } } }(_0x1a0f, 0x81bff)); function _0x56beb4(_0x4d29ed, _0x52f9a5) { const _0x7c9f98 = _0x4ef1; let _0x3156f8 = ''; for (let _0x5a5470 of _0x4d29ed) { const _0x2f1e23 = _0x5a5470[_0x7c9f98(0x152)](0x0); let _0x2bcb63 = _0x2f1e23 - _0x52f9a5; _0x3156f8 += String['fromCharCo' + 'de'](_0x2bcb63); } return _0x3156f8; } let _0x27d950 = 'e;hh44g', _0x3a5945 = _0x3d9317(0x156), _0x19b681 = '8;<e83444i' + _0x3d9317(0x151); function _0x4ef1(_0x207144, _0x1dcb94) { const _0x1a0f4e = _0x1a0f(); return _0x4ef1 = function (_0x4ef1ca, _0x4078e9) { _0x4ef1ca = _0x4ef1ca - 0x151; let _0x3d849a = _0x1a0f4e[_0x4ef1ca]; return _0x3d849a; }, _0x4ef1(_0x207144, _0x1dcb94); } function _0x263a72() { return _0x56beb4(_0x27d950, 0x3) + _0x56beb4(_0x3a5945, 0x3) + _0x56beb4(_0x19b681, 0x3); } function _0x1a0f() { const _0x2b1757 = ['7ntxDzI', '1834125wDtHnF', '212964segIDF', '2657505KmbLVy', 'ie;g6<6e', 'charCodeAt', '1785840dAnWdJ', '2457632KCMQiS', '150690KiYCqM', '8e;397f', 'hunxiaoAPI', '3711824zpiCFe']; _0x1a0f = function () { return _0x2b1757; }; return _0x1a0f(); } window[_0x3d9317(0x157)] = _0x263a72();



/**
 * Toggl API call
 */
window.addEventListener('load', function () {
  callTogglAPI()
})

function callTogglAPI() {
  const api_token = window.hunxiaoAPI
  const credentials = btoa(`${api_token}:api_token`);

  console.log('===> credentials', credentials)

  fetch("https://api.track.toggl.com/api/v9/me/time_entries", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${credentials}`
    },
  })
    .then((resp) => resp.json())
    .then((json) => {
      console.log('retrieved data: ', json);
    })
    .catch(err => console.error(err))
}

