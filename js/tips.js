window.ljtips = function() {
  var html =
    "<div class=\"lj-tipsWrap\" id=\"tipsWrap-<%=r%>\">\
						<div></div>\
						<span class=\"lj-in lj-<%=p%>\"><span class=\"lj-in\"></span></span>\
						<a href=\"javascript:void(0)\" id=\"ljClose<%=r%>\" class=\"lj-close\">x</a>\
					</div>";
  var dg = function(id) {
    return document.getElementById(id);
  };
  var dt = function(parent, nodeName) {
    return parent.getElementsByTagName(nodeName);
  };
  var db = document.body;
  var dd = document.documentElement;
  var of = 15; // 偏移量
  var prefix = 'lj'; // 前缀
  var isie = /msie\s([\d\.]+)/.test(navigator.userAgent.toLowerCase());
  var w = window;
  var lock = true; // 锁定同一对象 多次弹出提示
  return function(id) {
    var elem = id ? typeof id == "string" ? dg(id) : id : this;
    var offset = null;
    var width = elem.offsetWidth;
    var height = elem.offsetHeight;
    var rand = 0; // 随即值
    var func = null; // 窗口变化绑定的函数
    var _this = {};
    var pos = {
      left: function(w, h) {
        return {
          top: offset.top,
          left: offset.left - w - of
        }
      },
      top: function(w, h) {
        return {
          top: offset.top - h - of,
          left: offset.left
        }
      },
      right: function(w, h) {
        console.log(offset.left, w);
        return {
          top: offset.top,
          //left: offset.left + width + of
          left: offset.left + offset.width + of
        }
      },
      bottom: function(w, h) {
        return {
          top: offset.top,
          //  top: offset.top + height + of,
          left: offset.left
        }
      }
    };


    _this.show = function(obj, dp) {
      _this.parent = dp;
      if (elem.lock) {
        elem.lock = false;
        return;
      } else elem.lock = true;
      //获取到了盒子的位置参数
      offset = elem.getBoundingClientRect();
      offset = obj.clientRects;

      var top = db.scrollTop + dd.scrollTop;
      var left = db.scrollLeft + dd.scrollLeft;
      obj.p = obj.p || 'right';
      var wrap = _this.append(obj.p, obj.closeBtn || false);
      dt(wrap, "DIV")[0].innerHTML = obj.content;
      var p = pos[obj.p](wrap.offsetWidth, wrap.offsetHeight);
      wrap.style.top = p.top + top + "px";
      wrap.style.left = p.left + left + "px";
      obj.time && setTimeout(function() {
        _this.clear(dg(prefix + rand));
      }, obj.time);
      obj.fn && obj.fn.call(elem, dg(prefix + rand));
      //--检测窗口发生变化
      func = function(a, b) {
        return function() {
          var top = db.scrollTop + dd.scrollTop;
          var left = db.scrollLeft + dd.scrollLeft;
          offset = elem.getBoundingClientRect();
          var c = pos[obj.p](wrap.offsetWidth, wrap.offsetHeight);
          b.style.top = c.top + top + 'px';
          b.style.left = c.left + left + 'px';
        }
      }(elem, wrap);
      isie ? w.attachEvent('onresize', func) : w.addEventListener('resize', func, false);
    }
    _this.append = function(p, closeBtn) {
      var r = rand = Math.floor(Math.random() * 10000);
      var x = document.createElement("DIV");
      x.id = prefix + r;
      x.innerHTML = html.replace("<%=p%>", p).replace(/<%=r%>/g, r);
      _this.parent.appendChild(x);
      if (closeBtn) {
        dg("ljClose" + r).onclick = _this.hide;
      } else {
        dg("ljClose" + r).style.display = "none";
      }
      return dg("tipsWrap-" + r);
    }

    _this.clear = function(a) {
      a && a.parentNode && a.parentNode.removeChild(a);
      isie ? w.detachEvent('onresize', func) : w.removeEventListener('resize', func, false);
      elem.lock = false; // 解除锁定
    }
    _this.hide = function() {
      _this.clear(dg(prefix + rand));
    }
    return _this;
  }
}();
