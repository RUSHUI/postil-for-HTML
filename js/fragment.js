// 得到字符串的真实长度（双字节换算为两个单字节）
function getStrActualLen(sChars) {
  return sChars.replace(/[^\x00-\xff]/g, "xx").length;
}

// 截取固定长度子字符串 sSource为字符串iLen为长度
function getInterceptedStr(sSource, iLen) {
  if (sSource.replace(/[^\x00-\xff]/g, "xx").length <= iLen) {
    return sSource;
  }

  var str = "";
  var l = 0;
  var schar;
  for (var i = 0; schar = sSource.charAt(i); i++) {
    str += schar;
    l += (schar.match(/[^\x00-\xff]/) != null ? 2 : 1);
    if (l >= iLen) {
      break;
    }
  }

  return str;
}
var str1 = "这是一个字符串截取的函数,this is a test!";
//alert(getStrActualLen(str1));
alert(getInterceptedStr(str1, 26));



var cutstr = function(str, len) {
  var str_length = 0;
  var str_len = 0;
  str_cut = new String();
  str_len = str.length;
  for (var i = 0; i < str_len; i++) {
    a = str.charAt(i);
    str_length++;
    if (escape(a).length > 4) {
      //中文字符的长度经编码之后大于4
      str_length++;
    }
    str_cut = str_cut.concat(a);
    if (str_length >= len) {
      str_cut = str_cut.concat("...");
      return str_cut;
    }
  }
  //如果给定字符串小于指定长度，则返回源字符串；
  if (str_length < len) {
    return str;
  }
};



;
(function($, win, doc, ufd) {
  function Editor() {
    var config = {};
    this.init();
  }
  Editor.prototype = {
    constructor: Editor,
    init: function() {
      this.createDom();
      this.bindEvent();
    },
    createDom: function() {},
    bindEvent: function() {},
    show: function() {},
    hide: function() {},
    destory: function() {}
  };

  var editor = new Editor();

})(jQuery, window, document);



window.getJSONP = function(url, callback) {
  var timeStamp = new Date().getTime(),
    name = 'jsonp_' + timeStamp,
    callbackWrap = 'getJSONP.' + name,
    script = document.createElement('script');
  if (url.indexOf('?') === -1) {
    url += '?jsonp=' + callbackWrap;
  } else {
    url += '&jsonp=' + callbackWrap;
  }
  getJSONP[name] = function(response) {
    try {
      callback(response);
    } finally {
      delete getJSONP[name];
      script.parentNode.removeChild(script);
    }
  };
  script.src = url;
  document.body.appendChild(script);
};
