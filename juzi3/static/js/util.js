
// 昨天
function yestoday () {
  var today = new Date();
  today.setTime(today.getTime()-24*60*60*1000);
  return (today.getMonth()+1) + "月" + today.getDate() + '日';
}

function go (link, params) {
  let uri = urlEncode(params)
  window.location.href = link + '?' + uri;
}

/**
 * 获取地址参数
 * @param   url   链接地址
 *
 * @return  object
 */
const getQueryString = function (url)
{
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(url.indexOf("?") + 1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

// 获取当前地址的query
const getCurrentQuery = function () {
  return getQueryString(window.location.href)
}

/**
 * @param param 将要转为URL参数字符串的对象
 * @param key   URL参数字符串的前缀
 * @param encode true/false 是否进行URL编码,默认为true
 *
 * @return URL参数字符串
 */
var urlEncode = function (param, key, encode) {
  if(param==null) return '';
  var paramStr = '';
  var t = typeof (param);
  if (t == 'string' || t == 'number' || t == 'boolean') {
    paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += urlEncode(param[i], k, encode);
    }
  }
  return paramStr;
};

const scrollTop = function () {
  var d = document,
    dd = document.documentElement,
    db = document.body,
    top = dd.scrollTop || db.scrollTop,
    step = Math.floor(top / 10);
   (function() {
       top -= step
       if (top > -step) {
           dd.scrollTop == 0 ? db.scrollTop = top: dd.scrollTop = top
           setTimeout(arguments.callee, 10)
       }
   })()
}
