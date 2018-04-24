let $http = 
(url,data,successFn,errorFn) => {
  var requestContent = "";//"TypeId=1&TypeId2=lz"
  var timestamp = new Date().getTime();
  var signature = GetSignature(url, "", requestContent, timestamp);
  wx.request({
    url: getApp().globalData.Host + url,
    data: data,
    method: 'Post',
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "x-seven-request-signature": signature,
      "x-seven-request-app-id": "XI1234567891234567",
      "x-seven-request-user-id": "e10adc3949ba59abbe56e057f20f883e",
      "x-seven-request-timestamp": timestamp
    },
    success: function (res) {
      successFn(res)
    }
  });
}
function GetSignature(path, query, requestContent, timestamp) {
  var HMAC = require('hmac-sha1.js');
  //按序拼接为长字符串
  var verb = 'post'.toLowerCase();
  var appID = 'x-seven-request-app-id:XI1234567891234567'.toLowerCase();
  var userID = 'x-seven-request-user-id:e10adc3949ba59abbe56e057f20f883e'.toLowerCase();
  var secret = '4f64e672-6460-4711-891c-cc9fad5925cb'.toLowerCase();
  var concatenatedContent = verb + ";" + path.toLowerCase() + ";" + query + ";" + appID + "," + userID + ";" + requestContent + ";" + timestamp + ";" + secret
  //console.log(concatenatedContent);
  return HMAC.Hmac_Sha1(secret, concatenatedContent);
}

module.exports = {
  $http: $http
}